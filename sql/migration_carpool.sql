-- マイグレーション: 4段階出欠 + 相乗り希望フィールド追加

-- 1. status の制約を削除して、maybe を追加
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check CHECK (status IN ('ok', 'maybe', 'ng', 'pending'));

-- 2. carpool_request カラムを追加（デフォルトは false）
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS carpool_request BOOLEAN DEFAULT false;
