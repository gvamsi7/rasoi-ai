'use client';
import { useMemo, useState } from 'react';
import { Mic, Search, Heart, ShoppingBasket, SlidersHorizontal, Sparkles, Plus, X, RotateCcw } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import { toggleFavorite, addShoppingItems, getFavorites } from '../lib/storage';

const suggestions = ['rice', 'onion', 'tomato', 'potato', 'eggs', 'paneer', 'dal', 'curd', 'chicken', 'spinach'];

export default function RecipeExplorer({ recipes }: { recipes: Recipe[] }) {
  const [q, setQ] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [meal, setMeal] = useState('all');
  const [tag, setTag] = useState('all');
  const [max, setMax] = useState(60);
  const [protein, setProtein] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ai, setAi] = useState<Recipe | null>(null);
  const [voice, setVoice] = useState(false);
  const [fav, setFav] = useState<string[]>([]);

  const addIngredients = (value: string) => {
    const next = value.split(/[,\n]+/).map(x => x.trim().toLowerCase()).filter(Boolean);
    setIngredients(current => Array.from(new Set([...current, ...next])));
    setIngredientInput('');
  };
  const removeIngredient = (item: string) => setIngredients(current => current.filter(x => x !== item));
  const allIngredients = ingredients.join(', ');
  const filtered = useMemo(() => recipes.filter(r => (meal === 'all' || r.meal === meal) && (tag === 'all' || r.tags.includes(tag)) && r.prepTime <= max && (!protein || r.nutrition.protein >= 20) && (!q || [r.title, r.description, ...r.ingredients, ...r.tags].join(' ').toLowerCase().includes(q.toLowerCase()))), [recipes, meal, tag, max, protein, q]);

  const listen = () => {
    const Speech = (window as typeof window & { webkitSpeechRecognition?: new () => any; SpeechRecognition?: new () => any }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!Speech) { alert('Voice input is not supported in this browser. Try Chrome.'); return; }
    const recognition = new Speech(); recognition.lang = 'en-IN'; recognition.continuous = false;
    recognition.onstart = () => setVoice(true); recognition.onend = () => setVoice(false);
    recognition.onresult = (e: any) => addIngredients(e.results[0][0].transcript); recognition.start();
  };
  const generate = async () => {
    const selected = ingredients.length ? ingredients : q.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
    if (!selected.length) { alert('Add at least one ingredient.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients: selected, meal: meal === 'all' ? 'dinner' : meal, preferences: { highProtein: protein } }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Generation failed');
      setAi({ ...data, slug: `ai-${Date.now()}`, meal: meal === 'all' ? 'dinner' : meal, tags: ['ai-generated'], prepTime: data.prepTime || 30, servings: data.servings || 2, nutrition: { protein: Number(data.nutrition?.protein || 20), fiber: Number(data.nutrition?.fiber || 8), fats: Number(data.nutrition?.fats || 10), calories: Number(data.nutrition?.calories || 400) } });
    } catch (e) { alert(e instanceof Error ? e.message : 'AI generation failed'); } finally { setLoading(false); }
  };
  return <>
    <div className="toolbox">
      <div className="searchbox"><Search size={19} /><input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addIngredients(ingredientInput); }} placeholder="Add ingredients: rice, eggs, onion..." /><button className="mic" onClick={listen} aria-label="Voice ingredient input"><Mic size={18} />{voice ? 'Listening…' : ''}</button></div>
      <button className="primary" onClick={() => addIngredients(ingredientInput)}><Plus size={17} />Add</button>
      <button className="primary" onClick={generate}><Sparkles size={17} />{loading ? 'Creating…' : 'Create with AI'}</button>
    </div>
    <div className="ingredient-help"><span>Try adding:</span>{suggestions.map(item => <button key={item} onClick={() => addIngredients(item)}>+ {item}</button>)}</div>
    {ingredients.length > 0 && <div className="ingredient-chips">{ingredients.map(item => <span className="ingredient-chip" key={item}>{item}<button onClick={() => removeIngredient(item)} aria-label={`Remove ${item}`}><X size={13} /></button></span>)}<button className="clear-ingredients" onClick={() => setIngredients([])}><RotateCcw size={13} /> Clear all</button></div>}
    <div className="filters"><SlidersHorizontal size={17} /><select value={meal} onChange={e => setMeal(e.target.value)}><option value="all">All meals</option><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option></select><select value={tag} onChange={e => setTag(e.target.value)}><option value="all">All goals</option><option value="high-protein">High protein</option><option value="high-fiber">High fiber</option><option value="quick">Quick</option><option value="budget">Budget</option></select><label>≤ {max} min <input type="range" min="10" max="60" step="5" value={max} onChange={e => setMax(Number(e.target.value))} /></label><label><input type="checkbox" checked={protein} onChange={e => setProtein(e.target.checked)} /> 20g+ protein</label></div>
    {ai && <article className="ai-result"><div><span className="tag">AI GENERATED</span><h2>{ai.title}</h2><p>{ai.description}</p></div><button className="primary" onClick={() => addShoppingItems(ai.ingredients)}>Add ingredients to list <ShoppingBasket size={17} /></button></article>}
    <div className="recipe-grid">{filtered.map(r => <article className="recipe" key={r.slug}><div className="recipe-image">🍛</div><div className="recipe-body"><div className="recipe-top"><span className="tag">{r.tags[0].replace('-', ' ')}</span><button className="iconbtn" onClick={() => { const n = toggleFavorite({ slug: r.slug, title: r.title }); setFav(n.map(x => x.slug)); }} aria-label="Favorite"><Heart size={18} fill={fav.includes(r.slug) ? 'currentColor' : 'none'} /></button></div><h3><a href={`/recipes/${r.slug}`}>{r.title}</a></h3><p>{r.description}</p><small>⏱ {r.prepTime} min · {r.nutrition.protein}g protein · {r.nutrition.fiber}g fiber</small></div></article>)}</div>{filtered.length === 0 && <div className="empty">No recipes match those filters. Try different ingredients or ask Rasoi AI to create one.</div>}
  </>;
}
