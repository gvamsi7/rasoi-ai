'use client';
import {useEffect, useState} from 'react';
import type {Recipe} from '../../data/recipes';
import RecipeActions from '../../components/RecipeActions';
import {validGeneratedRecipe} from '../../lib/recipe-validation';
export default function Cook() {
 const [recipe,setRecipe]=useState<Recipe|null>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try {const id=new URLSearchParams(window.location.search).get('id');const r=JSON.parse(localStorage.getItem('rasoi:recipe:'+id)||'null');if(validGeneratedRecipe(r))setRecipe(r as Recipe);}catch{}setReady(true);},[]);
 return <main><nav className="nav"><a className="logo" href="/">🥘 Rasoi <span>AI</span></a><a href="/favorites">Saved recipes</a></nav><article className="detail">{!ready ? <p>Loading recipe…</p> : !recipe ? <div className="empty">This recipe is not saved in this browser. <a href="/">Create a recipe</a></div> : <><span className="tag">AI GENERATED</span><h1>{recipe.title}</h1><p className="lead">{recipe.description}</p><p>{recipe.prepTime} minutes · {recipe.servings} servings · Estimated {recipe.nutrition.calories} kcal per serving</p><div className="detail-grid"><section><h2>Ingredients</h2><ul>{recipe.ingredients.map((x,i)=><li key={i}>{x}</li>)}</ul></section><section><h2>Method</h2><ol>{recipe.steps.map((x,i)=><li key={i}>{x}</li>)}</ol></section></div><RecipeActions recipe={recipe}/></>}</article></main>;
}
