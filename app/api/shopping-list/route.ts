import { NextResponse } from 'next/server'; 
import { prisma } from '../../../lib/prisma';

import { guestUser as user } from '../../../lib/guest-user';
export async function GET(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); return NextResponse.json(await prisma.shoppingItem.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } }))
}
export async function POST(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const body = await req.json().catch(() => ({})); const names = Array.isArray(body.items) ? body.items : [body.name];
    if (names.length > 100 || !names.length || !names.every((x: unknown) => typeof x === 'string' && x.trim().length > 0 && x.length <= 200)) return NextResponse.json({error:'Supply 1–100 item names under 200 characters.'},{status:400});
    const items = await Promise.all(names.filter(Boolean).map((name: string) => prisma.shoppingItem.create({ data: { userId: u.id, name } })));
    return NextResponse.json(items)
}
export async function PATCH(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { id, checked } = await req.json().catch(() => ({})); if (typeof id !== 'string' || !id || typeof checked !== 'boolean') return NextResponse.json({error:'Item ID and boolean checked required.'},{status:400}); return NextResponse.json(await prisma.shoppingItem.updateMany({
            where: { id, userId: u.id },
            data: { checked: Boolean(checked) }
        }))
}
export async function DELETE(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { id } = await req.json().catch(() => ({})); if (typeof id !== 'string' || !id) return NextResponse.json({error:'Item ID required.'},{status:400}); await prisma.shoppingItem.deleteMany({ where: { id, userId: u.id } });
    return NextResponse.json({ ok: true })
}
