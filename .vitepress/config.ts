import { defineConfig } from "vitepress";
import type { UserConfig, DefaultTheme } from "vitepress";
import ImgWithFancyboxPlugin from "./plugins/ImgWithFancybox";
import SideBarConfig from "./config/sidebar.json";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
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
			// 代码组图标
			md.use(groupIconMdPlugin);
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
			{ text: "vue", link: "/vue/base/props" },
			{ text: "uni-app", link: "/uni-app/base/subpackage&preload" },
			{ text: "MySQL", link: "/mysql/base/db-base-operate" },
			{
				text: "其他",
				items: [
					{ text: "工具", link: "/others/tools" },
					{
						text: "git commit 规范",
						link: "/others/git-commit-message-standard",
					},
					{ text: "想要的知识", link: "/others/want" },
				],
			},
		],
		// 搜索
		search: {
			provider: "local",
		},
		// 侧边栏
		sidebar: {
			...SideBarConfig,
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
		plugins: [
			// 代码组图标
			groupIconVitePlugin(),
		],
	},
};

export default defineConfig(config);
