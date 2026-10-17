import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { eventId, memberId, status, comment, carpoolRequest } = req.body;

  try {
    // UPSERT: 既存レコードがあれば更新、なければ挿入
    await sql`
      INSERT INTO attendance (eventId, memberId, status, comment, carpool_request)
      VALUES (${eventId}, ${memberId}, ${status}, ${comment || ''}, ${carpoolRequest || false})
      ON CONFLICT (eventId, memberId)
      DO UPDATE SET status = ${status}, comment = ${comment || ''}, carpool_request = ${carpoolRequest || false}, updated_at = CURRENT_TIMESTAMP
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('setAttendance error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
