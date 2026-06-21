import { sql } from './_db.js';
import { withCors } from './_cors.js';

export default withCors(async function handler(req, res) {
  try {
    // 1. GET Request: Fetch all brands
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM brands ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    }

    // 2. POST Request: Create a new brand
    if (req.method === 'POST') {
      const { name, contactName, contactEmail, status = 'prospect', notes } = req.body;

      // --- Validation ---
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'name is required' });
      }
      if (name.length > 255) {
        return res.status(400).json({ error: 'name must be 255 characters or fewer' });
      }
      if (contactName && contactName.length > 255) {
        return res.status(400).json({ error: 'contactName must be 255 characters or fewer' });
      }
      if (contactEmail && contactEmail.length > 255) {
        return res.status(400).json({ error: 'contactEmail must be 255 characters or fewer' });
      }
      if (status && status.length > 50) {
        return res.status(400).json({ error: 'status must be 50 characters or fewer' });
      }

      // --- Database Insertion ---
      const [row] = await sql`
        INSERT INTO brands (name, contact_name, contact_email, status, notes)
        VALUES (
          ${name}, 
          ${contactName ?? null}, 
          ${contactEmail ?? null}, 
          ${status}, 
          ${notes ?? null}
        )
        RETURNING *`;

      return res.status(201).json(row);
    }

    // 3. Handle Unsupported Methods
    return res.status(405).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});