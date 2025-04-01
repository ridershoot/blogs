# pages.json 配置文件

[uni-app pages.json 配置](https://uniapp.dcloud.net.cn/collocation/pages.html)

## easycom - 自动导入组件

[easycom](https://uniapp.dcloud.net.cn/collocation/pages.html#easycom) 可以称得上是 uni-app 版本的 [unplugin-vue-components](https://unplugin.unjs.io/showcase/unplugin-vue-components.html)。如果你知道 unplugin-vue-components ，那么你应该就知道 easycom 是用于**自动导入并注册组件**的。

组件本身的作用是复用代码，能够被复用就说明了组件会在很多地方被导入并注册。

在 vue2 里面，我们需要像这样去使用一个组件：

```vue
<template>
  <div class="content">
    <custom-navigation-bar></custom-navigation-bar>
  </div>
</template>

<script>
import CustomNavigationBar from "@/components/custom-navigation-bar";
export default {
  components:{
    CustomNavigationBar :CustomNavigationBar
  }
}
</script>
```

在 vue3 里面，有了 setup 和 CompositionAPI ，注册组件会更加简单：

```vue
<template>
  <div class="content">
    <custom-navigation-bar></custom-navigation-bar>
  </div>
</template>

<script setup lang="ts">
import CustomNavigationBar from "@/components/custom-navigation-bar";
</script>
```

在 uni-app 中，配置上 easycom ，我们可以这样使用组件：

```vue
<template>
  <div class="content">
    <custom-navigation-bar></custom-navigation-bar>
  </div>
</template>

<script setup lang="ts">
import CustomNavigationBar from "@/components/custom-navigation-bar"; // [!code --]
</script>
```

使用 easycom 有几点需要注意：

- 默认情况下自动开启
- 对自动导入的组件文件存放路径有要求
  - 安装在项目根目录的 components 目录下，并符合 `components/组件名称/组件名称.vue`
    - **这点需要注意下，如果是通过命令行创建的 uni-app 项目，符合 `src/components/组件名称/组件名称.vue` 的组件就能够自动导入**
  - 安装在 uni_modules 下，路径为 `uni_modules/插件ID/components/组件名称/组件名称.vue`

除了那些符合路径规范的组件，还允许自定义组件匹配规则，具体看[文档](https://uniapp.dcloud.net.cn/collocation/pages.html#easycom)
