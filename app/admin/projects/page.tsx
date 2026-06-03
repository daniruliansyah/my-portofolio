import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProject, moveProject } from "./actions";
import { DeleteButton } from "../_components/DeleteButton";
import { ReorderButtons } from "./_components/ReorderButtons";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
    include: {
      _count: { select: { medias: true, skills: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proyek</h1>
          <p className="text-gray-400 text-sm mt-0.5">{projects.length} proyek terdaftar</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
        >
          + Tambah Proyek
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Belum ada data proyek.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium w-16">Urutan</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Judul</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Kategori</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Skill</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Gambar</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.map((project, index) => (
                <tr key={project.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs w-4 text-center">{index + 1}</span>
                      <ReorderButtons
                        projectId={project.id}
                        isFirst={index === 0}
                        isLast={index === projects.length - 1}
                        moveAction={moveProject}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white font-medium">{project.title}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    {project._count.skills} skill
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    {project._count.medias} gambar
                  </td>
                  <td className="px-4 py-4">
                    {project.featured ? (
                      <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs">
                        Ya
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 justify-end">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteProject.bind(null, project.id)} />
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
