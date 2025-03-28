import { defineConfig } from "vitepress";
import type { UserConfig, DefaultTheme } from "vitepress";
import ImgWithFancyboxPlugin from "./plugins/ImgWithFancybox";
// https://vitepress.dev/reference/site-config

const currentYear = new Date().getFullYear();

const config: UserConfig<DefaultTheme.Config> = {
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
		config(md) {
			// 大图预览
			md.use(ImgWithFancyboxPlugin);
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
			{ text: "vue", link: "/vue/note/vue3-reactive-data-reset" },
			{ text: "uni-app", link: "/uni-app/base/subpackage&preload" },
			{ text: "工具", link: "/tools/" },
		],
		// 搜索
		search: {
			provider: "local",
		},
		// 侧边栏
		sidebar: {
			"/vue/": [
				{
					text: "注意",
					collapsed: true,
					base: "/vue/note/",
					items: [
						{
							text: "vue3 响应式数据重置",
							link: "vue3-reactive-data-reset",
						},
					],
				},
			],
			"/uni-app/": [
				{
					text: "基础",
					base: "/uni-app/base/",
					items: [
						{
							text: "分包和预加载",
							link: "subpackage&preload",
						},
					],
				},
				{
					text: "进阶",
					collapsed: true,
					base: "/uni-app/advanced/",
					items: [
						{
							text: "登录",
							link: "login",
						},
					],
				},
			],
			"/tools/": [
				{
					text: "概览",
					link: "/tools/",
				},
			],
		},
		// 文章大纲
		outline: {
			// 深度，默认深度为 2 级标题
			level: "deep",
			// 显示在 outline 上的标题
			label: "页面导航",
		},
		footer: {
			message:
				"基于 <a href='https://github.com/vuejs/vitepress/blob/main/LICENSE'>MIT</a> 许可发布",
			copyright: `Copyright © 2024-${currentYear} <a href='https://github.com/ridershoot'>ridershoot</a>`,
		},
	},
	vite: {
		resolve: {
			alias: {
				"@fancyapps/ui/fancybox": "@fancyapps/ui/dist/index.umd.js",
			},
		},
	},
};

export default defineConfig(config);
