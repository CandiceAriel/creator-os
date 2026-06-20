import { sql } from './_db.js';
import { withCors } from './_cors.js';

export default withCors(async function handler(req, res) {
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM campaigns ORDER BY start_date DESC`;
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    try {
      const { brandId, title, status, budget, startDate, endDate } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newCampaign = await db.insert(campaigns).values({
        brandId: brandId ? Number(brandId) : null,
        title,
        status: status || 'active',
        budget: budget ? String(budget) : null,
        startDate, // Matches schema key "startDate"
        endDate,   // Matches schema key "endDate"
      }).returning();

      return res.status(201).json(newCampaign[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create campaign' });
    }
  }
  res.status(405).end();
});