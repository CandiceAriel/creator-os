import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ALLOWED_ORIGINS = (process.env.CLIENT_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export function withCors(handler) {
  return async (req, res) => {
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    return handler(req, res);
  };
}