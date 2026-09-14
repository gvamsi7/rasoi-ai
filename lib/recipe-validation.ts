import type { Recipe } from '../data/recipes';
const strings = (v: unknown, max: number): v is string[] => Array.isArray(v) && v.length > 0 && v.length <= max && v.every(x => typeof x === 'string' && x.trim().length > 0 && x.length <= 1500);
export function validGeneratedRecipe(v: unknown): v is Omit<Recipe, 'slug' | 'meal' | 'tags'> {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, any>;
  return typeof r.title === 'string' && r.title.length > 0 && r.title.length <= 160 && typeof r.description === 'string' && r.description.length <= 2000 && strings(r.ingredients, 40) && strings(r.steps, 30) && Number.isFinite(r.prepTime) && r.prepTime > 0 && r.prepTime <= 1440 && Number.isInteger(r.servings) && r.servings > 0 && r.servings <= 20 && r.nutrition && ['protein','fiber','fats','calories'].every(k => Number.isFinite(r.nutrition[k]) && r.nutrition[k] >= 0);
}
export function parseGenerationInput(v: unknown) {
  if (!v || typeof v !== 'object') throw new Error('Invalid request.');
  const b = v as Record<string, any>;
  if (!strings(b.ingredients, 30) || b.ingredients.some((s: string) => s.length > 80)) throw new Error('Add 1–30 ingredients, each under 80 characters.');
  const meal = b.meal ?? 'dinner';
  if (!['breakfast','lunch','dinner'].includes(meal)) throw new Error('Choose breakfast, lunch, or dinner.');
  const p = b.preferences || {};
  if (!['all','vegetarian','vegan'].includes(p.diet ?? 'all')) throw new Error('Invalid dietary preference.');
  if (typeof (p.allergies ?? '') !== 'string' || (p.allergies ?? '').length > 300) throw new Error('Keep exclusions under 300 characters.');
  const maxTime = p.maxTime ?? 60;
  if (!Number.isFinite(maxTime) || maxTime < 10 || maxTime > 300) throw new Error('Invalid cooking time.');
  return {ingredients: b.ingredients.map((s: string) => s.trim()), meal, preferences: {diet: p.diet ?? 'all', allergies: p.allergies ?? '', maxTime, highProtein: p.highProtein === true}};
}
