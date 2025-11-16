import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
  attrs?: Record<string, string | boolean> | ((href: string) => Record<string, string | boolean>)
}

export interface PreloadModule {
  moduleId: string
  rel: string
}
