# Echarts 入门指南

[Echarts](https://echarts.apache.org/zh/index.html)是一个比较常用的图表库，开发管理后台经常会使用到这个库，掌握它的用法十分重要，接下来就让我们一起学习如何使用 `Echarts`。

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

全部引入最简单，不需要手动引入图表或其他组件，缺点是打包后体积较大。

这种方式适合用来做demo，实现图表效果，平时开发不建议使用。

```js [main.js]
import * as echarts from 'echarts';
```

:::

:::info 按需引入

按需引入需要手动引入图表或其他组件，优点是打包后体积较小。
比较麻烦的是需要手动引入相关依赖并注册，<u>如果依赖没有引入或注册可能会导致图表无法正常渲染</u>。

这种方式更适合正式去开发项目时使用，可以减小项目依赖体积。

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
2. 通过`echarts.init`设置容器大小

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

### 2. 如何在页面变化的时候重新渲染图表？<Badge type='info' text='拓展' />

结合 `window.addEventListener("resize", (event) => {})` 和 `echartsInstance.resize` 实现。

```js [main.js]
const myChart = echarts.init(document.getElementById("main"));
window.addEventListener('resize', function() {
  myChart.resize();
});
```

:::details 如果浏览器窗口没有发生变化，但是容器大小发生变化，要如何重新渲染图表？

容器大小有可能不只因为浏览器窗口大小而发生变化，还有可能因为JS或CSS而发生变化，这种时候需要结合 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 监听容器大小的变化，从而让图表重新渲染。

```js [main.js]{1,6-8,11}
const mainEl = document.getElementById("main")
const myChart = echarts.init(mainEl);
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { target } = entry;
    if (mainEl === target ) {
      myChart.resize();
    }
  }
});
observer.observe(mainEl);
```

:::

### 3. 组件隐藏显示后无法正常渲染图表？<Badge type='info' text='拓展' />

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

这里的样式指的不是通过 CSS 属性修改样式，而是通过 `Echarts` 配置调整图表里面的图表项大小、颜色、位置、文案。

### 1. 颜色主题（theme）

顾名思义，颜色主题就是一整套预设好的样式，在 `echarts` 对象上注册，在 `Echarts` 初始化的时候应用，作用于单个 `Echarts` 实例。

:::info 主题来源
主题有 2 种来源，一种是 `Echarts` 官方的[主题编译器](https://echarts.apache.org/zh/theme-builder.html)，还有一种就是开发者自己的设置的主题对象。
:::

```js [main.js]
import VintageTheme from './theme/vintage.json'; // 导入主题配置
// 注册主题
echarts.registerTheme("vintage", VintageTheme);
// 应用主题
const myChart = echarts.init(document.getElementById("main"), "vintage");
```

更多使用主题的内容请看[官方文档](https://echarts.apache.org/handbook/zh/concepts/style/#%E9%A2%9C%E8%89%B2%E4%B8%BB%E9%A2%98%EF%BC%88theme%EF%BC%89)

### 2. 调色盘（color）

设置一组颜色，图形、系列会自动从其中选择颜色

```js{5,21}
const myChart = echarts.init(document.getElementById("main"));

// 指定图表的配置项和数据
const option = {
  color: ['#9dd2e7', '#f39393'],
  title: {
    text: 'ECharts 入门示例',
  },
  tooltip: {},
  legend: {
    data: ['销量', '利润', '成本'],
  },
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      color: ["#ff0000"],
      data: [5, 20, 36, 10, 10, 20],
    },
    {
      name: '利润',
      type: 'bar',
      data: [20, 30, 3, 1, 7, 14],
    },
    {
      name: '成本',
      type: 'bar',
      data: [15, 3, 39, 6, 4, 13],
    },
  ],
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
```

<AppImage src="../../image/1759477143866.png" alt="echarts - colors" />

### 3. 直接样式设置 <Badge type='tip' text='重要' />

直接样式设置就是通过 `Echarts` 配置直接修改图表的样式，具体来说可以通过**itemStyle**、**lineStyle**、**areaStyle**等属性修改样式。

```js
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {
    data: ["销量", "利润", "成本"],
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
      itemStyle: { // [!code focus]
        color: "#FF0000", // [!code focus]
      }, // [!code focus]
    },
  ],
};
```

<AppImage src="../../image/20251003164615.png" alt="echarts - itemStyle" />

除了可以设置图表样式，还可以通过 `emphasis` 属性设置图表高亮的样式。

```js
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {
    data: ["销量", "利润", "成本"],
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
      itemStyle: {
        color: "#FF0000",
      },
      emphasis: { // [!code focus]
        itemStyle: { // [!code focus]
          color: "#0000FF", // [!code focus]
        }, // [!code focus]
      }, // [!code focus]
    },
  ],
};
```

<AppImage src="../../image/20251003164959.png" alt="echarts - lineStyle" />

更多内容请查看[官方文档](https://echarts.apache.org/zh/option.html#series-bar.itemStyle)

### 4. 视觉映射（visualMap）<Badge type='tip' text='重要' />

视觉映射相关内容请查看[这里](#七、视觉映射-visualmap)

### 5. 我应该使用什么方式来调整图表样式？<Badge type='info' text='拓展' />

从影响范围来说，`主题>调色盘>直接样式设置=视觉映射` 。颜色主题注册于 `echarts` 对象上，调色盘注册于 `echarts` 实例上，两者都对 `Echarts` 实例所有图表内容还有组件生效。直接样式设置和视觉映射则只针对某一个系列生效。

从可操作性上来说，`视觉映射>直接样式设置>主题=调色盘` 。视觉映射最灵活，可操作性最强，直接样式设置次之，主题和调色盘最弱。

实际开发过程中，优先使用视觉映射；主题只在需要全局调整颜色的时候使用，同时 `Echarts` 自身也有主题，一般不需要自己去定义主题，除非设计有成系列的设计；调色盘也是相同道理；至于直接样式设置，因为需要将配置写到每一个系列当中，可维护度不高，同时灵活性不如视觉映射，一般不怎么用。

## 四、数据集（Dataset）

## 五、数据转换（Transform）

## 六、坐标轴

## 七、视觉映射（VisualMap）

## 八、图例（Legend）

## 九、事件与行为
