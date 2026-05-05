# Shared Layout Primitives

Gunakan komponen shared dari `@mami/ui` untuk tampilan dasar halaman sebelum membuat komponen lokal baru.

## Page Shell

- `Screen`
  - untuk page biasa, list, dashboard, create form
- `DetailScreen`
  - untuk detail page dengan header sticky sederhana
- `PageHeader`
  - untuk page non-tab yang hanya butuh header reuseable

## Section

- `SectionCard`
  - section umum dengan `title`, `subtitle`, `action`
- `ScreenSection`
  - wrapper kompatibilitas lama, basisnya sekarang `SectionCard`

## Data Display

- `InfoRow`
  - label-value horizontal atau stacked
- `InfoGroup`
  - kumpulan beberapa `InfoRow`
- `InlineMessage`
  - helper/warning/error ringan di dalam section
- `StatCard`
  - angka ringkasan dashboard atau KPI
- `StateCard`
  - loading, empty, error state
- `ActionTile`
  - navigasi/quick action/module tile

## Form & Overlay

- `DynamicForm`
  - Zod only
- `useAlert`
- `useConfirm`
- `useModal`
- `useDrawer`

## Rules

- jangan buat card section lokal baru jika `SectionCard` cukup
- jangan buat header page lokal baru jika `PageHeader` atau `DetailScreen` cukup
- list/detail state sebaiknya pakai `StateCard`
- module card, quick action, shortcut tile sebaiknya pakai `ActionTile`
- summary angka sebaiknya pakai `StatCard`

## Scope

- shared UI hanya untuk pola visual yang berulang lintas page/app
- kalau komponen hanya dipakai satu page dan tidak reusable, tetap simpan di folder container page itu
