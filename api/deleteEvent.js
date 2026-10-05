import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.body;

  try {
    await sql`DELETE FROM events WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('deleteEvent error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
