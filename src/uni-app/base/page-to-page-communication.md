# 页面间通信

页面间通信的作用不必多说，使用页面通信前必须保证**通信的 2 个页面都存活**，也就是说通过以下的 API 实现的页面跳转，无法实现页面通信：

- `uni.navigateBack` 关闭当前页面，回到上一个页面
- `uni.reLaunch` 关闭所有页面，打开到应用内的某个页面
- `uni.redirectTo` 关闭当前页面，跳转到其他页面
- `uni.switchTab` 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

## 如何实现页面通信

### 1. 事件总线

[官方文档](https://uniapp.dcloud.net.cn/api/window/communication.html)

这种方法和 `vue2` 的**全局事件总线**一个用法，用过全局事件总线看下官方文档就明白了

:::code-group

```vue [page-1.vue]｛14-16,20｝
<template>
  <view @tap="jumpToPage2">
    点击跳转到 page-2 页面
  </view>
</template>
<script setup lang="ts">
const jumpToPage2 = () => {
  uni.navigateTo({
    url: "/pages/page-2/page-2"
  })
}
onLoad(() => {
  // 启用对 accept-data 的监听
  uni.$on("accept-data", (data: any) => {
    console.log(data);
  })
})
onUnload(() => {
  // 清除监听
  uni.$off("accept-data")
})
</script>
```

```vue [page-2.vue]｛8｝
<template>
  <view @tap="back">
    点击回到 page-1 页面
  </view>
</template>
<script setup lang="ts">
const back = () => {
  uni.$emit("accept-data", "回传数据成功");
  uni.navigateBack();
}
onLoad(() => {})
</script>
```

:::

### 2. 通过 Pinia 实现通信

本质就是对 `Pinia` 内数据的处理，这里省略
