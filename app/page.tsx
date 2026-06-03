import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [workExperiences, projects, skills, certificates, adminUser] = await Promise.all([
    prisma.workExperience.findMany({
      include: { medias: { orderBy: { sort_order: "asc" } } },
      orderBy: { start_date: "desc" },
    }),
    prisma.project.findMany({
      include: {
        medias: { orderBy: { sort_order: "asc" } },
        skills: { include: { skill: true } },
      },
      orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
    }),
    prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.certificate.findMany({
      orderBy: [{ sort_order: "asc" }, { issued_date: "desc" }],
    }),
    prisma.user.findFirst({
      select: { profile_photo_url: true },
    }),
  ]);

  const profilePhotoUrl = adminUser?.profile_photo_url ?? "/images/profile.png";

  return (
    <div className="min-h-screen bg-th-bg text-th-ink">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        <HeroSection profilePhotoUrl={profilePhotoUrl} />
        <ExperienceSection workExperiences={workExperiences} />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <CertificatesSection certificates={certificates} />
      </main>

      <footer className="border-t border-th-border mt-4 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-th-muted">
            © {new Date().getFullYear()} Dani Ruliansyah. All rights reserved.
          </p>
          <p className="text-xs text-th-muted">
            Built with{" "}
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              Next.js
            </span>{" "}
            &{" "}
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              Tailwind CSS
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
