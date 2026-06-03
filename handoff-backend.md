# Handoff: Backend & Admin Panel (Langkah 1–3 Selesai)

> **Untuk session baru:** Jangan eksekusi kode apapun dulu. Tunggu brief UI dari user
> sebelum mulai mengerjakan Langkah 4. User akan menjelaskan tampilan/desain landing
> page yang diinginkan sebelum pengerjaan dimulai.

---

## Konteks Proyek

Website portofolio pribadi berbasis **Next.js 16 (App Router)** dengan panel admin
terproteksi login untuk mengelola data secara penuh (CRUD). Backend sudah selesai
dibangun di session sebelumnya.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma ORM v7 (driver adapter: `@prisma/adapter-pg`) |
| Auth | Auth.js v5 (NextAuth) — Credentials provider, JWT session |
| Storage Gambar | Supabase Storage (bucket: `portofolio-assets`) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript |

---

## Catatan Penting Prisma v7

Prisma v7 tidak lagi menggunakan embedded driver. Semua koneksi database menggunakan
**Driver Adapter**. Contoh inisialisasi yang benar:

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
```

Jangan gunakan opsi `datasources: { db: { url: ... } }` — itu sudah dihapus di v7.

---

## Skema Database (prisma/schema.prisma)

7 tabel dengan relasi berikut:

```
users               — Auth admin login
work_experiences    — Pengalaman kerja (One-to-Many → medias)
projects            — Proyek (One-to-Many → medias, Many-to-Many → skills)
skills              — Daftar skill/teknologi
project_skills      — Tabel pivot Many-to-Many (project ↔ skill)
medias              — Gambar/screenshot (FK opsional ke project atau experience)
certificates        — Sertifikat (image_url dari Supabase Storage)
```

Semua primary key: UUID (`@id @default(uuid()) @db.Uuid`).
Datasource hanya punya `provider = "postgresql"` tanpa `url` (URL ada di `prisma.config.ts`).

---

## Environment Variables (.env)

```env
DATABASE_URL="postgresql://..."        # Supabase direct connection port 5432
AUTH_SECRET="..."                      # Secret untuk JWT Auth.js
NEXT_PUBLIC_SUPABASE_URL="https://..." # URL project Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."    # Anon key Supabase
SUPABASE_SERVICE_ROLE_KEY="..."        # Service role key (server-only, untuk upload)
```

---

## Arsitektur Auth (Edge-Safe)

Auth.js dipisah menjadi dua file agar middleware bisa jalan di Edge Runtime:

```
auth.config.ts   → Edge-safe (tidak import pg/Prisma). Dipakai middleware.ts
auth.ts          → Full config (import Prisma + bcrypt). Dipakai Server Components & Actions
middleware.ts    → Import dari auth.config.ts (bukan auth.ts) — ini kunci agar tidak error
```

User admin pertama dibuat via `prisma/seed.ts` dengan kredensial:
- Email: `admin@portofolio.com`
- Password: `admin123` (sudah di-hash dengan bcrypt)

---

## Struktur File yang Sudah Dibuat

```
lib/
  prisma.ts              — Prisma Client singleton (dengan PrismaPg adapter)
  supabase.ts            — Supabase admin client (service role, server-only)
  upload.ts              — Helper: uploadFile(), deleteFile() ke Supabase Storage

auth.config.ts           — Edge-safe auth config
auth.ts                  — Full auth config (Credentials provider + Prisma)
middleware.ts            — Proteksi route /admin, redirect ke /login jika belum login

prisma/
  schema.prisma          — Skema lengkap 7 tabel
  seed.ts                — Script buat user admin pertama

