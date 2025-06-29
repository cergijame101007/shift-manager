# シフト管理アプリ

このプロジェクトは、**Next.js** で構築されたシフト管理アプリです。  
従業員のシフト提出・共有などをサポートします。

---

## 主な機能

- シフト希望の提出・編集・削除
- 共有カレンダーによるシフトの可視化
- ログイン認証（Supabase利用）
- レスポンシブ対応（PC・スマホ両対応）

---

## ディレクトリ構成例

```
src/
  app/
    components/      # UIコンポーネント
    login/           # ログインページ
    schedule/        # 共有カレンダーページ
    submit/          # シフト提出ページ
        history/     # 提出履歴ページ
  types/             # 型定義
  lib/               # Supabase等のライブラリ
```

---

## 主な技術

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)（認証・DB）
- [FullCalendar](https://fullcalendar.io/)（カレンダーUI）
- [Tailwind CSS](https://tailwindcss.com/)（スタイリング）

---

## 開発メモ

- 型定義は `src/types/shift.ts` などに分離
- カレンダーやモーダルはコンポーネント化して管理
- シフト履歴は`LocalStorage`で管理可能

---

## デプロイ

[Vercel](https://vercel.com/) でデプロイ予定です。
