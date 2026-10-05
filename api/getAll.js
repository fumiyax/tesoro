import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // events テーブル
    const eventsResult = await sql`
      SELECT * FROM events ORDER BY date DESC
    `;

    // members テーブル
    const membersResult = await sql`
      SELECT * FROM members ORDER BY name ASC
    `;

    // attendance テーブル
    const attendanceResult = await sql`
      SELECT * FROM attendance
    `;

    // フィールド名をキャメルケースに変換
    const events = eventsResult.map(e => ({
      id: e.id,
      date: e.date,
      type: e.type,
      title: e.title,
      location: e.location,
      time: e.time,
      fileUrl: e.fileurl,
      note: e.note
    }));

    const members = membersResult.map(m => ({
      id: m.id,
      name: m.name,
      grade: m.grade,
      parent: m.parent
    }));

    const attendance = attendanceResult.map(a => ({
      eventId: a.eventid,
      memberId: a.memberid,
      status: a.status,
      comment: a.comment
    }));

    return res.status(200).json({
      events,
      members,
      attendance,
    });
  } catch (error) {
    console.error('getAll error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
