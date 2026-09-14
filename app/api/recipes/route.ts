import {NextResponse} from 'next/server';
import {recipes} from '../../../data/recipes';
export function GET(req: Request) {
 const q = (new URL(req.url).searchParams.get('q') || '').trim().toLowerCase();
 return NextResponse.json({recipes:recipes.filter(r=>!q || [r.title,...r.ingredients,...r.tags].join(' ').toLowerCase().includes(q))});
}
export async function POST(req: Request) {
 try {
  const body = await req.json();
  if (!body || !Array.isArray(body.ingredients) || body.ingredients.length > 30 || !body.ingredients.every((x: unknown)=>typeof x === 'string' && x.length <= 80)) return NextResponse.json({error:'Supply an array of up to 30 ingredient names.'},{status:400});
  const ingredients = body.ingredients.map((x:string)=>x.trim().toLowerCase()).filter(Boolean);
  return NextResponse.json({recipes:recipes.filter(r=>(!body.meal || r.meal === body.meal) && (!ingredients.length || ingredients.some((i:string)=>r.ingredients.some(x=>x.toLowerCase().includes(i))))) });
 } catch {return NextResponse.json({error:'Send valid JSON.'},{status:400});}
}
