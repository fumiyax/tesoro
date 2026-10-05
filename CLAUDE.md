# 02_Tesoro - テソーロ管理

## 概要
バディの友人たちと試合数を増やすために活動している裏チーム「テソーロ」の管理ツール。
- リポジトリ: https://github.com/fumiyax/tesoro
- デプロイ: Vercel（main ブランチに push で自動デプロイ）
- データベース: Neon Database (PostgreSQL)

## 技術構成

### フロントエンド
- 単一 HTML ファイル構成（index.html）
- フレームワークなし（Vanilla JS）
- レスポンシブデザイン

### バックエンド
- **Vercel API Routes**（`api/` フォルダ）
- **Neon Database (PostgreSQL)**

### データベーススキーマ

| テーブル | カラム |
|---|---|
| events | id, date, type(`match`/`practice`/`tournament`/`other`), title, location, time, fileUrl, note |
| members | id, name, grade, parent |
| attendance | eventId, memberId, status(`ok`/`ng`/`pending`), comment |

### API エンドポイント

| エンドポイント | 説明 | パラメータ |
|---|---|---|
| `/api/getAll` | 全データ取得 | なし |
| `/api/saveEvent` | イベント追加/更新 | id, date, type, title, location, time, fileUrl, note |
| `/api/deleteEvent` | イベント削除 | id |
| `/api/saveMember` | メンバー追加/更新 | id, name, grade, parent |
| `/api/deleteMember` | メンバー削除 | id |
| `/api/setAttendance` | 出欠登録 | eventId, memberId, status, comment |

## 開発ルール

### バージョン管理
- **index.html を修正するたびにヘッダーの ver 番号を1つ上げること**（`badge-ver` の表示テキスト）
- Vercel への反映に時間差があるため、ver 番号で最新かどうかを判別する

### デプロイ
- **index.html を修正したら自動で git commit & push すること**
- コミットメッセージは変更内容を簡潔に英語で記載
- Vercel が自動的にデプロイ（1〜2 分で反映）

### バックアップ
- **index.html を修正する前にバックアップを取ること**
- 保存先: `backup/`
- 命名規則: `index_ver{番号}_{変更内容の短い説明}.html`
- `backup/` は `.gitignore` で除外済み（git にコミットしない）

## セットアップ

詳細な手順は `DEPLOYMENT.md` を参照してください。

### 簡易手順

1. **Neon Database 作成**
   - [Neon Console](https://console.neon.tech/) でプロジェクト作成
   - `sql/schema.sql` を実行してテーブル作成
   - 接続文字列をコピー

2. **Vercel プロジェクト作成**
   - GitHub リポジトリ `fumiyax/tesoro` を Vercel にインポート
   - 環境変数 `DATABASE_URL` に Neon の接続文字列を設定
   - デプロイ

3. **動作確認**
   - メンバーを登録してみる
   - イベントを追加してみる

## バックアップ履歴

| ファイル名 | 日付 | 内容 |
|---|---|---|
| `index_ver04_before-vercel-migration.html` | 2026-10-05 | Vercel + Neon 移行前（GAS版最終）|
