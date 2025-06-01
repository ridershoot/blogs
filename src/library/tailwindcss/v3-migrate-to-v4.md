# tailwindcss v3 版本升级到 v4 指南

## 初始化

### 安装

```shell
npm install tailwindcss @tailwindcss/vite
```

### 配置

- 配置 `vite.config.ts` 文件

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

- 配置 `main.css` 文件

这里的 `main.css` 文件指的是 `vue` 项目里面的入口 css 文件，不一定是 `main.css`， 也可能是 `index.css` 等等

```css [main.css]
@import "tailwindcss";
```

## 使用上的变化

v3 版本和 v4 版本变化很大，所以在这里整理一下变化

### 配置文件

[参考](https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file)

原本 v3 使用 `tailwind.config.ts` 来配置 `tailwindcss`， v4 版本依旧支持通过此配置文件来配置，但是不再默认自动扫描此配置文件，而是需要显式导入，如下所示：

```css
@config "../../tailwind.config.js";
```

v4 想要配置如**前缀、拓展工具类、自定义工具类**等等都可以通过 css 文件

### 同其他 css 预处理器一起工作

v4 版本不推荐再和预处理器一起工作，因为 `tailwindcss` 本身就相当于一个 css 预处理器，详情查看[这里](https://tailwindcss.com/docs/upgrade-guide#using-sass-less-and-stylus)

### 前缀配置方式

[参考](https://tailwindcss.com/docs/upgrade-guide#using-a-prefix)

v4 版本配置和使用前缀：

:::code-group

```css [index.css]
@import "tailwindcss" prefix(tw);
```

```html [index.html]
<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600"></div>
```

:::

:::details v3 版本配置和使用前缀

```ts [tailwind.config.ts]
module.exports = {
  prefix: 'tw-',
}
```

```html [index.html]
<div class="tw-text-lg md:tw-text-xl tw-bg-red-500 hover:tw-bg-blue-500"></div>
```

:::

### 预设样式

[参考](https://tailwindcss.com/docs/preflight)

`tailwindcss` 在引入的时候会包含预设样式，会重置如 `<button>`、`<li>` 等元素的样式，除此之外还可能和一些组件库的样式产生冲突，导致组件库样式失效，所以有时候会禁用掉这些预设样式。

默认情况下，`@import tailwindcss;` 会被转化成如下代码：

```css [main.css]
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
```

如果需要禁用预设样式，不使用 `@import tailwindcss;`，转而手动导入即可：

```css [main.css]
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base); /* [!code --] */
@import "tailwindcss/utilities.css" layer(utilities);
```

:::details v3 版本禁用预设样式

```ts [tailwind.config.ts]
module.exports = {
  corePlugins: {
    preflight: false,
  }
}
```

:::

### 工具类拓展

[参考](https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme)

内置工具类有时候不一定符合设计稿，这个时候可以选择拓展工具类

:::code-group

```css [main.css]
@theme {
  --color-primary: #ff0000;
}
```

```html [index.html]
<div class="bg-primary"></div>
```

:::

:::details v3 版本拓展工具类

```ts [tailwind.config.ts]
module.exports = {
  theme: {
    colors: {
      primary: "#ff0000"
    },
  },
}
```

```html [index.html]
<div class="bg-primary"></div>
```

:::

### 自定义工具类和自定义组件样式

[参考](https://tailwindcss.com/docs/adding-custom-styles)

### 个别工具类的变化

[参考](https://tailwindcss.com/docs/upgrade-guide#changes-from-v3)
