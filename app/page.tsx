import { recipes } from '../data/recipes';
import RecipeExplorer from '../components/RecipeExplorer';

export default function Home() {
    return <main>
        <nav className="nav">
            <a className="logo" href="/">🥘 Rasoi <span>AI</span></a><div className="navlinks">
                <a href="#recipes">Recipes</a><a href="/shopping-list">Shopping list</a>
                </div>
                </nav><section className="hero"><p className="eyebrow">YOUR SMART INDIAN KITCHEN</p><h1>Good food.<br /><em>Less thinking.</em></h1><p className="subtitle">Tell us what you have. Search our recipe library, speak your ingredients, or let AI create a practical Indian meal.</p><div className="hero-pills"><span>🥩 High protein</span><span>🌾 High fiber</span><span>⏱ Quick meals</span><span>💰 Budget friendly</span></div></section><section className="content" id="recipes"><div className="section-head"><div><p className="eyebrow">DISCOVER</p><h2>What can you cook today?</h2></div><a href="/shopping-list">Shopping list →</a></div><RecipeExplorer recipes={recipes} /></section></main>
}
