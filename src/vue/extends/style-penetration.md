# Vue 中的样式穿透

在 vue 中有一个特殊的 css 问题：无法修改组件的样式，相信开发过的 vue 项目的人都遇到过这个问题，除非你选择将所有的样式都写在全局作用域下面，但即使如此相信你也曾听闻过这个问题。

对于这个问题，你肯定也知道如何解决它，那就是**样式穿透**，直接看代码：

<Badge type='info' text='vue3' /> 实现样式穿透

```vue{10-19}
<template>
  <n-button
    type="error"
    class="test"
  >
    这是一个测试用例
  </n-button>
</template>
<style scoped lang="scss">
// 写法不区分 css/scss/less
.test {
  :deep(span) {
    background-color: red;
  }
  // 另一种写法
  /*::v-deep(span){
    background-color: red;
  }*/
}
</style>
```

<Badge type='info' text='vue2' /> 实现样式穿透

```vue{10-18,21-26,29-33}
<template>
  <n-button
    type="error"
    class="test"
  >
    这是一个测试用例
  </n-button>
</template>
<style scoped>
/* .test /deep/ span {
  background-color: red;
} */
/* .test >>> span {
  background-color: red;
} */
/* .test ::v-deep span {
  background-color: red;
} */
</style>
<style scoped lang="less">
/* .test ::v-deep span {
  background-color: red;
} */
/* .test /deep/ span {
  background-color: red;
} */
</style>
<style scoped lang="scss">
.test {
  ::v-deep span {
    background-color: red;
  }
}
</style>
```

以上代码分别展示了 vue2 和 vue3 中如何使用样式穿透来修改组件中元素的样式。

在很多时候修改组件中元素样式首先会在组件上加一个 `class` 类名，然后先加一个样式，测试下能不能直接修改，如果不能就会知道这是样式作用域的问题，就会尝试样式穿透，一般用上样式穿透就能成功修改组件里面元素的样式，但有时候即使加上样式穿透也无法修改，这个时候就很让人抓狂，所以我就想要知道为什么会存在样式作用域、样式穿透的原理这些知识。
