import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteSkill } from "./actions";
import { DeleteButton } from "../_components/DeleteButton";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-gray-400 text-sm mt-0.5">{skills.length} skill terdaftar</p>
        </div>
        <Link
          href="/admin/skills/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
        >
          + Tambah Skill
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {skills.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Belum ada data skill.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Nama</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Kategori</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{skill.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 justify-end">
                      <Link
                        href={`/admin/skills/${skill.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteSkill.bind(null, skill.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
