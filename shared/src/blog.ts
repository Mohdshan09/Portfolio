import { z } from 'zod';

const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180);
export const diagramElementSchema = z.object({
  id: z.string().max(80), type: z.enum(['rectangle', 'ellipse', 'arrow', 'text']), x: z.number(), y: z.number(),
  width: z.number().min(1).max(2000), height: z.number().min(1).max(2000), text: z.string().max(500).optional(),
});
export const chapterSchema = z.object({
  id: z.string().max(80), title: z.string().trim().min(1).max(140), content: z.string().max(30000),
  diagram: z.array(diagramElementSchema).max(100).default([]),
});
export const blogInputSchema = z.object({
  projectSlug: slug.max(80), title: z.string().trim().min(3).max(160), slug, excerpt: z.string().trim().min(10).max(320),
  status: z.enum(['draft', 'published']), chapters: z.array(chapterSchema).min(1).max(30),
});
export type BlogInput = z.infer<typeof blogInputSchema>;
export const feedbackSchema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().optional().or(z.literal('')), message: z.string().trim().min(5).max(1200) });
export type FeedbackInput = z.infer<typeof feedbackSchema>;
