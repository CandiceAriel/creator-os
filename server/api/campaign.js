import { sql } from './_db.js';
import { withCors } from './_cors.js';

export default withCors(async function handler(req, res) {
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM campaigns ORDER BY start_date DESC`;
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { title, brandId, budget } = req.body;
    const [row] = await sql`
      INSERT INTO campaigns (title, brand_id, budget)
      VALUES (${title}, ${brandId}, ${budget}) RETURNING *`;
    return res.status(201).json(row);
  }
  res.status(405).end();
});