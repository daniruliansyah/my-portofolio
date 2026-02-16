export interface Data {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string; // Tanda ? artinya opsional (kalau private repo)
  demoLink?: string;
}

export const datas: Data[] = [
  {
    id: 1,
    title: "Automotive Sales Dashboard",
    description: "Analisis data end-to-end pipeline penjualan otomotif dengan visualisasi interaktif.",
    techStack: ["Python", "Pandas", "MySQL", "Google Sheets"],
    repoLink: "https://github.com/daniruliansyah/car-sales",
  },
  {
    id: 2,
    title: "HRIS System (Sistem Kepegawaian)",
    description: "Aplikasi manajemen SDM lengkap dengan fitur penggajian dan absensi.",
    techStack: ["PHP", "Laravel", "Bootstrap", "MySQL"],
    repoLink: "https://github.com/daniruliansyah/pkl-palawi",
  },
  {
    id: 3,
    title: "NestJS Employee API",
    description: "Backend service untuk manajemen karyawan dengan otentikasi JWT.",
    techStack: ["TypeScript", "NestJS", "TypeORM"],
    repoLink: "https://github.com/daniruliansyah/baackend-nest",
  },
];