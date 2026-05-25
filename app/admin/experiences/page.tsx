import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteExperience } from "./actions";
import { DeleteButton } from "../_components/DeleteButton";

function formatPeriod(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "Sekarang"}`;
}

export default async function ExperiencesPage() {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { start_date: "desc" },
    include: { _count: { select: { medias: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pengalaman Kerja</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {experiences.length} entri terdaftar
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
        >
          + Tambah Pengalaman
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {experiences.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Belum ada data pengalaman kerja.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Perusahaan</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Jabatan</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Periode</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Gambar</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{exp.company_name}</td>
                  <td className="px-6 py-4 text-gray-300">{exp.role}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {formatPeriod(exp.start_date, exp.end_date)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {exp._count.medias} gambar
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 justify-end">
                      <Link
                        href={`/admin/experiences/${exp.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteExperience.bind(null, exp.id)} />
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
