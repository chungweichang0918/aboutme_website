import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales } from './lib/routes';
import { asset, https } from './lib/settings';

const key = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.preprocess((value) => {
  // Decap writes date-only YAML scalars, which Astro reads as UTC timestamps.
  if (value instanceof Date && value.getTime() % 86_400_000 === 0) return value.toISOString().slice(0, 10);
  return value;
}, z.iso.date());
const link = z.object({ label: z.string().min(1), url: z.union([https, asset]) });
const base = z.object({
  contentId: key,
  slug: key,
  locale: z.enum(locales),
  title: z.string().min(1),
  summary: z.string().min(1).max(350),
  date,
  updatedAt: date.optional(),
  category: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(true),
  visibility: z.enum(['public', 'private']).default('private'),
  tags: z.array(z.string()).default([]),
  cover: asset.optional(),
  coverAlt: z.string().min(1).optional(),
  links: z.array(link).default([]),
});
function collection<T extends z.ZodRawShape>(name: string, fields: T) {
  return defineCollection({
    loader: glob({
      base: './src/content/' + name,
      pattern: '**/*.{md,mdx}',
      generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
    }),
    schema: base.extend(fields).superRefine((data, ctx) => {
      const entry = base.parse(data);
      if (entry.cover && !entry.coverAlt) ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: 'A cover requires alternative text.' });
      if (entry.updatedAt && entry.updatedAt < entry.date) ctx.addIssue({ code: 'custom', path: ['updatedAt'], message: 'Updated date precedes publication.' });
    }),
  });
}

export const collections = {
  projects: collection('projects', {
    category: z.enum(['AI / Machine Learning','Cybersecurity','IoT','Embedded Systems','Web Development','Software Engineering','Others']),
    status: z.enum(['in-progress','completed','maintained','archived']),
    github: https.optional(), demo: https.optional(),
  }),
  research: collection('research', {
    category: z.string().min(1),
    status: z.enum(['published','accepted','under-review','preprint','unpublished','in-progress']),
    authors: z.array(z.string()).default([]), advisor: z.string().optional(), doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
    citation: z.string().optional(),
  }),
  awards: collection('awards', {
    organizer: z.string().min(1), category: z.string().min(1), project: z.string().optional(), role: z.string().min(1),
    status: z.enum(['participant','shortlisted','finalist','winner','other']),
  }),
  skills: collection('skills', {
    category: z.enum(['Programming Languages','Frameworks & Libraries','AI & Machine Learning','Cybersecurity','IoT & Embedded Systems','Databases','Cloud & DevOps','Developer Tools']),
    projects: z.array(key).default([]), icon: asset.optional(),
  }),
  experience: collection('experience', {
    organization: z.string().min(1), role: z.string().min(1), team: z.string().optional(), endDate: date.optional(),
    status: z.enum(['current','completed']),
  }),
  education: collection('education', {
    organization: z.string().min(1), role: z.string().min(1), team: z.string().optional(), endDate: date.optional(),
    status: z.enum(['enrolled','graduated','expected']),
  }),
  posts: collection('posts', { category: z.string().min(1) }),
  certifications: collection('certifications', {
    issuer: z.string().min(1), expires: date.optional(), verification: https.optional(),
    status: z.enum(['earned','in-progress','planned','expired']),
  }),
  timeline: collection('timeline', { milestone: z.union([https, z.string().regex(/^\/(?:zh-tw|en|ja)\/[a-z0-9/-]*$/)]).optional() }),
  now: collection('now', { category: z.string().optional() }),
};
