import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NewProjectForm } from "./_form";
import type { Skill } from "@prisma/client";

function groupByCategory(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

export default async function NewProjectPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const skillsByCategory = groupByCategory(skills);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Proyek</h1>
      </div>

      <NewProjectForm skillsByCategory={skillsByCategory} />

      <p className="text-gray-500 text-xs mt-4">
        Setelah disimpan, Anda dapat menambahkan screenshot proyek melalui halaman edit.
      </p>
    </div>
  );
}
