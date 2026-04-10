# Frontend Container Structure

Pedoman ini berlaku untuk admin app dan app lain di repo ini.

## Aturan Dasar

- `1 page = 1 container`
- file di `components/` hanya untuk hal yang benar-benar reusable lintas page atau lintas feature
- file yang hanya dipakai oleh satu feature harus tinggal di folder feature itu sendiri
- form yang punya tanggung jawab spesifik dipisah dari page container

## Struktur Yang Disarankan

Contoh:

```text
containers/
  daycare/
    DaycareListContainer.tsx
    DaycareListItem.tsx
    shared/
      ApprovalStatusBadge.tsx
  daycare-detail/
    DaycareDetailContainer.tsx
    DaycareDetailHeader.tsx
    DaycareHeroSection.tsx
    DaycareDetailSection.tsx
    DaycareStatusForm.tsx
    DaycareDocumentForm.tsx
    DaycareMembershipForm.tsx
    DaycareOwnerSection.tsx
    DaycareStatusSection.tsx
    DaycareDocumentsSection.tsx
    DaycareHistorySection.tsx
    DaycareMembershipsSection.tsx
  daycare-create/
    DaycareCreateContainer.tsx
    DaycareCreateOwnerSection.tsx
    DaycareCreateInfoSection.tsx
  user/
    UserListContainer.tsx
    UserListItem.tsx
  user-detail/
    UserDetailContainer.tsx
    UserSummarySection.tsx
    UserProfileSection.tsx
    UserPasswordSection.tsx
    UserDangerSection.tsx
  user-create/
    UserCreateContainer.tsx
```

## Boundary

- `Container`
  mengurus data fetching, state page, navigation, dan orchestration
- `Form`
  mengurus input UI dan submit intent untuk satu concern spesifik
- `Section`
  mengurus blok tampilan detail untuk satu concern spesifik dalam satu page
- `Shared feature component`
  hanya dipakai jika minimal dua file di feature yang sama membutuhkannya
- `Global component`
  hanya dipakai jika reusable lintas feature atau lintas app

## Contoh

- benar:
  - `DaycareDetailContainer`
  - `DaycareDetailHeader`
  - `DaycareHeroSection`
  - `DaycareDetailSection`
  - `DaycareStatusForm`
  - `DaycareDocumentForm`
  - `DaycareMembershipsSection`
  - `DaycareCreateOwnerSection`
  - `DaycareCreateInfoSection`
- kurang baik:
  - menaruh `DaycareListItem` di global `components/` padahal hanya dipakai feature daycare
  - menaruh banyak form detail langsung di satu file container

## Shared UI

Kalau komponen sudah reusable lintas app:

- pindahkan ke `packages/ui`
- contoh:
  - `SelectInput`
  - `DaycareStatusInput`
  - `ScreenHeader`
  - `ListFilterBar`

Kalau masih reusable hanya di satu feature:

- simpan di folder feature

## Prinsip Praktis

- jangan buat folder `*-admin` besar yang menampung banyak page berbeda
- pecah per feature atau per page intent
- utamakan nama yang jelas:
  - `DaycareListContainer`
  - bukan `DaycareQueueContainer`
