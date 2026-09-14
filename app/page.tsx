import { recipes } from '../data/recipes';
import RecipeExplorer from '../components/RecipeExplorer';
export default function Home() {
 return <main><nav className="nav"><a className="logo" href="/">🥘 Rasoi <span>AI</span></a><div className="navlinks"><a href="/favorites">Saved recipes</a><a href="/shopping-list">Shopping list</a></div></nav><section className="content" id="recipes"><div className="section-head"><div><p className="eyebrow">YOUR EVERYDAY INDIAN KITCHEN</p><h1>What’s cooking today?</h1><p>Find a favorite or turn the ingredients you have into something new.</p></div></div><RecipeExplorer recipes={recipes}/></section></main>
}
