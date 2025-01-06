# vite-plugin-magic-preloader

**English** | [中文](./README.zh_CN.md)

Rollup/Vite does not provide [Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments) like `/* vitePrefetch: true */` or `/* vitePreload: true */`, but there are scenarios where we need resource preloading.

> [!TIP]
> This only works within `import()` statements.

## Installation

```bash
# yarn
yarn add vite-plugin-magic-preloader -D
# npm
npm install vite-plugin-magic-preloader -D
# pnpm
pnpm add vite-plugin-magic-preloader -D
```

## Usage

- Configure the plugin in vite.config.ts

```ts
import magicPreloader from 'vite-plugin-magic-preloader';

export default defineConfig({
  plugins: [magicPreloader()],
});
```

## Options

| Option      | Type                                       | Default                   | Description                 |
| ----------- | ------------------------------------------ | ------------------------- | --------------------------- |
| include     | `string \| RegExp \| (string \| RegExp)[]` | `/\.(js\|ts\|jsx\|tsx)$/` | Files to process            |
| exclude     | `string \| RegExp \| (string \| RegExp)[]` | `/node_modules/`          | Files to exclude            |
| crossorigin | `boolean`                                  | `true`                    | is it enabled `crossorigin` |

### include

Specifies the dependencies to process. It supports string, regular expression, and array types. By default, only js, ts, jsx, tsx files that are not in node_modules are processed.

Files that are matched will be parsed as JavaScript code. Please ensure that the content of these files can be correctly parsed into an AST Tree.

### exclude

Specifies the dependencies to exclude. It supports string, regular expression, and array types.

## Example

```ts
const router = [
  {
    path: '/',
    component: () => import(/* vitePrefetch: true */ './views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import(/* vitePreload: true */ './views/About.vue'),
  },
];
```

If you need this plugin to work within Vue SFC, make sure that `vite-plugin-magic-preloader` is loaded after the `@vitejs/plugin-vue` plugin.

```ts
import vue from '@vitejs/plugin-vue';
import magicPreloader from 'vite-plugin-magic-preloader';

export default defineConfig({
  plugins: [vue(), magicPreloader()],
});
```
