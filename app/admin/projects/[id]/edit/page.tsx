import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditProjectForm } from "./_form";
import { MediaSection } from "@/app/admin/_components/MediaSection";
import { addProjectMedia, deleteProjectMedia } from "../../actions";
import type { Skill } from "@prisma/client";

function groupByCategory(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, allSkills] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        skills: { select: { skill_id: true } },
        medias: { orderBy: { sort_order: "asc" } },
      },
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  if (!project) notFound();

  const selectedSkillIds = project.skills.map((s) => s.skill_id);
  const skillsByCategory = groupByCategory(allSkills);
  const uploadAction = addProjectMedia.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Edit Proyek</h1>
      </div>

      <EditProjectForm
        project={project}
        selectedSkillIds={selectedSkillIds}
        skillsByCategory={skillsByCategory}
      />

      <MediaSection
        medias={project.medias}
        uploadAction={uploadAction}
        deleteAction={deleteProjectMedia}
      />
    </div>
  );
}
