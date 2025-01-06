# vite-plugin-magic-preloader

**中文** | [English](./README.md)

Rollup/Vite 没有提供类似 `/* vitePrefetch: true */` 或 `/* vitePreload: true */` 的 [Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments), 但我们确实需要针对某些场景进行资源预加载

> [!TIP]
> 仅在 `import()` 中生效

## 安装

```bash
# yarn
yarn add vite-plugin-magic-preloader -D
# npm
npm install vite-plugin-magic-preloader -D
# pnpm
pnpm add vite-plugin-magic-preloader -D
```

## 使用

- vite.config.ts 中配置插件

```ts
import magicPreloader from 'vite-plugin-magic-preloader';

export default defineConfig({
  plugins: [magicPreloader()],
});
```

## 选项

| 参数        | 类型                                       | 默认值                    | 说明                   |
| ----------- | ------------------------------------------ | ------------------------- | ---------------------- |
| include     | `string \| RegExp \| (string \| RegExp)[]` | `/\.(js\|ts\|jsx\|tsx)$/` | 需要处理的文件         |
| exclude     | `string \| RegExp \| (string \| RegExp)[]` | `/node_modules/`          | 排除的文件             |
| crossorigin | `boolean`                                  | `true`                    | 是否启用 `crossorigin` |

### include

需要处理的依赖项，支持字符串、正则表达式、数组类型。默认情况下只处理不在 `node_modules` 中的 `js, ts, jsx, tsx` 文件

被命中的文件将会被当作 JavaScript 代码解析，请确保文件内容能被正确解析为 **AST Tree**

### exclude

排除的依赖项，支持字符串、正则表达式、数组类型

## 示例

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

若需要在 Vue 单文件组件中也使插件生效，请确保 `vite-plugin-magic-preloader` 在 `@vitejs/plugin-vue` 插件之后加载

```ts
import vue from '@vitejs/plugin-vue';
import magicPreloader from 'vite-plugin-magic-preloader';

export default defineConfig({
  plugins: [vue(), magicPreloader()],
});
```
