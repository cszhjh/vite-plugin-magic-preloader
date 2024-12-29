import parser from '@babel/parser';
import _traverse from '@babel/traverse';
import type { PreloadModule } from './types';

type Traverse = { default: typeof _traverse };

const traverse = (_traverse as unknown as Traverse).default;

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

export function extractPreloadModules(code: string) {
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

      if (type === 'StringLiteral' && leadingComments?.length && leadingComments[0].type === 'CommentBlock') {
        const magicComment = magicComments.find(({ comment }) => comment === leadingComments[0].value.trim());
        magicComment && dynamicImportModules.push({ moduleId: value, rel: magicComment.rel });
      }
    },
  });

  return dynamicImportModules;
}
