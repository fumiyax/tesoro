# 02_tesoro 開発ルール

## デプロイ
- **index.htmlを修正したら自動でgit commit & push すること**
- リポジトリ: https://github.com/fumiyax/tesoro
- ブランチ: main
- コミットメッセージは変更内容を簡潔に英語で記載

## バックアップ
- index.htmlを修正する前にバックアップを取ること
- 保存先: 同ディレクトリ内 `backup_*.html`
- バックアップファイルはgitにコミットしない（index.htmlのみコミット対象）
