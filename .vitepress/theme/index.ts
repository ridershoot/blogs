// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// @ts-ignore
import Fancyapps from "@fancyapps/ui/fancybox";
Fancyapps.Fancybox.bind("[data-fancybox]");
// 代码组图标的样式
import "virtual:group-icons.css";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router, siteData }) {},
} satisfies Theme;
