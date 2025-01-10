import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
  crossorigin?: boolean
}

export interface PreloadModule {
  moduleId: string
  rel: string
}
