import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { id, name, grade, parent } = req.body;

  try {
    if (id) {
      // 更新
      await sql`
        UPDATE members
        SET name = ${name}, grade = ${grade}, parent = ${parent},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      // 新規作成
      await sql`
        INSERT INTO members (name, grade, parent)
        VALUES (${name}, ${grade}, ${parent})
      `;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('saveMember error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
