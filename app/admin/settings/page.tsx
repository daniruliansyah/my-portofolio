import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfilePhotoForm, ChangePasswordForm } from "./_forms";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session.user.email },
    select: { name: true, email: true, profile_photo_url: true },
  });

  const currentPhotoUrl = user.profile_photo_url ?? "/images/profile.png";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {user.name} · {user.email}
        </p>
      </div>

      <div className="space-y-6">
        <ProfilePhotoForm currentPhotoUrl={currentPhotoUrl} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
