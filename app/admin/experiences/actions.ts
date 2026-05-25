"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseDate(value: FormDataEntryValue | null): Date | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function createExperience(_prevState: unknown, formData: FormData) {
  const company_name = (formData.get("company_name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const start_date = parseDate(formData.get("start_date"));

  if (!company_name || !role || !start_date) {
    return { error: "Nama perusahaan, jabatan, dan tanggal mulai wajib diisi." };
  }

  const location = (formData.get("location") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() ?? "";
  const end_date = parseDate(formData.get("end_date"));

  try {
    await prisma.workExperience.create({
      data: { company_name, role, location, description, start_date, end_date },
    });
  } catch {
    return { error: "Gagal menyimpan data. Coba lagi." };
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/admin");
  redirect("/admin/experiences");
}

export async function updateExperience(id: string, _prevState: unknown, formData: FormData) {
  const company_name = (formData.get("company_name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const start_date = parseDate(formData.get("start_date"));

  if (!company_name || !role || !start_date) {
    return { error: "Nama perusahaan, jabatan, dan tanggal mulai wajib diisi." };
  }

  const location = (formData.get("location") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() ?? "";
  const end_date = parseDate(formData.get("end_date"));

  try {
    await prisma.workExperience.update({
      where: { id },
      data: { company_name, role, location, description, start_date, end_date },
    });
  } catch {
    return { error: "Gagal memperbarui data. Coba lagi." };
  }

  revalidatePath("/admin/experiences");
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  const exp = await prisma.workExperience.findUnique({
    where: { id },
    include: { medias: { select: { image_url: true } } },
  });

  await prisma.workExperience.delete({ where: { id } });

  if (exp?.medias.length) {
    await Promise.allSettled(exp.medias.map((m) => deleteFile(m.image_url)));
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/admin");
}

export async function addExperienceMedia(
  experienceId: string,
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Pilih file gambar terlebih dahulu." };

  let imageUrl: string;
  try {
    imageUrl = await uploadFile(file, "experiences");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal." };
  }

  const caption = (formData.get("caption") as string)?.trim() || null;

  try {
    await prisma.media.create({
      data: { image_url: imageUrl, caption, experience_id: experienceId },
    });
  } catch {
    await deleteFile(imageUrl).catch(() => {});
    return { error: "Gagal menyimpan media ke database." };
  }

  revalidatePath(`/admin/experiences/${experienceId}/edit`);
  return { error: "" };
}

export async function deleteExperienceMedia(mediaId: string) {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { image_url: true, experience_id: true },
  });

  await prisma.media.delete({ where: { id: mediaId } });

  if (media?.image_url) await deleteFile(media.image_url).catch(() => {});
  if (media?.experience_id) {
    revalidatePath(`/admin/experiences/${media.experience_id}/edit`);
  }
}
