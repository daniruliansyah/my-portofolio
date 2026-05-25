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

export async function createCertificate(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const issuing_org = (formData.get("issuing_org") as string)?.trim();
  const issued_date = parseDate(formData.get("issued_date"));
  const imageFile = formData.get("image_file") as File | null;

  if (!name || !issuing_org || !issued_date) {
    return { error: "Nama, lembaga penerbit, dan tanggal terbit wajib diisi." };
  }
  if (!imageFile || imageFile.size === 0) {
    return { error: "Gambar sertifikat wajib diunggah." };
  }

  let image_url: string;
  try {
    image_url = await uploadFile(imageFile, "certificates");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gambar gagal." };
  }

  const expiration_date = parseDate(formData.get("expiration_date"));
  const credential_id = (formData.get("credential_id") as string)?.trim() || null;
  const credential_url = (formData.get("credential_url") as string)?.trim() || null;

  try {
    await prisma.certificate.create({
      data: { name, issuing_org, image_url, issued_date, expiration_date, credential_id, credential_url },
    });
  } catch {
    // Hapus file yang sudah terupload jika DB gagal
    await deleteFile(image_url).catch(() => {});
    return { error: "Gagal menyimpan data. Coba lagi." };
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/admin");
  redirect("/admin/certificates");
}

export async function updateCertificate(id: string, _prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const issuing_org = (formData.get("issuing_org") as string)?.trim();
  const issued_date = parseDate(formData.get("issued_date"));

  if (!name || !issuing_org || !issued_date) {
    return { error: "Nama, lembaga penerbit, dan tanggal terbit wajib diisi." };
  }

  // Jika ada file baru → upload dan ganti URL lama
  const imageFile = formData.get("image_file") as File | null;
  const existingImageUrl = (formData.get("existing_image_url") as string)?.trim();
  let image_url = existingImageUrl;

  if (imageFile && imageFile.size > 0) {
    try {
      image_url = await uploadFile(imageFile, "certificates");
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload gambar gagal." };
    }
  }

  if (!image_url) return { error: "Gambar sertifikat tidak boleh kosong." };

  const expiration_date = parseDate(formData.get("expiration_date"));
  const credential_id = (formData.get("credential_id") as string)?.trim() || null;
  const credential_url = (formData.get("credential_url") as string)?.trim() || null;

  try {
    await prisma.certificate.update({
      where: { id },
      data: { name, issuing_org, image_url, issued_date, expiration_date, credential_id, credential_url },
    });
  } catch {
    return { error: "Gagal memperbarui data. Coba lagi." };
  }

  // Hapus gambar lama dari Storage jika diganti
  if (imageFile && imageFile.size > 0 && existingImageUrl) {
    await deleteFile(existingImageUrl).catch(() => {});
  }

  revalidatePath("/admin/certificates");
  redirect("/admin/certificates");
}

export async function deleteCertificate(id: string) {
  const cert = await prisma.certificate.findUnique({ where: { id }, select: { image_url: true } });

  await prisma.certificate.delete({ where: { id } });

  if (cert?.image_url) {
    await deleteFile(cert.image_url).catch(() => {});
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/admin");
}
