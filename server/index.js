/* global process, Buffer */
import { createServer } from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const sessions = new Map();
const port = Number(process.env.API_PORT || 3001);
const send = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:5173' });
  response.end(JSON.stringify(body));
};
const hashPassword = (password, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
const verifyPassword = (password, storedHash) => {
  const [salt, expected] = storedHash.split(':');
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, 'hex'));
};
const publicUser = (user) => ({ id: user.userId, name: user.name, email: user.email, role: user.role, walletBalance: Number(user.walletBalance) });
const userWithTransactionBalance = async (user) => {
  const [received, sent] = await Promise.all([
    prisma.transaction.aggregate({
      where: { receiverId: user.userId, status: 'selesai' },
      _sum: { totalAmount: true },
    }),
    prisma.transaction.aggregate({
      where: { senderId: user.userId, status: 'selesai' },
      _sum: { totalAmount: true },
    }),
  ]);
  const balance = Number(received._sum.totalAmount || 0) - Number(sent._sum.totalAmount || 0);
  return { ...publicUser(user), walletBalance: balance };
};
const readBody = async (request) => {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
};

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Origin': 'http://localhost:5173', 'Access-Control-Allow-Headers': 'Content-Type' });
    response.end();
    return;
  }
  try {
    if (request.method === 'POST' && request.url === '/api/auth/register') {
      const { name, email, password } = await readBody(request);
      if (!name || !email || !password || password.length < 6) return send(response, 400, { message: 'Nama, email, dan password minimal 6 karakter wajib diisi.' });
      const normalizedEmail = email.toLowerCase();
      if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) return send(response, 409, { message: 'Email sudah terdaftar.' });
      const user = await prisma.user.create({ data: { name, email: normalizedEmail, passwordHash: hashPassword(password) } });
      const token = randomBytes(32).toString('hex');
      sessions.set(token, user.userId);
      return send(response, 201, { token, user: await userWithTransactionBalance(user) });
    }
    if (request.method === 'POST' && request.url === '/api/auth/login') {
      const { email, password } = await readBody(request);
      const user = await prisma.user.findUnique({ where: { email: email?.toLowerCase() } });
      if (!user || !verifyPassword(password || '', user.passwordHash)) return send(response, 401, { message: 'Email atau password salah.' });
      const token = randomBytes(32).toString('hex');
      sessions.set(token, user.userId);
      return send(response, 200, { token, user: await userWithTransactionBalance(user) });
    }
    if (request.method === 'GET' && request.url === '/api/me') {
      const token = request.headers.authorization?.replace('Bearer ', '');
      const userId = sessions.get(token);
      if (!userId) return send(response, 401, { message: 'Sesi tidak valid.' });
      const user = await prisma.user.findUnique({ where: { userId } });
      if (!user) return send(response, 404, { message: 'User tidak ditemukan.' });
      return send(response, 200, { user: await userWithTransactionBalance(user) });
    }
    return send(response, 404, { message: 'Endpoint tidak ditemukan.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { message: 'Database belum siap atau terjadi kesalahan server.' });
  }
});
server.listen(port, () => console.log(`Revalue API berjalan di http://localhost:${port}`));