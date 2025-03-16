# 分包和预加载

分包同前端的懒加载策略一样，用到什么加载什么，如果不用到就不加载。

同样地，预加载同前端的预加载策略一样，可以让浏览器在空闲的情况下预先加载某些资源，避免后续使用到的资源需要等待，影响用户体验。

不同地是，**uni-app** 里面的分包和预加载针对的都是*页面*，而不是图片，音频等媒体资源。

## 分包

### 如何配置分包？

现在有如下项目结构：

```txt
root
|-src
| |-pages
|   |-my
|     |-my.vue
```

上面项目目录结构表示一个个人中心页面，这个个人中心页面是一个普通的页面，非分包页面，现在我想要声明一个分包页面settings，表示设置页面，我要如何设置？

1. 在 `/root/src` 下面新建一个目录 `pagesMember` ，用于存储个人中心相关的分包页面
2. 在 `/root/src/pagesMember` 下面新建 `settings/settings.vue` ，用于表示设置页面
3. 在 `/root/src/pages.json` 里面配置相关分包页面

按照上述操作，此时项目结构应该如下：

```txt
root
|-src
| |-pages
|   |-my
|     |-my.vue
| |-pagesMember
|   |-settings
|     |-settings.vue
```

`/root/src/pages.json` 应该如下：

```json
{
  "pages": [
    // ...
  ],
  "subPackages": [ // [!code ++]
    { // [!code ++]
      "root": "pagesMember", // [!code ++]
      "pages": [ // [!code ++]
        { // [!code ++]
          "path": "settings/settings", // [!code ++]
          "style": { // [!code ++]
            "navigationBarTitleText": "设置" // [!code ++]
          } // [!code ++]
        }, // [!code ++]
      ] // [!code ++]
    } // [!code ++]
  ], // [!code ++]
}
```

按照上述操作，可以完成分包页面的创建和配置，但是在开发中手动配置每一个分包页面也太过麻烦，可以使用 vscode 插件[uni-create-view](https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view)来快速完成分包页面的创建和配置

更多分包配置可以看[官方文档](https://uniapp.dcloud.net.cn/collocation/pages.html#subpackages)

## 预加载

预加载一般会同分包页面一起使用，一般会给每一个分包都配置上预加载策略，**以提高用户体验**

### 如何配置预加载？

:::tip

配置预加载策略之前你要想清楚，**给哪个页面配置预加载，在进入哪个页面的时候预加载**

:::

:::info

配置预加载应当在 `pages.json` 下的 `preloadRule` 配置

:::

假设想要给上面提到的 `/root/src/pagesMember/settings/settings.vue` 页面配置上预加载策略，我想要在进入*个人中心*页面的时候预加载*设置*页面，那么应该像这样配置：

```json
{
  "preloadRule": {
    "/pages/my/my": {
      // 配置在什么网络状况下执行预加载策略，可选项为 "all" | "wifi"
      "network": "all",
      // 预加载什么分包
      "packages": ["pagesMember"]
    }
  }
}
```

更多预加载配置可以看[官方文档](https://uniapp.dcloud.net.cn/collocation/pages.html#preloadrule)
