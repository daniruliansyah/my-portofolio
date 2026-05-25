import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Gunakan authConfig (edge-safe), bukan auth dari auth.ts (butuh Node.js/pg).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
