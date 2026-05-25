import { prisma } from "@/lib/prisma";

async function getStats() {
  const [experiences, projects, skills, certificates] = await Promise.all([
    prisma.workExperience.count(),
    prisma.project.count(),
    prisma.skill.count(),
    prisma.certificate.count(),
  ]);
  return { experiences, projects, skills, certificates };
}

const statCards = [
  { key: "experiences", label: "Pengalaman Kerja", href: "/admin/experiences" },
  { key: "projects", label: "Proyek", href: "/admin/projects" },
  { key: "skills", label: "Skill", href: "/admin/skills" },
  { key: "certificates", label: "Sertifikat", href: "/admin/certificates" },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Ringkasan data portofolio Anda</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <a
            key={card.key}
            href={card.href}
            className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition group"
          >
            <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition">
              {stats[card.key]}
            </p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