app/
  (auth)/login/
    page.tsx             — Halaman login (form email + password)
    actions.ts           — Server Action: loginAction()

  admin/
    layout.tsx           — Sidebar navigasi + tombol logout
    page.tsx             — Dashboard (statistik jumlah data per tabel)

    _components/
      DeleteButton.tsx   — Client component: confirm dialog + delete
      SubmitButton.tsx   — Client component: aware pending state
      MediaSection.tsx   — Client component: galeri gambar + upload + hapus

    skills/
      actions.ts         — createSkill, updateSkill, deleteSkill
      page.tsx           — List skills (tabel + badge kategori)
      new/page.tsx       — Form tambah skill
      [id]/edit/
        page.tsx         — Server: fetch → render form
        _form.tsx        — Client: form edit pre-filled

    certificates/
      actions.ts         — createCertificate, updateCertificate, deleteCertificate
                           (upload gambar ke Storage folder "certificates/")
      page.tsx           — List sertifikat (tabel + format tanggal id-ID)
      new/page.tsx       — Form tambah (file upload sungguhan)
      [id]/edit/
        page.tsx         — Server: fetch → render form
        _form.tsx        — Client: form edit + preview gambar lama

    experiences/
      actions.ts         — createExperience, updateExperience, deleteExperience
                           addExperienceMedia, deleteExperienceMedia
      page.tsx           — List pengalaman (tabel + format periode)
      new/page.tsx       — Form tambah (tanpa gambar, gambar via edit)
      [id]/edit/
        page.tsx         — Server: fetch experience + medias
        _form.tsx        — Client: form edit fields
        (MediaSection dirender langsung dari page.tsx)

    projects/
      actions.ts         — createProject, updateProject, deleteProject
                           addProjectMedia, deleteProjectMedia
                           (sync ProjectSkill Many-to-Many via $transaction)
      page.tsx           — List proyek (featured badge, skill count, media count)
      new/
        page.tsx         — Server: fetch skills → render form
        _form.tsx        — Client: form + skill checkboxes (grouped by category)
      [id]/edit/
        page.tsx         — Server: fetch project + semua skills
        _form.tsx        — Client: form + skill checkboxes pre-checked
        (MediaSection dirender langsung dari page.tsx)
```

---

## Pola Konsisten yang Dipakai

- **Server Actions** untuk semua mutasi (create, update, delete, upload)
- **`useActionState`** di semua form client untuk error state
- **Server Component** untuk fetch data, **Client Component** untuk form interaktif
- Pattern edit page: `page.tsx` (Server) → fetch → render `_form.tsx` (Client)
- Upload gambar: file → `uploadFile(file, folder)` → public URL → simpan di DB
- Hapus record → otomatis hapus file dari Supabase Storage via `deleteFile(url)`
- `revalidatePath()` dipanggil setelah setiap mutasi untuk invalidasi cache

---

## Supabase Storage

- **Bucket:** `portofolio-assets` (Public)
- **Folder struktur:**
  - `certificates/` — gambar sertifikat
  - `experiences/` — screenshot pengalaman kerja
  - `projects/` — screenshot proyek
- Helper ada di `lib/upload.ts`

---

## Yang Belum Dikerjakan (Tugas Session Baru)

### Langkah 4: Refactor Landing Page Publik

Halaman publik (`app/page.tsx`) saat ini masih menggunakan data hardcoded (atau kosong).
Tujuannya adalah mengubah halaman utama agar **fetch data langsung dari database**
via Prisma — menampilkan pengalaman kerja, proyek, skill, dan sertifikat yang
dikelola via panel admin.

**Yang perlu dikerjakan di session baru:**
1. Tunggu brief UI/desain dari user terlebih dahulu
2. Setelah brief diterima, refactor `app/page.tsx` dan section-section terkait
3. Data yang perlu di-fetch:
   - `workExperience` (dengan `medias`)
   - `projects` (dengan `skills → skill`, `medias`, filter `featured`)
   - `skills` (dikelompokkan by category)
   - `certificates`
4. Semua fetch dilakukan di **Server Component** (tidak perlu API route)
5. Gambar dari Supabase Storage sudah di-whitelist di `next.config.ts`

---

## Cara Menjalankan Proyek

```bash
npm run dev          # Development server
npx prisma generate  # Regenerate Prisma Client (jika schema berubah)
npx prisma db push   # Push schema ke database (tanpa migration file)
npx prisma db seed   # Buat user admin pertama
```
