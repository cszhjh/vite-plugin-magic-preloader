import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import { type Plugin, type ResolvedConfig } from 'vite'
import type { PluginOptions, PreloadModule } from './types'
import { extractPreloadModules } from './utils'

export default function magicPreloaderPlugin({
  include = /\.(js|ts|jsx|tsx)$/,
  exclude = /node_modules/,
  crossorigin = true,
}: PluginOptions = {}): Plugin {
  const dynamicImportModuleMap: Map<string | undefined | null, string> = new Map()
  const preloadBundles: PreloadModule[] = []
  const filter = createFilter(include, exclude)

  let config: ResolvedConfig

  return {
    name: 'vite-plugin-magic-preloader',

    async configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async transform(code, id) {
      if (!filter(id)) {
        return null
      }

      const magicString = new MagicString(code)

      const modules = extractPreloadModules(code)
      const resolvedModules = await Promise.allSettled(modules.map(({ moduleId }) => this.resolve(moduleId, id)))
      resolvedModules.forEach((result, index) => {
        const { moduleId, rel } = modules[index]

        if (result.status === 'fulfilled') {
          dynamicImportModuleMap.set(result.value?.id, rel)
        } else {
          this.error(`Failed to resolve module: ${moduleId}. The reason is: ${result.reason}`)
        }
      })

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ source: id, includeContent: true }),
      }
    },

    async generateBundle(_, bundle) {
      const bundleEntries = Object.entries(bundle)
      for (const [fileName, file] of bundleEntries) {
        if (file.type !== 'chunk') {
          continue
        }

        const rel = dynamicImportModuleMap.get(file.facadeModuleId)
        if (rel) {
          preloadBundles.push({ moduleId: fileName, rel })
        }
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
      }
    },
  }
}
