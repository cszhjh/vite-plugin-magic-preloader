export interface PluginOptions {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
  crossorigin?: boolean
}

export interface PreloadModule {
  moduleId: string
  rel: string
}
