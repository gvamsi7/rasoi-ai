'use client';
import { useEffect, useMemo, useState } from 'react';
import { Mic, Search, Heart, ShoppingBasket, SlidersHorizontal, Sparkles, Plus, X, RotateCcw } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import { toggleFavorite, addShoppingItems, getFavorites } from '../lib/storage';

const suggestions = ['rice', 'onion', 'tomato', 'potato', 'eggs', 'paneer', 'dal', 'curd', 'chicken', 'spinach'];

export default function RecipeExplorer({ recipes }: { recipes: Recipe[] }) {
  const [diet, setDiet] = useState('all');
  const [allergies, setAllergies] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => setFav(getFavorites().map(x => x.slug)), []);
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

  const filtered = useMemo(() => recipes.filter(r => (diet === 'all' || r.tags.includes(diet)) && (!ingredients.length || ingredients.some(i => r.ingredients.some(x => x.toLowerCase().includes(i)))) && (meal === 'all' || r.meal === meal) && (tag === 'all' || r.tags.includes(tag)) && r.prepTime <= max && (!protein || r.nutrition.protein >= 20) && (!q || [r.title, r.description, ...r.ingredients, ...r.tags].join(' ').toLowerCase().includes(q.toLowerCase()))), [recipes, meal, tag, max, protein, q, ingredients, diet]);

  const listen = () => {
    const Speech = (window as typeof window & { webkitSpeechRecognition?: new () => any; SpeechRecognition?: new () => any }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!Speech) { setNotice('Voice input is not supported in this browser. Type ingredients instead.'); return; }
    const recognition = new Speech(); recognition.lang = 'en-IN'; recognition.continuous = false;
    recognition.onerror = () => { setVoice(false); setNotice('Microphone unavailable. Type ingredients instead.'); };
    recognition.onstart = () => setVoice(true); recognition.onend = () => setVoice(false);
    recognition.onresult = (e: any) => addIngredients(e.results[0][0].transcript); recognition.start();
  };
  const generate = async () => {
    const selected = Array.from(new Set([...ingredients, ...ingredientInput.split(/[,\n]+/).map(x => x.trim()).filter(Boolean)]));
    if (!selected.length) { setNotice('Add at least one ingredient.'); return; }
    setLoading(true); setNotice(''); setAi(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients: selected, meal: meal === 'all' ? 'dinner' : meal, preferences: { highProtein: protein, diet, allergies, maxTime: max } }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Generation failed');
      setAi({ ...data, slug: `ai-${Date.now()}`, meal: meal === 'all' ? 'dinner' : meal, tags: ['ai-generated'] });
    } catch (e) { setNotice(e instanceof Error ? e.message : 'AI generation failed'); } finally { setLoading(false); }
  };
  return <>
    <div className="toolbox">
      <div className="searchbox"><Search size={19} /><input value={ingredientInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIngredientInput(e.target.value)} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') addIngredients(ingredientInput); }} aria-label="Available ingredients" placeholder="Add ingredients: rice, eggs, onion..." />
        <button className="mic" onClick={listen} aria-label="Voice ingredient input"><Mic size={18} />{voice ? 'Listening…' : ''}</button>
      </div>
      <button className="primary" onClick={() => addIngredients(ingredientInput)}><Plus size={17} />Add</button>
      <button className="primary" onClick={generate} disabled={loading} aria-busy={loading}><Sparkles size={17} />{loading ? 'Creating…' : 'Create with AI'}</button>
    </div>
    <div className="ingredient-help"><span>Try adding:</span>{suggestions.map(item => <button key={item} onClick={() => addIngredients(item)}>+ {item}</button>)}</div>
    {ingredients.length > 0 && <div className="ingredient-chips">{ingredients.map(item => <span className="ingredient-chip" key={item}>{item}<button onClick={() => removeIngredient(item)} aria-label={`Remove ${item}`}><X size={13} /></button></span>)}<button className="clear-ingredients" onClick={() => setIngredients([])}><RotateCcw size={13} /> Clear all</button></div>}
    <div className="searchbox library-search"><Search size={18}/><input aria-label="Search recipes" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search recipes by name or ingredient…"/></div>
    <div className="filters"><SlidersHorizontal size={17} /><select aria-label="Meal" value={meal} onChange={e => setMeal(e.target.value)}><option value="all">All meals</option><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option></select><select aria-label="Goal" value={tag} onChange={e => setTag(e.target.value)}>
      <option value="all">All goals</option>
      <option value="high-protein">High protein</option>
      <option value="high-fiber">High fiber</option>
      <option value="quick">Quick</option>
      <option value="budget">Budget</option>
    </select><select aria-label="Diet" value={diet} onChange={e=>setDiet(e.target.value)}><option value="all">Any diet</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option></select><label>≤ {max} min <input type="range" min="10" max="300" step="5" value={max} onChange={e => setMax(Number(e.target.value))} /></label><label><input type="checkbox" checked={protein} onChange={e => setProtein(e.target.checked)} /> 20g+ protein</label></div>
    <label className="exclusions">Avoid in AI recipes<input value={allergies} onChange={e=>setAllergies(e.target.value)} maxLength={300} placeholder="e.g. peanuts, dairy"/></label>
    {notice && <p className="notice" role="status">{notice}</p>}
    {ai && <article className="generated-recipe"><span className="tag">AI GENERATED · CHECK INGREDIENT LABELS</span><h2>{ai.title}</h2><p>{ai.description}</p><p>{ai.prepTime} minutes · {ai.servings} servings · estimated {ai.nutrition.calories} kcal and {ai.nutrition.protein}g protein per serving</p><div className="detail-grid"><section><h3>Ingredients</h3><ul>{ai.ingredients.map((x,i)=><li key={i}>{x}</li>)}</ul></section><section><h3>Method</h3><ol>{ai.steps.map((x,i)=><li key={i}>{x}</li>)}</ol></section></div><div className="actions"><button className="primary" onClick={() => {localStorage.setItem('rasoi:recipe:'+ai.slug, JSON.stringify(ai));const n=toggleFavorite({slug:ai.slug,title:ai.title});setFav(n.map(x=>x.slug));}}>{fav.includes(ai.slug) ? 'Unsave recipe' : 'Save recipe'}</button><button className="secondary" onClick={() => {addShoppingItems(ai.ingredients);setNotice('Ingredients added to your shopping list.');}}>Add ingredients to list <ShoppingBasket size={17}/></button></div></article>}
    <div className="results-heading"><h2>{ingredients.length ? 'Recipes with your ingredients' : 'The recipe collection'}</h2><span>{filtered.length} recipes</span></div>
    <div className="recipe-grid">{filtered.map(r => <article className="recipe" key={r.slug}><div className="recipe-image"><span>{r.meal === 'breakfast' ? '☀' : r.meal === 'lunch' ? '◒' : '☾'}</span><small>{r.meal}</small></div><div className="recipe-body"><div className="recipe-top"><span className="tag">{r.tags[0].replace('-', ' ')}</span><button className="iconbtn" onClick={() => { const n = toggleFavorite({ slug: r.slug, title: r.title }); setFav(n.map(x => x.slug)); }} aria-label={`${fav.includes(r.slug) ? 'Unsave' : 'Save'} ${r.title}`} aria-pressed={fav.includes(r.slug)}><Heart size={18} fill={fav.includes(r.slug) ? 'currentColor' : 'none'} /></button></div><h3><a href={`/recipes/${r.slug}`}>{r.title}</a></h3><p>{r.description}</p><small>⏱ {r.prepTime} min · {r.nutrition.protein}g protein · {r.nutrition.fiber}g fiber</small></div></article>)}</div>{filtered.length === 0 && <div className="empty">No recipes match those filters. Try different ingredients or ask Rasoi AI to create one.</div>}
  </>;
}
