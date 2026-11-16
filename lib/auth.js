import crypto from 'crypto';
import { cookies } from 'next/headers';
const sign = (v) => crypto.createHmac('sha256', process.env.AUTH_SECRET || '').update(v).digest('hex');
const same = (a, b) => { a = Buffer.from(a); b = Buffer.from(b); return a.length === b.length && crypto.timingSafeEqual(a, b); };
export const checkPw = (p) => !!process.env.ADMIN_PASSWORD && !!process.env.AUTH_SECRET && same(String(p || ''), process.env.ADMIN_PASSWORD);
export function makeToken() { const exp = String(Date.now() + 7 * 864e5); return exp + '.' + sign(exp); }
export function isAdmin() {
  if (!process.env.AUTH_SECRET) return false;
  const t = cookies().get('adm')?.value; if (!t) return false;
  const [exp, sig] = t.split('.');
  return !!sig && +exp > Date.now() && same(sig, sign(exp));
}
