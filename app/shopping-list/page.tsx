'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ClipboardList, Trash2, X } from 'lucide-react';
import { getShoppingList, removeShoppingItem } from '../../lib/storage';

export default function ShoppingList() {
  const [items, setItems] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setItems(getShoppingList());
    try {
      setChecked(JSON.parse(localStorage.getItem('rasoi:shopping-checked') || '[]'));
    } catch {
      setChecked([]);
    }
  }, []);

  const remaining = useMemo(() => items.filter((item) => !checked.includes(item)), [items, checked]);

  const toggleChecked = (item: string) => {
    const next = checked.includes(item) ? checked.filter((x) => x !== item) : [...checked, item];
    setChecked(next);
    localStorage.setItem('rasoi:shopping-checked', JSON.stringify(next));
  };

  const removeItem = (item: string) => {
    setItems(removeShoppingItem(item));
    const next = checked.filter((x) => x !== item);
    setChecked(next);
    localStorage.setItem('rasoi:shopping-checked', JSON.stringify(next));
  };

  const clearCompleted = () => checked.forEach(removeItem);

  return (
    <main>
      <nav className="nav">
        <a className="logo" href="/">🥘 Rasoi <span>AI</span></a>
        <a className="outline" href="/">Home</a>
      </nav>
      <section className="content narrow shopping-page">
        <div className="shopping-heading">
          <div>
            <p className="eyebrow">KITCHEN HELPER</p>
            <h1>Shopping list</h1>
            <p className="subtitle left">Keep track of ingredients you need for your next meal.</p>
          </div>
          <div className="shopping-icon"><ClipboardList size={30} /></div>
        </div>

        {items.length ? (
          <>
            <div className="shopping-summary">
              <strong>{remaining.length} item{remaining.length === 1 ? '' : 's'} remaining</strong>
              {checked.length > 0 && <button className="clear-ingredients" onClick={clearCompleted}>Clear completed</button>}
            </div>
            <ul className="shopping">
              {items.map((item) => {
                const done = checked.includes(item);
                return (
                  <li className={done ? 'shopping-item done' : 'shopping-item'} key={item}>
                    <button className="check-item" onClick={() => toggleChecked(item)} aria-label={`${done ? 'Uncheck' : 'Check'} ${item}`}>
                      {done && <Check size={15} />}
                    </button>
                    <span>{item}</span>
                    <button className="remove-item" onClick={() => removeItem(item)} aria-label={`Remove ${item}`}><Trash2 size={17} /></button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="empty shopping-empty">
            <ClipboardList size={38} />
            <h2>Your shopping list is empty</h2>
            <p>Add ingredients from a recipe and they will appear here.</p>
            <a className="primary" href="/">Explore recipes</a>
          </div>
        )}
      </section>
    </main>
  );
}
