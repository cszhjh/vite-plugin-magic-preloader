import { type ResolvedConfig, type Plugin } from 'vite';
import parser from '@babel/parser';
import traverse from '@babel/traverse';

const { createFilter } = require('@rollup/pluginutils');

export interface PluginOptions {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

interface PreloadModule {
  moduleId: string;
  rel: string;
}

const magicComments = [
  {
    comment: 'vitePrefetch: true',
    rel: 'prefetch',
  },
  {
    comment: 'vitePreload: true',
    rel: 'preload',
  },
];

function extractPreloadModules(code: string) {
  const dynamicImportModules: PreloadModule[] = [];
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'dynamicImport'],
  });

  traverse(ast, {
    CallExpression: path => {
      if (path.node.callee.type !== 'Import' || !path.node.arguments.length) {
        return;
      }

      const {
        type,
        leadingComments,
        value = '',
      } = path.node.arguments[0] as (typeof path.node.arguments)[0] & { value: string };

      if (
        type === 'StringLiteral' &&
        leadingComments?.length &&
        leadingComments[0].type === 'CommentBlock'
      ) {
        const magicComment = magicComments.find(
          ({ comment }) => comment === leadingComments[0].value.trim(),
        );
        magicComment && dynamicImportModules.push({ moduleId: value, rel: magicComment.rel });
      }
    },
  });

  return dynamicImportModules;
}

export default function magicPreloaderPlugin({
  include = /\.(js|ts|jsx|tsx|vue)$/,
  exclude,
}: PluginOptions = {}): Plugin {
  const dynamicImportModules: PreloadModule[] = [];
  const preloadBundles: PreloadModule[] = [];
  const filter = createFilter(include, exclude);

  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-magic-preloader',

    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async transform(code, id) {
      if (id.includes('node_modules') || !filter(id)) {
        return;
      }

      const modules = extractPreloadModules(code);
      const preloadModules = await Promise.all(
        modules.map(async ({ moduleId, rel }) => {
          // const moduleInfo = await this.resolve(moduleId, id);
          return { moduleId: moduleId || '', rel };
        }),
      );
      dynamicImportModules.push(...preloadModules);
      return code;
    },

    async generateBundle(_, bundle) {
      Object.keys(bundle).forEach(async fileName => {
        const file = bundle[fileName];
        if (file.type !== 'chunk') {
          return;
        }

        const module = dynamicImportModules.find(
          ({ moduleId }) => moduleId === file.facadeModuleId,
        );
        module && preloadBundles.push({ moduleId: fileName, rel: module.rel });
      });
    },

    async transformIndexHtml(html) {
      const reg = /<head>([\s\S]*)<\/head>/;
      const headContent = html.match(reg)?.[1] ?? '';
      const preloadBundlesString = preloadBundles
        .map(({ moduleId, rel }) => {
          return `<link rel="${rel}" href="${config.base}${moduleId}" />\n`;
        })
        .join('');
      const newHeadContent = `${headContent}${preloadBundlesString}`;
      return html.replace(reg, `<head>${newHeadContent}</head>`);
    },
  };
}
