import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://rasoi-ai.vercel.app';
  return ['', '/breakfast', '/lunch', '/dinner', '/high-protein-recipes', '/high-fiber-recipes', '/quick-indian-recipes', '/bachelor-friendly-recipes'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}