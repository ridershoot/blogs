import type { MarkdownRenderer } from "vitepress";

export default (md: MarkdownRenderer) => {
	const defaultRender = md.renderer.rules.image!;
	md.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		token.attrSet("data-fancybox", "gallery");
		const alt = token.content || "";
		token.attrSet("data-caption", alt);
		return defaultRender(tokens, idx, options, env, self);
	};
};
