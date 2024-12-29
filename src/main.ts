import { type ResolvedConfig, type Plugin } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import { extractPreloadModules } from './utils';
import type { PluginOptions, PreloadModule } from './types';

export default function magicPreloaderPlugin({
  include = /\.(js|ts|jsx|tsx)$/,
  exclude = /node_modules/,
  crossorigin = true,
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
      if (!filter(id)) {
        return null;
      }

      const magicString = new MagicString(code);
      const modules = extractPreloadModules(code);
      const preloadModules = await Promise.all(
        modules.map(async ({ moduleId, rel }) => {
          const moduleInfo = await this.resolve(moduleId, id);
          return { moduleId: moduleInfo?.id || '', rel };
        }),
      );
      dynamicImportModules.push(...preloadModules);
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ source: id, includeContent: true }),
      };
    },

    async generateBundle(_, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const file = bundle[fileName];
        if (file.type !== 'chunk') {
          continue;
        }

        const module = dynamicImportModules.find(({ moduleId }) => moduleId === file.facadeModuleId);
        module && preloadBundles.push({ moduleId: fileName, rel: module.rel });
      }
    },

    async transformIndexHtml(html) {
      return {
        html,
        tags: preloadBundles.map(({ rel, moduleId }) => ({
          tag: 'link',
          injectTo: 'head',
          attrs: {
            rel,
            href: `${config.base}${moduleId}`,
            ...(crossorigin ? { crossorigin: true } : {}),
          },
        })),
      };
    },
  };
}
