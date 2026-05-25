import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditExperienceForm } from "./_form";
import { MediaSection } from "@/app/admin/_components/MediaSection";
import { addExperienceMedia, deleteExperienceMedia } from "../../actions";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await prisma.workExperience.findUnique({
    where: { id },
    include: { medias: { orderBy: { sort_order: "asc" } } },
  });

  if (!experience) notFound();

  const uploadAction = addExperienceMedia.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/experiences" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Edit Pengalaman Kerja</h1>
      </div>

      <EditExperienceForm experience={experience} />

      <MediaSection
        medias={experience.medias}
        uploadAction={uploadAction}
        deleteAction={deleteExperienceMedia}
      />
    </div>
  );
}
