# Handoff: UI Refactor Landing Page (Langkah 4 — Hampir Selesai)

> **Untuk session baru:** Baca seluruh dokumen ini sebelum mengeksekusi kode apapun.
> Ada satu bug aktif yang harus diselesaikan lebih dulu (gambar sertifikat tidak muncul).

---

## Status Saat Ini

| Fitur | Status |
|---|---|
| Theme Switcher 3 mode (Light/Dark/ViscaBarca) | ✅ Selesai & berfungsi |
| Data dinamis dari Prisma (Experience, Projects, Skills) | ✅ Selesai & berfungsi |
| Certificates section — layout & data | ✅ Selesai |
| **Certificates section — gambar** | ❌ **Bug aktif** |
| Admin Panel (semua CRUD) | ✅ Tidak tersentuh, tetap berfungsi |

---

## Tech Stack

Sama persis dengan `handoff-backend.md`. Tidak ada perubahan dependency.

---

## File Baru yang Dibuat di Session Ini

```
components/
  ThemeProvider.tsx        — Context + cycle logic (light → dark → viscabarca)
  ThemeToggle.tsx          — Toggle button Sun/Moon/Football ⚽, cycle on click
  sections/
    SectionHeader.tsx      — Shared section header (accent bar + horizontal rule)
    HeroSection.tsx        — Hero: foto profil, badge, heading, CTA pills (hardcoded)
    ExperienceSection.tsx  — Timeline vertikal + media thumbnails
    SkillsSection.tsx      — Skills dikelompokkan per category dengan pill badges
    ProjectsSection.tsx    — Project cards: thumbnail, skill chips, GitHub/Demo links
    CertificatesSection.tsx — Certificate grid: gambar, nama, org, tanggal, verify link
```

## File yang Dimodifikasi

```
app/globals.css          — CSS variables 3 tema + ViscaBarca-specific CSS selectors
tailwind.config.ts       — darkMode: "class", custom color tokens (th-bg, th-ink, dll)
app/layout.tsx           — ThemeProvider wrap, anti-flash inline script
app/page.tsx             — Server Component, Promise.all fetch 4 tabel Prisma
components/Navbar.tsx    — Nav links + ThemeToggle
middleware.ts            — Fix Next.js 16: export const middleware = auth
next.config.ts           — bodySizeLimit 5mb, remotePatterns Supabase + Drive
```

---

## Sistem Theme (Cara Kerja)

- **CSS Variables** didefinisikan per kelas di `globals.css`:
  - `:root, .light { ... }` · `.dark { ... }` · `.viscabarca { ... }`
- `ThemeProvider` menyimpan state theme, toggle class di `<html>`, persist ke `localStorage`
- Anti-flash: inline `<script>` di `<head>` membaca localStorage sebelum React mount
- Tailwind extended colors: `th-bg`, `th-soft`, `th-ink`, `th-muted`, `th-border`, `th-card`, `th-accent`, dll.

**ViscaBarca colors:**
- Background: `#0a0e1a` (deep navy)
- Primary accent: `#004D98` (Blaugrana Blue)
- Secondary accent: `#A50044` (Crimson/Garnet)
- Micro accent: `#EDBB00` (Catalan Yellow — untuk badge hover, dot status)

---

## Bug Aktif: Gambar Sertifikat Tidak Muncul

### Gejala
Kedua gambar sertifikat (HackerRank & Associate Data Scientist) menampilkan
broken image icon di pojok kiri atas card. Layout card sendiri benar.

### Data sudah benar
Kedua baris di tabel `certificates` menyimpan `image_url` berupa URL Supabase
Storage penuh (`https://gmjrersutzhyedbsiwda.supabase.co/...`). URL ini bisa
dibuka langsung di browser.

### Root cause yang paling dicurigai
`next.config.ts` menggunakan fungsi `getSupabaseHostname()` untuk membaca
`NEXT_PUBLIC_SUPABASE_URL` dari env var. Jika fungsi ini mengembalikan string
kosong (`""`), `remotePatterns` tidak akan mencocokkan hostname Supabase apapun
→ Next.js Image Optimizer menolak request dengan 400 Bad Request.

