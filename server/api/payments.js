import { sql } from './_db.js';
import { withCors } from './_cors.js';

export default withCors(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM payments`;
      return res.status(200).json(rows); // Return raw array directly
    }

    if (req.method === 'POST') {
      const { campaignId, amount, status = 'pending', dueDate } = req.body;

      // 1. Basic Validation
      if (!amount || isNaN(Number(amount))) {
        return res.status(400).json({ error: 'A valid numeric amount is required' });
      }

      if (!dueDate) {
        return res.status(400).json({ error: 'dueDate is required (Format: YYYY-MM-DD)' });
      }

      // 2. Insert into PostgreSQL using Drizzle/SQL raw variables
      // Maps to your snake_case column names: campaign_id, amount, status, due_date
      const [newPayment] = await sql`
        INSERT INTO payments (campaign_id, amount, status, due_date)
        VALUES (
          ${campaignId ?? null}, 
          ${amount}, 
          ${status}, 
          ${dueDate}
        )
        RETURNING *`;

      // 3. Return the newly created row
      return res.status(201).json(newPayment);
    }
  } catch (err) {
    console.error('Payments handler error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});