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

实际开发过程中，应该根据需求决定使用什么技术，视觉映射和直接样式设置使用的比较多；主题只在需要全局调整颜色的时候使用，同时 `Echarts` 自身也有主题，一般不需要自己去定义主题，除非设计有成系列的设计；调色盘也是相同道理。

## 四、数据集（Dataset）

数据集是一种不同于直接在系列中维护数据的方式，数据集将数据从不常变化的配置中抽离出来，以此提高配置的可维护性。

也许初学者认为有了 `series.data` 就不需要 `dataset` 了，但请相信我，学会使用 `dataset` 后，你会发现再也离不开它。

### 1. 为什么要使用数据集而不是直接在系列中维护数据？<Badge type='tip' text='重要' />

前面已经说过了，使用 `dataset` 比使用 `series.data` 可维护性高。实际开发过程中总离不开异步请求数据，然后再更新图表数据，将数据从配置中抽离出来，更新时也只更新数据而不更新配置，此时使用 `dataset` 就能很好地满足需求。

多说无益，直接看代码吧。

下面是直接在系列中维护数据的代码：

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
    },
    {
      name: "利润",
      type: "bar",
      data: [10, 20, 30, 40, 50, 60],
    },
    {
      name: "成本",
      type: "bar",
      data: [10, 20, 30, 40, 50, 60],
    },
  ],
};
```

下面是使用数据集的代码：

```js
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {
    data: ["销量", "利润", "成本"], // [!code --]
  },
  xAxis: {
    type: "category",
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"], // [!code --]
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      name: "销量", // [!code --]
      data: [5, 20, 36, 10, 10, 20], // [!code --]
    },
    {
      type: "bar",
      name: "利润", // [!code --]
      data: [10, 20, 30, 40, 50, 60], // [!code --]
    },
    {
      type: "bar",
      name: "成本", // [!code --]
      data: [10, 20, 30, 40, 50, 60], // [!code --]
    },
  ],
  dataset: { // [!code ++]
    source: [ // [!code ++]
      ["产品", "销量", "利润", "成本"], // [!code ++]
      ["衬衫", 5, 10, 10], // [!code ++]
      ["羊毛衫", 20, 20, 20], // [!code ++]
      ["雪纺衫", 36, 30, 30], // [!code ++]
      ["裤子", 10, 40, 40], // [!code ++]
      ["高跟鞋", 10, 50, 50], // [!code ++]
      ["袜子", 20, 60, 60], // [!code ++]
    ], // [!code ++]
  }, // [!code ++]
};
```

对比下来可以看到不仅仅是 `series.data` 中的数据被抽离出来，连 `xAxis.data` 和 `legend.data` 中的数据也被抽离出来，将原本写死并且分散的数据都集中到数据集里面，当需要更新数据时，只需要更新数据集里面的数据，而不需要更新配置，这就是 `dataset` 的妙用。

### 2. 维度（dimension）<Badge type='tip' text='重要' />

> 当我们把系列（series）对应到“列”的时候，那么每一列就称为一个“维度（dimension）”，而每一行称为数据项（item）。反之，如果我们把系列（series）对应到表行，那么每一行就是“维度（dimension）”，每一列就是数据项（item）。

根据[官方文档](https://echarts.apache.org/handbook/zh/concepts/dataset#%E7%BB%B4%E5%BA%A6%EF%BC%88dimension%EF%BC%89)表示，**维度其实就是系列，维度就是需要比较的内容**。

就拿上面的 `dataset` 来说，

```json
[
  ["产品", "销量", "利润", "成本"],
  ["衬衫", 5, 10, 10],
  ["羊毛衫", 20, 20, 20],
  ["雪纺衫", 36, 30, 30],
  ["裤子", 10, 40, 40],
  ["高跟鞋", 10, 50, 50],
  ["袜子", 20, 60, 60],
]
```

维度可以是 **销量**、**利润**、**成本**，我可以从这 3 个方面比较不同产品在不同维度上的表现；也可以从**衬衫**、**羊毛衫**、**雪纺衫**、**裤子**、**高跟鞋**、**袜子**这 6 个方面比较同一产品在不同维度上的表现。

如何控制数据集到图表的映射是我们接下来要学习的 2 个知识点：`seriesLayoutBy` 和 `encode`，前者简单控制使用列还是行作为维度，后者灵活控制数据集到系列中的映射，涉及到 x 轴、y 轴、tooltip、系列名等等。

### 3. seriesLayoutBy

默认情况下，`seriesLayoutBy` 值为 `column` ，即使用列作为维度。就拿上面的数据来说，就是拿**销量**、**利润**、**成本**这 3 个列作为维度，所以需要 3 个系列，最终效果如下图所示：

<AppImage src="../../image/20251004112213.png" alt="echarts - seriesLayoutBy column" />

当然也可以将 `seriesLayoutBy` 值为 `row` ，即使用行作为维度。

```js
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  dataset: {
    source: [
      ["产品", "销量", "利润", "成本"],
      ["衬衫", 5, 10, 10],
      ["羊毛衫", 20, 20, 20],
      ["雪纺衫", 36, 30, 30],
      ["裤子", 10, 40, 40],
      ["高跟鞋", 10, 50, 50],
      ["袜子", 20, 60, 60],
    ],
  },
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      seriesLayoutBy: "row", // [!code ++]
    },
    {
      type: "bar",
      seriesLayoutBy: "row", // [!code ++]
    },
    {
      type: "bar",
      seriesLayoutBy: "row", // [!code ++]
    },
    { // [!code ++]
      type: "bar", // [!code ++]
      seriesLayoutBy: "row", // [!code ++]
    }, // [!code ++]
    { // [!code ++]
      type: "bar", // [!code ++]
      seriesLayoutBy: "row", // [!code ++]
    }, // [!code ++]
  ],
};
```

同样拿上面的数据来说，就是拿**衬衫**、**羊毛衫**、**雪纺衫**、**裤子**、**高跟鞋**、**袜子**这 6 行作为维度，需要 6 个系列，最终效果如下图所示：

<AppImage src="../../image/20251004112430.png" alt="echarts - seriesLayoutBy row" />

### 4. 映射（encode）<Badge type='tip' text='重要' />

通过 `series.encode` 可以指定使用 `dataset` 里面的哪个维度的数据来渲染图表里面的内容，比如系列名称（seriesName）、x 轴（x）、y 轴（y）、tooltip 等。

```js{14-20,24-30}
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      encode: {
        x: 0, // 指定了使用第 0 个维度作为 x 轴的值
        y: 2, // 指定了使用第 2 个维度作为 y 轴的值，第 2 维度为成本维度，所以这里会根据不同产品的成本渲染柱状图的高度
        seriesName: 2, // 图例（Legend）的名称以及 tooltip 里面的系列名称
        itemName: 0, // tooltip 里面的数据项名称
        tooltip: 2, // tooltip 里面的数据值
      },
    },
    {
      type: "bar",
      encode: {
        x: 0,
        y: 1,
        seriesName: 1,
        itemName: 0,
        tooltip: 1,
      },
    },
  ],
  dataset: [
    {
      source: [
        ["产品", "销量", "成本"],
        ["衬衫", 5, 10],
        ["羊毛衫", 20, 20],
        ["雪纺衫", 36, 30],
        ["裤子", 10, 40],
        ["高跟鞋", 10, 50],
        ["袜子", 20, 60],
      ],
    },
  ],
};
```

<AppImage src="../../image/20251004153410.png" alt="echarts - encode" />

上面的代码中，通过 `encode` 指定使用 `dataset` 里面的哪个维度的数据来渲染图表里面的内容。

除了上面列出来的 `encode` 属性，还有一些只能在指定图表中的 `encode` 属性，具体请看 [这里](https://echarts.apache.org/handbook/zh/concepts/dataset#%E6%95%B0%E6%8D%AE%E5%88%B0%E5%9B%BE%E5%BD%A2%E7%9A%84%E6%98%A0%E5%B0%84%EF%BC%88series.encode%EF%BC%89)。

### 5. 多数据集时要如何在不同数据集中使用指定数据集？<Badge type='tip' text='重要' />

通过 `series.datasetIndex` 指定使用哪个数据集。

```js
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
    },
    {
      type: "bar",
      datasetIndex: 1, // [!code focus]
    },
  ],
  dataset: [
    {
      source: [
        ["产品", "销量"],
        ["衬衫", 5],
        ["羊毛衫", 20],
        ["雪纺衫", 36],
        ["裤子", 10],
        ["高跟鞋", 10],
        ["袜子", 20],
      ],
    },
    {
      source: [
        ["产品", "成本"],
        ["衬衫", 10],
        ["羊毛衫", 20],
        ["雪纺衫", 30],
        ["裤子", 40],
        ["高跟鞋", 50],
        ["袜子", 60],
      ],
    },
  ],
};
```

### 6. 不同的数据集格式<Badge type='info' text='拓展' />

除了二维数组格式，`Echarts` 还支持对象格式。

```js{36-41,25-29}
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      encode: {
        x: "product",
        y: "sales",
        seriesName: "sales",
        itemName: "product",
        tooltip: "sales",
      },
    },
    {
      type: "bar",
      encode: {
        x: "product",
        y: "cost",
        seriesName: "cost",
        itemName: "product",
        tooltip: "cost",
      },
    },
  ],
  dataset: [
    {
      source: [
        { product: "shirt", sales: 5, cost: 10 },
        { product: "sweater", sales: 20, cost: 20 },
        { product: "chiffon", sales: 36, cost: 30 },
        { product: "pants", sales: 10, cost: 40 },
        { product: "heels", sales: 10, cost: 50 },
        { product: "socks", sales: 20, cost: 60 },
      ],
    },
  ],
};
```

使用对象格式数据集有以下几点需要注意：

1. 需要注意的是，如果使用对象格式，`series.encode` 里面的属性值不能使用维度下标，只能使用维度名称。
2. 对象格式不支持 `series.seriesLayoutBy` 属性。

### 7. 数据集不支持所有图表类型

`dataset` 并不支持所有图表类型，支持 `dataset` 的图表有：

- line
- bar
- pie
- scatter
- effectScatter
- parallel
- candlestick
- map
- funnel
- custom

更多内容请看 [这里](https://echarts.apache.org/handbook/zh/concepts/dataset#%E5%85%B6%E4%BB%96)

## 五、数据转换（Transform）

数据转换必须配合数据集使用，数据转换简单理解就和 `Array.prototype.map`、`Array.prototype.filter`、`Array.prototype.sort` 作用一样，
对已有数据处理然后得到新的数据。

### 1. filter

`filter` 就是过滤，针对某一个或多个维度的数据进行数值比较，然后过滤出符合要求的数据。

```js{36-62}
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      datasetIndex: 1,
      type: "bar",
      encode: {
        x: 0,
        y: 1,
        seriesName: 1,
        itemName: 0,
        tooltip: 1,
      },
    },
  ],
  dataset: [
    {
      source: [
        ["product", "sales", "cost"],
        ["shirt", 5, 10],
        ["sweater", 20, 20],
        ["chiffon", 36, 30],
        ["pants", 10, 40],
        ["heels", 10, 50],
        ["socks", 20, 60],
      ],
    },
    {
      fromDatasetIndex: 0, // 设置从哪个数据集获取数据，如果不设置 fromDatasetIndex 或 fromDatasetId，默认从第1个数据集获取数据，建议始终设置
      transform: {
        type: "filter",
        config: {
          or: [
            {
              dimension: 2,
              "=": 60,
            },
            {
              and: [
                {
                  dimension: 1,
                  ">=": 10,
                },
                {
                  dimension: 2,
                  "<=": 40,
                },
              ],
            },
          ],
        },
        print: true, // 在浏览器控制台中输出数据转换结果，方便调试
      },
    },
  ],
};
```

<AppImage src="../../image/20251005110331.png" alt="echarts - transform - filter" />

:::details 知识点讲解

上面的配置其实很好理解，`or` 表示或，`and` 表示并且，`dimension` 表示要以哪个维度的数据进行比较，剩下的其实就是一些比较符号。

整体下来的过滤逻辑是从第1个数据集中获取数据，过滤出以下数据：

- 第2维度（cost）中数值为60的数据
- 第1维度（sales）中数值大于等于10并且第2维度（cost）中数值小于等于40的数据

配置 `print` 输出结果如下：

<AppImage src="../../image/20251005111910.png" alt="echarts - transform - filter - print" />

符合过滤逻辑。

:::

:::details filter 的参数类型

```ts
type FilterTransform = {
  type: 'filter';
  config: ConditionalExpressionOption;
};
type ConditionalExpressionOption =
  | true
  | false
  | RelationalExpressionOption
  | LogicalExpressionOption;
