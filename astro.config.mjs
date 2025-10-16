// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx(), react()],

	markdown: {
		rehypePlugins: [
			[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
		],
	}
});
