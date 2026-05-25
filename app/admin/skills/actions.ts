"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSkill(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!name || !category) return { error: "Nama dan kategori wajib diisi." };

  try {
    await prisma.skill.create({ data: { name, category } });
  } catch {
    return { error: "Gagal menyimpan data. Coba lagi." };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/admin");
  redirect("/admin/skills");
}

export async function updateSkill(id: string, _prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!name || !category) return { error: "Nama dan kategori wajib diisi." };

  try {
    await prisma.skill.update({ where: { id }, data: { name, category } });
  } catch {
    return { error: "Gagal memperbarui data. Coba lagi." };
  }

  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}
