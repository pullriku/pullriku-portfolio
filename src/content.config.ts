import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const works = defineCollection({
	loader: glob({ pattern: "./works/*.md", base: "./src/contents" }),
	schema: z.object({
		title: z.string(),
		order: z.number().optional(),
		image: z.string().optional(),
	}),
});

export const collections = { works };
