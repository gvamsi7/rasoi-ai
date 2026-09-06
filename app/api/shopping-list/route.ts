import { NextResponse } from 'next/server'; 
import { prisma } from '../../../lib/prisma';

const user = async (req: Request) => {
    const email = req.headers.get('x-user-email'); if (!email) return null;
    return prisma.user.upsert({ where: { email }, update: {}, create: { email } })
};
export async function GET(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); return NextResponse.json(await prisma.shoppingItem.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } }))
}
export async function POST(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const body = await req.json(); const names = Array.isArray(body.items) ? body.items : [body.name];
    const items = await Promise.all(names.filter(Boolean).map((name: string) => prisma.shoppingItem.create({ data: { userId: u.id, name } })));
    return NextResponse.json(items)
}
export async function PATCH(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { id, checked } = await req.json(); return NextResponse.json(await prisma.shoppingItem.update({
            where: { id, userId: u.id },
            data: { checked: Boolean(checked) }
        }))
}
export async function DELETE(req: Request) {
    const u = await user(req); if (!u) return NextResponse.json({ error: 'Authentication required' },
        { status: 401 }); const { id } = await req.json(); await prisma.shoppingItem.deleteMany({ where: { id, userId: u.id } });
    return NextResponse.json({ ok: true })
}
