# uni-app API

## 页面跳转

[参考](https://uniapp.dcloud.net.cn/api/router.html)

- uni.navigateTo
  - 保留当前页面，跳转到其他非 tabbar 页面
- uni.navigateBack
  - 关闭当前页面，返回上一页或多级页面
- uni.redirectTo
  - 关闭当前页面，跳转到其他非 tabbar 页面
- uni.reLaunch
  - 关闭所有页面，打开到指定页面（包含 tabbar 页面）
- uni.switchTab
  - 关闭其他所有非 tabbar 页面，跳转到指定 tabbar 页面

### 获取页面跳转参数

在 uni-app 中，页面跳转允许携带参数，获取页面地址有 2 种方式：

- 通过 `defineProps` 获取 <Badge type='info' text='vue3+uni-app3' />

  ```vue [index.vue]
  <script setup lang="ts">
  const props = defineProps<{
    id: string;
  }>()
  console.log(props.id);
  </script>
  ```

- 通过页面生命周期钩子函数 `onLoad` <Badge type='info' text='vue3' />

  ```vue [index.vue]
  <script setup lang="ts">
  onLoad((opt) => {
    console.log(opt.id);
  })
  </script>
  ```

## 页面交互

### Toast - 轻提示

[参考](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast)
