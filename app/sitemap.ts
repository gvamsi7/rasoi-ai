import type { MetadataRoute } from 'next'; import { recipes } from '../data/recipes';
export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://rasoi-ai.vercel.app';
    const categories = ['breakfast', 'lunch', 'dinner', 'high-protein-recipes', 'high-fiber-recipes', 'quick-indian-recipes', 'bachelor-friendly-recipes', '15-minute-recipes'];
    return ['', ...categories.map(x => `/${x}`), ...recipes.map(r => `/recipes/${r.slug}`)].map(path => ({ url: `${base}${path}`, lastModified: new Date() }))
}
