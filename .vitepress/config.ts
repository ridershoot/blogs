import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	// 指定部署路径为 /blogs/
	base: "/blogs/",
	// 指定页面目录为 src 目录
	srcDir: "./src",
	title: "程序员 李 的博客",
	description: "一起在程序员 李 的博客站点获取前端知识吧",
	lang: "zh-CN",
	markdown: {
		// 为每个代码块添加行号
		lineNumbers: true,
		image: {
			// 懒加载图片
			lazyLoading: true,
		},
	},
	// 是否显示最后更新时间
	lastUpdated: true,
	// 主题定制
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		// 社交链接
		socialLinks: [{ icon: "github", link: "https://github.com/ridershoot/blogs" }],
		// 顶部导航
		nav: [
			{ text: "首页", link: "/" },
			{ text: "uni-app", link: "/uni-app/advanced/login" },
		],
		// 搜索
		search: {
			provider: "local",
		},
		// 侧边栏
		sidebar: {
			"uni-app": [
				{
					text: "进阶",
					collapsed: true,
					items: [
						{
							text: "登录",
							link: "/uni-app/advanced/login",
						},
					],
				},
			],
		},
		// 文章大纲
		outline: {
			// 深度，默认深度为 2 级标题
			level: 2,
			// 显示在 outline 上的标题
			label: "页面导航",
		},
		footer: {
			message:
				"基于 <a href='https://github.com/vuejs/vitepress/blob/main/LICENSE'>MIT</a> 许可发布",
			copyright: "Copyright © 2024-2025 <a href='https://github.com/ridershoot'>ridershoot</a>",
		},
	},
});
