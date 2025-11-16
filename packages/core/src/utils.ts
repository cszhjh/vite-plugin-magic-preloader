import parser from '@babel/parser'
import _traverse from '@babel/traverse'
import type { PreloadModule } from './types'

type Traverse = { default: typeof _traverse }

const traverse = (_traverse as unknown as Traverse).default

const magicCommentMap = new Map<string, string>()
  .set('vitePrefetch: true', 'prefetch')
  .set('vitePreload: true', 'preload')

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isNil(val: unknown): val is null | undefined {
  return val == null
}

export function extractPreloadModules(code: string) {
  const dynamicImportModules: PreloadModule[] = []
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'dynamicImport'],
  })

  traverse(ast, {
    CallExpression: (path) => {
      if (path.node.callee.type !== 'Import' || !path.node.arguments.length) {
        return
      }

      const {
        type,
        leadingComments,
        value = '',
      } = path.node.arguments[0] as (typeof path.node.arguments)[0] & {
        value: string
      }

      if (type !== 'StringLiteral' || !leadingComments?.length) {
        return
      }

      leadingComments
        .filter((comment) => comment.type === 'CommentBlock')
        .forEach((comment) => {
          const rel = magicCommentMap.get(comment.value.trim())
          if (rel) {
            dynamicImportModules.push({ moduleId: value, rel })
          }
        })
    },
  })

  return dynamicImportModules
}
