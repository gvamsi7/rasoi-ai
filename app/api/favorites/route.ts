import { NextResponse } from 'next/server';
import { getRecipe } from '../../../data/recipes';
import { prisma } from '../../../lib/prisma';
import { guestUser as user } from '../../../lib/guest-user';
export async function GET(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); return NextResponse.json(await prisma.favorite.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } }))
}
export async function POST(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { recipeSlug } = await req.json().catch(() => ({}));
    if (typeof recipeSlug !== 'string' || !getRecipe(recipeSlug)) return NextResponse.json({ error: 'recipeSlug required' }, { status: 400 });
    return NextResponse.json(await prisma.favorite.upsert({
        where: { userId_recipeSlug: { userId: u.id, recipeSlug } },
        update: {}, create: { userId: u.id, recipeSlug }
    }))
}
export async function DELETE(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { recipeSlug } = await req.json().catch(() => ({}));
    if (typeof recipeSlug !== 'string' || !recipeSlug) return NextResponse.json({error:'recipeSlug required'},{status:400});
    await prisma.favorite.deleteMany({ where: { userId: u.id, recipeSlug } });
    return NextResponse.json({ ok: true })
}
