import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	// 指定部署路径为 /blogs/
	base: "/blogs/",
	// 指定页面目录为 pages 目录
	srcDir: "./pages",
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
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		// 社交链接
		socialLinks: [{ icon: "github", link: "https://github.com/ridershoot/blogs" }],
		// 顶部导航
		nav: [
			{ text: "Home", link: "/" },
			// { text: "Examples", link: "/markdown-examples" },
		],
		// 侧边栏
		sidebar: [
			{
				text: "Examples",
				items: [
					{ text: "Markdown Examples", link: "/markdown-examples" },
					{ text: "Runtime API Examples", link: "/api-examples" },
				],
			},
		],
	},
});
