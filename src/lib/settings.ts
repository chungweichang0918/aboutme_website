import { z } from 'astro/zod';
import config from '../content/settings.json';

export const https = z.url().refine((value) => new URL(value).protocol === 'https:');
export const asset = z.string().regex(/^\/(?:media|documents)\/[a-zA-Z0-9_./-]+$/).refine((path) => !path.includes('..') && !path.includes('//'));
const localeText = z.object({ 'zh-tw': z.string().min(1), en: z.string().min(1), ja: z.string().min(1) });
const focus = z.array(z.string().min(1).max(60)).min(1).max(8);
export const settings = z.object({
  siteName: z.string().min(1),
  englishName: z.string().min(1),
  localName: z.string().min(1),
  email: z.email(),
  github: https,
  linkedin: https.optional(),
  photo: asset.optional(),
  shareImage: asset.optional(),
  descriptions: localeText,
  biography: localeText.optional(),
  focus: z.object({ 'zh-tw': focus, en: focus, ja: focus }).optional(),
  footer: localeText.optional(),
  defaultLocale: z.literal('zh-tw'),
  theme: z.enum(['system', 'dark', 'light']),
  resumes: z.object({ 'zh-tw': asset.optional(), en: asset.optional(), ja: asset.optional() }).optional(),
}).parse(config);
