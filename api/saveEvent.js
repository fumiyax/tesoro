import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { id, date, type, title, location, time, fileUrl, note } = req.body;

  try {
    if (id) {
      // 更新
      await sql`
        UPDATE events
        SET date = ${date}, type = ${type}, title = ${title},
            location = ${location}, time = ${time}, fileUrl = ${fileUrl},
            note = ${note}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      // 新規作成
      await sql`
        INSERT INTO events (date, type, title, location, time, fileUrl, note)
        VALUES (${date}, ${type}, ${title}, ${location}, ${time}, ${fileUrl}, ${note})
      `;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('saveEvent error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
