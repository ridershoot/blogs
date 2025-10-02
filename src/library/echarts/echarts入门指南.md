# Echarts 入门指南

[Echarts](https://echarts.apache.org/zh/index.html)是一个比较出名的图表库

:::warning 注意

本文基于 `echarts` 的 `5.6.0` 版本。某些配置可能存在差异，请以官方文档为准。

:::

## 一、安装与引入

### 1. 安装

`Echarts` 可以通过以下命令进行安装：

```shell
pnpm add echarts
```

也可以通过 CDN 网站直接获取：

```html [index.html]
<script src="https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js"></script>
```

除了以上2种常见的安装方式，还支持**定制功能**，即根据需要安装对应的组件，减小项目依赖体积，具体可以参考[官方文档](https://echarts.apache.org/handbook/zh/basics/download/#%E5%9C%A8%E7%BA%BF%E5%AE%9A%E5%88%B6)

### 2. 引入

`Echarts` 有2种引入方式： **全部引入**和**按需引入**。

:::info 全部引入

全部引入最简单，不需要手动引入图表或其他组件，缺点是无法按需引入，打包后体积较大。

这种方式适合用来做demo，测试效果，平时开发不建议使用。

```js [main.js]
import * as echarts from 'echarts';
```

:::

:::info 按需引入

按需引入需要手动引入图表或其他组件，优点是可以按需引入，打包后体积较小。
比较麻烦的是需要手动引入相关依赖并注册，<u>如果依赖没有引入或注册可能会导致图表无法正常渲染</u>。

这种方式更适合大型项目，可以减小项目依赖体积。

```js [main.js]
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts';
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
```

:::

如果项目使用 `Echarts` 场景较多，可以考虑使用全部导入，否则使用按需导入对页面加载更加友好。

## 二、容器与初始化

想要使用 `Echarts` 渲染图表，需要一个 DOM 元素作为图表的容器。

要渲染图表，需要使用 `echarts.init` 方法初始化图表实例。

:::code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
  </head>
  <body>
    <div id="main"></div>
  </body>
</html>
```

```js [main.js]{2}
// 基于准备好的dom，初始化echarts实例
const myChart = echarts.init(document.getElementById("main"));
```

:::

### 1. 容器大小

容器大小有2种来源：

1. 容器本身样式
2. `echarts.init`

```html [index.html]{9-14}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <style type="text/css">
      #main {
        width: 100%;
        height: 100%
      }
    </style>
  </head>
  <body>
    <div id="main"></div>
  </body>
</html>
```

```js [main.js]{2-3}
const myChart = echarts.init(document.getElementById("main"), null, {
  width: 600,
  height: 400
});
```

### 2. 如何在页面变化的时候重新渲染图表？

结合 `window.addEventListener("resize", (event) => {})` 和 `echartsInstance.resize` 实现。

```js [main.js]
const myChart = echarts.init(document.getElementById("main"));
window.addEventListener('resize', function() {
  myChart.resize();
});
```

:::details 如果浏览器窗口没有发生变化，但是容器大小发生变化，要如何重新渲染图表？

容器大小有可能不只因为浏览器窗口大小而发生变化，还有可能因为JS或CSS而发生变化，这种时候需要结合 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 监听容器大小的变化，从而让图表重新渲染。

```js [main.js]{1,6-8}
const mainEl = document.getElementById("main")
const myChart = echarts.init(mainEl);
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { target } = entry;
    if (mainEl === target ) {
      myChart.resize();
    }
  }
})
```

:::

### 3. 组件隐藏显示后无法正常渲染图表？

在 vue 中，如果组件显示/隐藏后无法正常渲染图表，那可能是因为组件本身没有重新渲染，生命周期钩子函数没有重新执行，但是容器节点被销毁然后重建，此时虽然容器出现了，但和之前的容器节点不是同一个节点。

遇到这种问题，需要先销毁原有图表实例，再重新初始化实例

```vue{17-23}
<template>
  <div v-if="isShow" ref="chartRef"></div>
</template>
<script lang="ts" setup>
const { isShow } = defineProps<{
  isShow: boolean
}>();

const chartEl = useTemplateRef("chartRef");
const chartInstance = ref(null);
onMounted(() => {
  if (isShow && chartEl.value) {
    chartInstance.value = echarts.init(chartEl.value);
  }
});

watch(() => isShow, (newVal) => {
  if (newVal && chartEl.value) {
    chartInstance.value = echarts.init(chartEl.value);
  } else {
    chartInstance.value?.dispose();
  }
});
</script>
```

## 三、样式

## 四、数据集（Dataset）

## 五、数据转换（Transform）

## 六、坐标轴

## 七、视觉映射（VisualMap）

## 八、图例（Legend）

## 九、事件与行为
