# Tesoro デプロイメントガイド

## 概要

このガイドでは、Tesoro を Vercel + Neon Database (PostgreSQL) にデプロイする手順を説明します。

## 前提条件

- GitHub アカウント
- Vercel アカウント（GitHub 連携）
- Neon アカウント（無料プランで OK）

---

## 1. Neon Database のセットアップ

### 1.1 Neon プロジェクトの作成

1. [Neon Console](https://console.neon.tech/) にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例: `tesoro`）
4. リージョンを選択（推奨: `AWS / Tokyo (ap-northeast-1)`）
5. 「Create Project」をクリック

### 1.2 データベース接続文字列の取得

1. プロジェクトのダッシュボードで「Connection Details」を開く
2. 「Connection string」をコピー
   - 形式: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
3. この文字列を後で Vercel で使用するため、メモしておく

### 1.3 データベーススキーマの作成

1. Neon Console で「SQL Editor」を開く
2. `sql/schema.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてスキーマを作成

または、ローカルから実行する場合：

```bash
# psql がインストールされている場合
psql "postgresql://[接続文字列]" -f sql/schema.sql
```

---

## 2. Vercel プロジェクトのセットアップ

### 2.1 Vercel プロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHub リポジトリ `fumiyax/tesoro` を選択
4. 「Import」をクリック

### 2.2 プロジェクト設定

**Framework Preset:** Other (デフォルト)

**Root Directory:** `.` (ルート)

**Build Settings:**
- Build Command: `echo "No build needed"`
- Output Directory: `.` (空欄でも OK)

### 2.3 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` (Neon の接続文字列) | Production |

**重要:** 環境変数は必ず設定してください。設定しないと API が動作しません。

### 2.4 デプロイ

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待つ（通常 1〜2 分）
3. デプロイが成功したら、URL が表示される（例: `https://tesoro.vercel.app`）

---

## 3. 動作確認

### 3.1 アプリケーションの確認

1. デプロイされた URL にアクセス
2. 「MEMBERS」タブを開く
3. 「追加」ボタンをクリックして、メンバーを登録してみる
4. 登録が成功すれば、データベース接続が正常に動作している

### 3.2 データベースの確認

Neon Console の SQL Editor で以下を実行：

```sql
SELECT * FROM members;
SELECT * FROM events;
SELECT * FROM attendance;
```

登録したデータが表示されれば OK。

---

## 4. 継続的デプロイ（自動デプロイ）

GitHub の `main` ブランチに push すると、Vercel が自動的にデプロイします。

### デプロイフロー

1. ローカルで `index.html` を修正
2. バージョン番号を上げる（`badge-ver` の表示テキスト）
3. `backup/` にバックアップを保存
4. Git にコミット & プッシュ

```bash
# バックアップ
cp index.html backup/index_ver05_description.html

# バージョン番号を ver06 に変更（index.html 内）

# Git コミット
git add index.html
git commit -m "Update feature description (ver06)"
git push origin main
```

5. Vercel が自動的にデプロイ（1〜2 分）

---

## 5. トラブルシューティング

### API エラー: "通信エラー"

**原因:** 環境変数 `DATABASE_URL` が設定されていない

**解決方法:**
1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. `DATABASE_URL` を追加
3. 再デプロイ（Deployments タブから「Redeploy」）

### データベース接続エラー

**原因:** Neon の接続文字列が間違っている

**解決方法:**
1. Neon Console で接続文字列を再確認
2. Vercel の環境変数を修正
3. 再デプロイ

### スキーマエラー

**原因:** テーブルが作成されていない

**解決方法:**
1. Neon Console の SQL Editor で `sql/schema.sql` を実行
2. テーブルが正しく作成されているか確認

---

## 6. カスタムドメイン設定（オプション）

独自ドメインを使いたい場合：

1. Vercel Dashboard → プロジェクト → Settings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例: `tesoro.example.com`）
4. DNS レコードを設定（Vercel が指示を表示）
5. 設定完了後、カスタムドメインでアクセス可能

---

## 7. データ移行（オプション）

Google Spreadsheet から Neon Database にデータを移行したい場合：

### 7.1 Spreadsheet からデータをエクスポート

1. Google Spreadsheet を開く
2. 各シート（events, members, attendance）を CSV でダウンロード

### 7.2 CSV を SQL に変換

`events.csv` の例：

```csv
id,date,type,title,location,time,fileUrl,note
1,2026-10-10,match,練習試合,グラウンドA,10:00,,
```

SQL に変換：

```sql
INSERT INTO events (id, date, type, title, location, time, fileUrl, note)
VALUES (1, '2026-10-10', 'match', '練習試合', 'グラウンドA', '10:00', '', '');
```

### 7.3 Neon に投入

Neon Console の SQL Editor で INSERT 文を実行。

---

## 8. メンテナンス

### バックアップ

Neon は自動バックアップを提供していますが、定期的に手動でバックアップを取ることを推奨：

```bash
# データベースのダンプ
pg_dump "postgresql://[接続文字列]" > backup.sql
```

### ログ確認

Vercel Dashboard → プロジェクト → Deployments → Function Logs でエラーログを確認できます。

---

## まとめ

これで Tesoro が Vercel + Neon Database で稼働します！

**メリット:**
- GitHub Pages より高速なデプロイ
- データベースによる信頼性の高いデータ管理
- API Routes による柔軟な拡張性

**次のステップ:**
- メンバーを登録して、日程を追加してみましょう
- 参加状況を管理してみましょう
