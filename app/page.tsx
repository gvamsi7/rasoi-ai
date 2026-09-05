const meals = ['Breakfast', 'Lunch', 'Dinner', 'Quick bites'];
const recipes = [
  { name: 'Paneer Moong Chilla', time: '20 min', tag: 'High protein', emoji: '🥞' },
  { name: 'Rajma Rice Bowl', time: '30 min', tag: 'High fiber', emoji: '🍛' },
  { name: 'Vegetable Egg Bhurji', time: '15 min', tag: 'Quick & filling', emoji: '🍳' },
];

export default function Home() {
  return (
    <main>
      <nav className="nav"><div className="logo">🥘 Rasoi <span>AI</span></div><button className="outline">Sign in</button></nav>
      <section className="hero">
        <p className="eyebrow">YOUR SMART KITCHEN COMPANION</p>
        <h1>Good food.<br /><em>Less thinking.</em></h1>
        <p className="subtitle">Tell us what you have. We’ll help you cook something delicious, balanced and budget-friendly.</p>
        <div className="search"><input placeholder="e.g. rice, eggs, onion, tomato..." /><button>Find recipes ✨</button></div>
        <button className="voice">🎙️ Try voice search</button>
      </section>
      <section className="content"><div className="section-head"><div><p className="eyebrow">EXPLORE</p><h2>What are you cooking?</h2></div><a href="#recipes">View all →</a></div><div className="meal-grid">{meals.map((meal, i) => <div className="meal" key={meal}><span>{['🌅','☀️','🌙','🥗'][i]}</span><strong>{meal}</strong><small>Easy ideas</small></div>)}</div>
      <div className="section-head" id="recipes"><div><p className="eyebrow">RECOMMENDED FOR YOU</p><h2>Wholesome everyday recipes</h2></div></div><div className="recipe-grid">{recipes.map(r => <article className="recipe" key={r.name}><div className="recipe-image">{r.emoji}</div><div className="recipe-body"><span className="tag">{r.tag}</span><h3>{r.name}</h3><p>⏱ {r.time} &nbsp; · &nbsp; Beginner friendly</p></div></article>)}</div></section>
    </main>
  );
}
