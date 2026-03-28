# 02_tesoro 開発ルール

## バージョン管理
- **index.htmlを修正するたびにヘッダーのver番号を1つ上げること**（`badge-ver`の表示テキスト）
- GitHub Pagesへの反映に時間差があるため、ver番号で最新かどうかを判別する

## デプロイ
- **index.htmlを修正したら自動でgit commit & push すること**
- リポジトリ: https://github.com/fumiyax/tesoro
- ブランチ: main
- コミットメッセージは変更内容を簡潔に英語で記載

## バックアップ
- index.htmlを修正する前にバックアップを取ること
- 保存先: 同ディレクトリ内 `backup_*.html`
- バックアップファイルはgitにコミットしない（index.htmlのみコミット対象）
