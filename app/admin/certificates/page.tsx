import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteCertificate, moveCertificate } from "./actions";
import { DeleteButton } from "../_components/DeleteButton";
import { ReorderButtons } from "../_components/ReorderButtons";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ sort_order: "asc" }, { issued_date: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sertifikat</h1>
          <p className="text-gray-400 text-sm mt-0.5">{certificates.length} sertifikat terdaftar</p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
        >
          + Tambah Sertifikat
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {certificates.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Belum ada data sertifikat.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium w-16">Urutan</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nama Sertifikat</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Lembaga</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Tanggal Terbit</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Kedaluwarsa</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {certificates.map((cert, index) => (
                <tr key={cert.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs w-4 text-center">{index + 1}</span>
                      <ReorderButtons
                        itemId={cert.id}
                        isFirst={index === 0}
                        isLast={index === certificates.length - 1}
                        moveAction={moveCertificate}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{cert.name}</p>
                    {cert.credential_id && (
                      <p className="text-gray-500 text-xs mt-0.5">ID: {cert.credential_id}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-300">{cert.issuing_org}</td>
                  <td className="px-4 py-4 text-gray-400">{formatDate(cert.issued_date)}</td>
                  <td className="px-4 py-4 text-gray-400">
                    {cert.expiration_date ? formatDate(cert.expiration_date) : (
                      <span className="text-green-500 text-xs">Tidak kedaluwarsa</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 justify-end">
                      <Link
                        href={`/admin/certificates/${cert.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteCertificate.bind(null, cert.id)} />
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
