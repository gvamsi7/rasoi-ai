'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getShoppingList, removeShoppingItem } from '../../lib/storage';

export default function ShoppingList() {
    const [items, setItems] = useState<string[]>([]);
    useEffect(() => setItems(getShoppingList()), []);
    return <main>
        <nav className="nav">
            <a className="logo" href="/">🥘 Rasoi <span>AI</span>
            </a>
            <a className="outline" href="/">Home</a>
        </nav>
        <section className="content narrow"><p className="eyebrow">KITCHEN HELPER</p>
            <h1>Shopping list</h1><p className="subtitle left">Ingredients saved from your recipes.</p>{items.length ? <ul className="shopping">{items.map(x => <li key={x}><span>{x}</span>
                <button onClick={() => { const n = removeShoppingItem(x); setItems(n) }} aria-label={`Remove ${x}`}><Trash2 size={17} /></button></li>)}</ul> : <div className="empty">Your list is empty. Open a recipe and add its ingredients.</div>}
        </section>
    </main>
}
