"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/upload";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return prisma.user.findUniqueOrThrow({ where: { email: session.user.email } });
}

export async function updateProfilePhoto(
  _prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Pilih file foto terlebih dahulu.", success: "" };

  let user;
  try {
    user = await getSessionUser();
  } catch {
    return { error: "Sesi tidak valid.", success: "" };
  }

  let newUrl: string;
  try {
    newUrl = await uploadFile(file, "profile");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal.", success: "" };
  }

  const oldUrl = user.profile_photo_url;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { profile_photo_url: newUrl },
    });
  } catch {
    await deleteFile(newUrl).catch(() => {});
    return { error: "Gagal menyimpan foto.", success: "" };
  }

  // Hapus foto lama dari Storage jika ada dan bukan file lokal
  if (oldUrl?.startsWith("https://")) {
    await deleteFile(oldUrl).catch(() => {});
  }

  revalidatePath("/");
  return { error: "", success: "Foto profil berhasil diperbarui." };
}

export async function changePassword(
  _prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  const currentPassword = (formData.get("current_password") as string)?.trim();
  const newPassword = (formData.get("new_password") as string)?.trim();
  const confirmPassword = (formData.get("confirm_password") as string)?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Semua kolom wajib diisi.", success: "" };
  }
  if (newPassword.length < 8) {
    return { error: "Password baru minimal 8 karakter.", success: "" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok.", success: "" };
  }

  let user;
  try {
    user = await getSessionUser();
  } catch {
    return { error: "Sesi tidak valid.", success: "" };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return { error: "Password saat ini salah.", success: "" };

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return { error: "", success: "Password berhasil diubah." };
}