type RelationalExpressionOption = {
  dimension: DimensionName | DimensionIndex;
  parser?: 'time' | 'trim' | 'number';
  lt?: DataValue; // less than
  lte?: DataValue; // less than or equal
  gt?: DataValue; // greater than
  gte?: DataValue; // greater than or equal
  eq?: DataValue; // equal
  ne?: DataValue; // not equal
  '<'?: DataValue; // lt
  '<='?: DataValue; // lte
  '>'?: DataValue; // gt
  '>='?: DataValue; // gte
  '='?: DataValue; // eq
  '!='?: DataValue; // ne
  '<>'?: DataValue; // ne (SQL style)
  reg?: RegExp | string; // RegExp
};
type LogicalExpressionOption = {
  and?: ConditionalExpressionOption[];
  or?: ConditionalExpressionOption[];
  not?: ConditionalExpressionOption;
};
type DataValue = string | number | Date;
type DimensionName = string;
type DimensionIndex = number;
```

:::

### 2. sort

`sort` 就是对已有数据进行排序。

```js{36-46}
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      datasetIndex: 1,
      type: "bar",
      encode: {
        x: 0,
        y: 1,
        seriesName: 1,
        itemName: 0,
        tooltip: 1,
      },
    },
  ],
  dataset: [
    {
      source: [
        ["product", "sales", "cost"],
        ["shirt", 5, 10],
        ["sweater", 20, 20],
        ["chiffon", 36, 30],
        ["pants", 10, 40],
        ["heels", 10, 50],
        ["socks", 20, 60],
      ],
    },
    {
      fromDatasetIndex: 0,
      transform: {
        type: "sort",
        config: {
          dimension: 1,
          order: "asc",
        },
        print: true,
      },
    },
  ],
};
```

<AppImage src="../../image/20251005155619.png" alt="echarts - transform - sort" />

:::details sort 的参数类型

```ts
type SortTransform = {
  type: 'sort';
  config: OrderExpression | OrderExpression[];
};
type OrderExpression = {
  dimension: DimensionName | DimensionIndex;
  order: 'asc' | 'desc';
  incomparable?: 'min' | 'max';
  parser?: 'time' | 'trim' | 'number';
};
type DimensionName = string;
type DimensionIndex = number;
```

:::

### 3. 更多数据转换器

常用的数据转换器就是 `filter`、`sort`，更多请看 [这里](https://echarts.apache.org/handbook/zh/concepts/data-transform#%E4%BD%BF%E7%94%A8%E5%A4%96%E9%83%A8%E7%9A%84%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2%E5%99%A8)。

### 4. 数据转换进阶使用<Badge type='info' text='拓展' />

（1） transform 链式调用

```js{38-55}
const option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
  series: [
    {
      datasetIndex: 1,
      type: "bar",
      encode: {
        x: 0,
        y: 1,
        seriesName: 1,
        itemName: 0,
        tooltip: 1,
      },
    },
  ],
  dataset: [
    {
      source: [
        ["product", "sales", "cost"],
        ["shirt", 5, 10],
        ["sweater", 20, 20],
        ["chiffon", 36, 30],
        ["pants", 10, 40],
        ["heels", 10, 50],
        ["socks", 20, 60],
      ],
    },
    {
      fromDatasetIndex: 0,
      transform: [
        {
          type: "filter",
          config: {
            dimension: 1,
            ">=": 10,
          },
          print: true,
        },
        {
          type: "sort",
          config: {
            dimension: 1,
            order: "asc",
          },
          print: true,
        },
      ],
    },
  ],
};
```

（2） 指定获取 transform 输出结果

> 在大多数场景下，transform 只需输出一个 data 。但是也有一些场景，需要输出多个 data ，每个 data 可以被不同的 series 或者 dataset 所使用。
>
>例如，在内置的 "boxplot" transform 中，除了 boxplot 系列所需要的 data 外，离群点（ outlier ）也会被生成，并且可以用例如散点图系列显示出来。
>
> 我们提供配置 `dataset.fromTransformResult` 来满足这种情况

更多请看 [这里](https://echarts.apache.org/handbook/zh/concepts/data-transform#%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2%E7%9A%84%E8%BF%9B%E9%98%B6%E4%BD%BF%E7%94%A8)

## 六、坐标轴

坐标轴包含 grid、x 轴、y 轴，主要包含以下内容：

- grid
- 轴线（axisLine）
- 轴线标题（name）
- 刻度（axisTick）
- 刻度标签（axisLabel）

<AppImage src="../../image/20251006164913.png" alt="echarts - axis" />

更多的内容应该结合 [grid](https://echarts.apache.org/zh/option.html#grid)、[xAxis](https://echarts.apache.org/zh/option.html#xAxis)、[yAxis](https://echarts.apache.org/zh/option.html#yAxis) 等官方文档一起学习。

### 1. 我应该如何更改轴的类型？

通过 `xAxis.type` 设置轴的类型，轴的类型有如下几种：

- `category`
  - 类目轴
- `value`
  - 数值轴
- `time`
  - 时间轴
  <AppImage src="../../image/20251006172847.png" alt="echarts - axis - time" />
- `log`
  - 对数轴
  <AppImage src="../../image/20251006173353.png" alt="echarts - axis - log" />

### 2. 怎么调整轴的刻度？

调整刻度划分：

- [splitNumber](https://echarts.apache.org/zh/option.html#xAxis.splitNumber)
- [interval](https://echarts.apache.org/zh/option.html#xAxis.interval)
- [minInterval](https://echarts.apache.org/zh/option.html#xAxis.minInterval)
- [maxInterval](https://echarts.apache.org/zh/option.html#xAxis.maxInterval)

刻度划分要注意轴线类型。

调整刻度最大值、最小值：

- [min](https://echarts.apache.org/zh/option.html#xAxis.min)
- [max](https://echarts.apache.org/zh/option.html#xAxis.max)

### 3. 怎么在一个图表示例里面声明多个 grid 和多个轴？

- grid 位置和大小
  - [left](https://echarts.apache.org/zh/option.html#grid.left)
  - [right](https://echarts.apache.org/zh/option.html#grid.right)
  - [top](https://echarts.apache.org/zh/option.html#grid.top)
  - [bottom](https://echarts.apache.org/zh/option.html#grid.bottom)
  - [width](https://echarts.apache.org/zh/option.html#grid.width)
  - [height](https://echarts.apache.org/zh/option.html#grid.height)
- [gridIndex](https://echarts.apache.org/zh/option.html#xAxis.gridIndex)
  - 配置指向哪个 grid
- [position](https://echarts.apache.org/zh/option.html#xAxis.position)
  - 配置位置
- [xAxisIndex](https://echarts.apache.org/zh/option.html#series-bar.xAxisIndex)
- [yAxisIndex](https://echarts.apache.org/zh/option.html#series-bar.yAxisIndex)

```js{16-27,31,40,50,62,90-91}
const option = {
  color: colors,
  title: [
    {
      text: "多坐标轴",
    },
  ],
  label: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  legend: {},
  grid: [
    {
      top: "15%",
      width: "40%",
      height: "35%",
    },
    {
      bottom: "15%",
      width: "40%",
      height: "35%",
    },
  ],
  xAxis: [
    {
      type: "category",
      gridIndex: 0,
      boundaryGap: true,
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
    },
    {
      type: "category",
      gridIndex: 1,
      boundaryGap: true,
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      gridIndex: 0,
      type: "value",
      name: "温度",
      startValue: 0,
      interval: 5,
      min: 0,
      max: 25,
      axisLabel: {
        formatter: "{value} ℃",
      },
    },
    {
      gridIndex: 1,
      type: "value",
      name: "降水量",
      startValue: 0,
      interval: 50,
      min: 0,
      max: 250,
      axisLabel: {
        formatter: "{value} ml",
      },
    },
  ],
  series: [
    {
      type: "line",
      datasetIndex: 0,
      name: "温度",
      symbolSize: 7,
      smooth: true,
      encode: {
        x: 0,
        y: 2,
      },
    },
    {
      type: "bar",
      datasetIndex: 0,
      name: "降水量",
      xAxisIndex: 1,
      yAxisIndex: 1,
      encode: {
        x: 0,
        y: 1,
      },
    },
  ],
  dataset: [
    {
      source: [
        ["month", "precipitation", "temperature"],
        ["1月", "6", "6.0"],
        ["2月", "32", "10.2"],
        ["3月", "70", "10.3"],
        ["4月", "86", "11.5"],
        ["5月", "68.7", "10.3"],
        ["6月", "100.7", "13.2"],
        ["7月", "125.6", "14.3"],
        ["8月", "112.2", "16.4"],
        ["9月", "78.7", "18.0"],
        ["10月", "48.8", "16.5"],
        ["11月", "36.0", "12.0"],
        ["12月", "19.3", "5.2"],
      ],
    },
  ],
};
```

<AppImage src="../../image/20251006175728.png" alt="echarts - axis - grids" />

### 4. 怎么让刻度和刻度标签对齐？

通过 [xAxis.axisTick.alignWithLabel](https://echarts.apache.org/zh/option.html#xAxis.axisTick.alignWithLabel) 实现。

## 七、视觉映射（VisualMap）

## 八、图例（Legend）

## 九、事件与行为
