-- events テーブル（日程）
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('match', 'practice', 'tournament', 'other')),
  title TEXT NOT NULL,
  location TEXT,
  time TEXT,
  fileUrl TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- members テーブル（メンバー）
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  grade TEXT,
  parent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- attendance テーブル（参加状況）
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  eventId INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  memberId INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('ok', 'ng', 'pending')),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(eventId, memberId)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_attendance_eventId ON attendance(eventId);
CREATE INDEX IF NOT EXISTS idx_attendance_memberId ON attendance(memberId);
