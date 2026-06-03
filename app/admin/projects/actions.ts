"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(_prevState: unknown, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!title || !category) {
    return { error: "Judul dan kategori proyek wajib diisi." };
  }

  const description = (formData.get("description") as string)?.trim() ?? "";
  const project_url = (formData.get("project_url") as string)?.trim() || null;
  const github_url = (formData.get("github_url") as string)?.trim() || null;
  const featured = formData.get("featured") !== null;
  const skillIds = formData.getAll("skill_ids") as string[];

  try {
    await prisma.project.create({
      data: {
        title,
        category,
        description,
        project_url,
        github_url,
        featured,
        skills: {
          create: skillIds.map((skill_id) => ({ skill_id })),
        },
      },
    });
  } catch {
    return { error: "Gagal menyimpan proyek. Coba lagi." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  redirect("/admin/projects");
}

export async function updateProject(id: string, _prevState: unknown, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!title || !category) {
    return { error: "Judul dan kategori proyek wajib diisi." };
  }

  const description = (formData.get("description") as string)?.trim() ?? "";
  const project_url = (formData.get("project_url") as string)?.trim() || null;
  const github_url = (formData.get("github_url") as string)?.trim() || null;
  const featured = formData.get("featured") !== null;
  const skillIds = formData.getAll("skill_ids") as string[];

  try {
    await prisma.$transaction([
      prisma.projectSkill.deleteMany({ where: { project_id: id } }),
      prisma.project.update({
        where: { id },
        data: { title, category, description, project_url, github_url, featured },
      }),
      prisma.projectSkill.createMany({
        data: skillIds.map((skill_id) => ({ project_id: id, skill_id })),
      }),
    ]);
  } catch {
    return { error: "Gagal memperbarui proyek. Coba lagi." };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { medias: { select: { image_url: true } } },
  });

  await prisma.project.delete({ where: { id } });

  if (project?.medias.length) {
    await Promise.allSettled(project.medias.map((m) => deleteFile(m.image_url)));
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function addProjectMedia(
  projectId: string,
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Pilih file gambar terlebih dahulu." };

  let imageUrl: string;
  try {
    imageUrl = await uploadFile(file, "projects");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal." };
  }

  const caption = (formData.get("caption") as string)?.trim() || null;

  try {
    await prisma.media.create({
      data: { image_url: imageUrl, caption, project_id: projectId },
    });
  } catch {
    await deleteFile(imageUrl).catch(() => {});
    return { error: "Gagal menyimpan media ke database." };
  }

  revalidatePath(`/admin/projects/${projectId}/edit`);
  return { error: "" };
}

export async function moveProject(id: string, direction: "up" | "down") {
  const projects = await prisma.project.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
    select: { id: true, sort_order: true },
  });

  const currentIndex = projects.findIndex((p) => p.id === id);
  if (currentIndex === -1) return;

  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (swapIndex < 0 || swapIndex >= projects.length) return;

  [projects[currentIndex], projects[swapIndex]] = [projects[swapIndex], projects[currentIndex]];

  await prisma.$transaction(
    projects.map((p, i) =>
      prisma.project.update({ where: { id: p.id }, data: { sort_order: i } })
    )
  );

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function setProjectMediaAsCover(mediaId: string) {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { project_id: true },
  });

  if (!media?.project_id) return;

  await prisma.$transaction([
    prisma.media.updateMany({
      where: { project_id: media.project_id },
      data: { sort_order: 0 },
    }),
    prisma.media.update({
      where: { id: mediaId },
      data: { sort_order: -1 },
    }),
  ]);

  revalidatePath(`/admin/projects/${media.project_id}/edit`);
  revalidatePath("/");
}

export async function deleteProjectMedia(mediaId: string) {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { image_url: true, project_id: true },
  });

  await prisma.media.delete({ where: { id: mediaId } });

  if (media?.image_url) await deleteFile(media.image_url).catch(() => {});
  if (media?.project_id) {
    revalidatePath(`/admin/projects/${media.project_id}/edit`);
  }
}
