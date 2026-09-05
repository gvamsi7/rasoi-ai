import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
  const meal = body.meal || 'dinner';
  const preferences = body.preferences || {};

  if (!ingredients.length) {
    return NextResponse.json({ error: 'Add at least one ingredient.' }, { status: 400 });
  }

  return NextResponse.json({
    recipes: [{
      title: `${meal[0].toUpperCase()}${meal.slice(1)} bowl with ${ingredients.slice(0, 3).join(', ')}`,
      description: 'A practical Indian-style meal generated from your available ingredients.',
      ingredients,
      preferences,
      nutrition: { protein: '20g+', fiber: '8g+', healthyFats: '10g+' },
      steps: ['Prepare and wash the ingredients.', 'Cook with spices and minimal oil.', 'Serve hot with a balanced side.']
    }]
  });
}