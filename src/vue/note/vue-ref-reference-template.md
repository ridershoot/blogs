# vue 通过 ref 获取到组件实例遇到的问题

在 vue 中会通过给组件添加 `ref` 属性并声明同名响应式数据来获取组件实例，以此来获取组件中的暴露出来的数据，或者调用组件中的方法，像这样：

```vue
<template>
  <custom-nav-bar ref="navBar"></custom-nav-bar>
</template>

<script setup lang="ts">
import type { ComponentInstance } from "vue";
import CustomNavBar from "@/components/custom-nav-bar/index.vue";
const navBar = ref<ComponentInstance<typeof CustomNavBar>>();
</script>
```

上面就是通过 `ref` 获取到组件实例的代码，看起来没有什么难处，但是有时候比较粗心，会将 `ref` 的值写成一个响应式数据，比如这样：

```vue
<template>
  <custom-nav-bar :options="navBar" ref="navBar"></custom-nav-bar>
</template>

<script setup lang="ts">
import type { ComponentInstance } from "vue";
import CustomNavBar from "@/components/custom-nav-bar/index.vue";

const navBar = ref({
  height: 60,
  mode: 'light',
});
const navBarRef = ref<ComponentInstance<typeof CustomNavBar>>();
</script>
```
