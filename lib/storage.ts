export type SavedRecipe={slug:string;title:string};
const read=<T,>(key:string,fallback:T):T=>{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback)) as T}catch{return fallback}};
export const getFavorites=()=>read<SavedRecipe[]>('rasoi:favorites',[]);
export const toggleFavorite=(recipe:SavedRecipe)=>{const next=getFavorites().some(x=>x.slug===recipe.slug)?getFavorites().filter(x=>x.slug!==recipe.slug):[...getFavorites(),recipe];localStorage.setItem('rasoi:favorites',JSON.stringify(next));return next};
export const getShoppingList=()=>read<string[]>('rasoi:shopping',[]);
export const addShoppingItems=(items:string[])=>{const next=Array.from(new Set([...getShoppingList(),...items]));localStorage.setItem('rasoi:shopping',JSON.stringify(next));return next};
export const removeShoppingItem=(item:string)=>{const next=getShoppingList().filter(x=>x!==item);localStorage.setItem('rasoi:shopping',JSON.stringify(next));return next};
