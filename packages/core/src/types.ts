import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
  /**
   * @deprecated
   */
  crossorigin?: boolean
  attrs?: Record<string, string>
}

export interface PreloadModule {
  moduleId: string
  rel: string
}
