import { cookies } from 'next/headers';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { prisma } from './prisma';
export async function guestUser(req: Request) {
  if ((!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) || !process.env.DATABASE_URL) return null;
  if (req.method !== 'GET' && req.headers.get('origin') !== new URL(req.url).origin) return null;
  const jar = await cookies();
  const raw = jar.get('rasoi-session')?.value || '';
  const [id, signature] = raw.split('.');
  const sign = (value: string) => createHmac('sha256', process.env.SESSION_SECRET!).update(value).digest('hex');
  const expected = sign(id || '');
  const valid = /^[a-f0-9-]{36}$/.test(id || '') && signature?.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  const userId = valid ? id : randomUUID();
  if (!valid) jar.set('rasoi-session', `${userId}.${sign(userId)}`, {httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'lax', path:'/', maxAge:60*60*24*30});
  const email = `${userId}@guest.invalid`;
  return prisma.user.upsert({where:{email},update:{},create:{email}});
}
