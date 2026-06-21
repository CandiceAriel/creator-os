import { sql } from './_db.js';
import { withCors } from './_cors.js';

export default withCors(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM campaigns ORDER BY start_date DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { brandId, title, status = 'active', budget, startDate, endDate } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'title is required' });
      }
      if (title.length > 255) {
        return res.status(400).json({ error: 'title must be 255 characters or fewer' });
      }
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ error: 'startDate cannot be after endDate' });
      }

      const [row] = await sql`
        INSERT INTO campaigns (brand_id, title, status, budget, start_date, end_date)
        VALUES (${brandId ?? null}, ${title}, ${status}, ${budget ?? null}, ${startDate ?? null}, ${endDate ?? null})
        RETURNING *`;
      return res.status(201).json(row);
    }

    return res.status(405).end();
  } catch (err) {
    console.error('campaigns handler error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});