### Kondisi `next.config.ts` saat ini
```ts
function getSupabaseHostname(): string {
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
    return url ? new URL(url).hostname : "";
  } catch {
    return "";
  }
}
```
Jika `NEXT_PUBLIC_SUPABASE_URL` tidak terbaca, fungsi mengembalikan `""`.

### Langkah debug di session baru (LAKUKAN INI DULU)

**Step 1 — Verifikasi nilai env var:**
Tambahkan satu baris log sementara di awal `next.config.ts`:
```ts
console.log("[next.config] supabaseHostname =", getSupabaseHostname());
```
Jalankan `npm run dev`, lihat output terminal. Jika muncul `""` atau `undefined`
→ env var tidak terbaca → lanjut ke Step 2.

**Step 2a — Jika hostname kosong:**
Kemungkinan `NEXT_PUBLIC_SUPABASE_URL` tidak ada di `.env` atau nama file env
salah (`.env.local` vs `.env`). Periksa file `.env` di root proyek, pastikan
ada baris:
```
NEXT_PUBLIC_SUPABASE_URL="https://gmjrersutzhyedbsiwda.supabase.co"
```

**Step 2b — Jika hostname sudah benar tapi gambar tetap gagal:**
Kemungkinan Windows Defender / proxy memblokir Node.js dari membuat outbound
HTTPS request ke Supabase (browser bisa akses karena stack network berbeda).
Solusi: tambahkan prop `unoptimized` pada `<Image>` di `CertificatesSection.tsx`:
```tsx
<Image
  src={resolveImageUrl(cert.image_url)}
  alt={cert.name}
  fill
  unoptimized          // ← tambahkan ini untuk bypass Next.js Image Optimizer
  className="object-cover ..."
  sizes="..."
/>
```
`unoptimized` membuat browser fetch gambar langsung dari Supabase URL tanpa
melalui `/_next/image` proxy — menghilangkan ketergantungan pada config.

---

## Struktur Data (Prisma)

Fetch di `app/page.tsx` (Server Component):
```ts
const [workExperiences, projects, skills, certificates] = await Promise.all([
  prisma.workExperience.findMany({ include: { medias: true }, orderBy: { start_date: "desc" } }),
  prisma.project.findMany({
    include: { medias: true, skills: { include: { skill: true } } },
    orderBy: [{ featured: "desc" }, { created_at: "desc" }],
  }),
  prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  prisma.certificate.findMany({ orderBy: { issued_date: "desc" } }),
]);
```

---

## Pola yang Dipakai di Komponen Section

- Semua section: `"use client"` (Framer Motion), props dari Server Component
- Animasi: `motion.div` dengan `whileInView` + `viewport: { once: true }`
- Theme-aware: semua warna via CSS variable (`var(--accent)`, `var(--bg-primary)`, dll.)
  atau Tailwind token (`bg-th-bg`, `text-th-ink`, dll.)
- ViscaBarca special: class `.section-accent-bar`, `.section-rule`, `.barca-badge`,
  `.barca-card`, `.timeline-line` — di-override via `globals.css`

---

## Yang Belum Dikerjakan (Opsional / Next Steps)

- [ ] SEO: `generateMetadata` di `app/page.tsx` untuk Open Graph
- [ ] Halaman publik per-project (`/projects/[id]`) dengan galeri media lengkap
- [ ] Contact form yang fungsional (saat ini tombol "Hubungi Saya" hanya `mailto:`)
- [ ] Loading skeleton untuk section yang fetch data
- [ ] Mobile hamburger menu (saat ini nav links hidden di mobile)

---

## Cara Menjalankan

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build (harus berhasil tanpa error)
```

Admin panel: `localhost:3000/admin` — login dengan kredensial di `prisma/seed.ts`.
