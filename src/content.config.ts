import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const works = defineCollection({
	loader: glob({ pattern: "./works/*.md", base: "./src/contents" }),
	schema: z
		.object({
			title: z.string(),
			order: z.number().optional(),
			image: z.string().optional(),
			alt: z.string().optional(),
		})
		.superRefine((data, ctx) => {
			if (data.image && !data.alt) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "画像の代替テキスト (alt) を指定してください。",
				});
			}
		}),
});

export const collections = { works };
