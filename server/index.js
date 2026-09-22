/* global process, Buffer */
import { createServer } from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const sessions = new Map();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const send = (response, status, body, extraHeaders = {}) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  });
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
const serializeNumber = (value) => Number(value || 0);
const getDashboardData = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { status: 'selesai', ...(userId ? { OR: [{ senderId: userId }, { receiverId: userId }] } : {}) },
    include: { waste: true },
  });
  const categoryTotals = transactions.reduce((totals, transaction) => {
    const category = transaction.waste.category;
    totals[category] = (totals[category] || 0) + serializeNumber(transaction.weightKg);
    return totals;
  }, {});
  const totalWeight = transactions.reduce((sum, transaction) => sum + serializeNumber(transaction.weightKg), 0);
  const carbonAvoidedKg = transactions.reduce((sum, transaction) => sum + (serializeNumber(transaction.weightKg) * serializeNumber(transaction.waste.carbonFactorPerKg)), 0);
  return {
    stats: Object.entries(categoryTotals).map(([label, value]) => ({
      label: label === 'b3' ? 'B3 Medis' : label,
      value,
      tone: label === 'organik' ? 'emerald' : label === 'b3' ? 'amber' : 'sky',
    })),
    impact: { carbonAvoidedKg, equivalentTrees: carbonAvoidedKg / 20, landfillReductionKg: totalWeight },
  };
};
const readBody = async (request) => {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
};

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    response.end();
    return;
  }
  try {
    if (request.method === 'GET' && (request.url === '/' || request.url === '/api' || request.url === '/api/health')) {
      return send(response, 200, {
        status: 'ok',
        message: 'Revalue API aktif.',
        endpoints: {
          health: 'GET /api/health',
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/me',
        },
      });
    }
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
    if (request.method === 'GET' && request.url === '/api/catalog') {
      const items = await prisma.wasteItem.findMany({ orderBy: { wasteId: 'asc' } });
      return send(response, 200, { items: items.map((item) => ({
        id: item.wasteId,
        category: item.category,
        medicalType: item.medicalType || null,
        name: item.typeName,
        price: serializeNumber(item.pricePerKg),
        unit: 'kg',
        stockKg: serializeNumber(item.stockKg),
        carbonFactorPerKg: serializeNumber(item.carbonFactorPerKg),
      })) });
    }
    if (request.method === 'GET' && request.url === '/api/dropoffs') {
      const locations = await prisma.dropOffLocation.findMany({ orderBy: { locationId: 'asc' } });
      const latitudes = locations.map((location) => serializeNumber(location.latitude));
      const longitudes = locations.map((location) => serializeNumber(location.longitude));
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      return send(response, 200, { locations: locations.map((location) => ({
        id: location.locationId,
        name: location.locationName,
        address: location.address,
        type: /kompos/i.test(`${location.locationName} ${location.address}`) ? 'kompos' : 'bahan',
        latitude: serializeNumber(location.latitude),
        longitude: serializeNumber(location.longitude),
        x: `${maxLng === minLng ? 50 : ((serializeNumber(location.longitude) - minLng) / (maxLng - minLng)) * 80 + 10}%`,
        y: `${maxLat === minLat ? 50 : (1 - ((serializeNumber(location.latitude) - minLat) / (maxLat - minLat))) * 80 + 10}%`,
      })) });
    }
    if (request.method === 'GET' && request.url === '/api/products') {
      const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { productId: 'asc' } });
      return send(response, 200, { products: products.map((product) => ({
        id: product.productId,
        name: product.name,
        price: serializeNumber(product.price),
        tag: product.tag || '',
        tone: product.tone || 'green',
      })) });
    }
    if (request.method === 'GET' && request.url === '/api/dashboard') {
      const token = request.headers.authorization?.replace('Bearer ', '');
      const userId = sessions.get(token);
      const dashboard = await getDashboardData(userId);
      return send(response, 200, dashboard);
    }
    return send(response, 404, { message: 'Endpoint tidak ditemukan.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { message: 'Database belum siap atau terjadi kesalahan server.' });
  }
});
server.listen(port, () => console.log(`Revalue API berjalan di http://localhost:${port}`));