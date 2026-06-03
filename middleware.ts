import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Gunakan authConfig (edge-safe), bukan auth dari auth.ts (butuh Node.js/pg).
const { auth } = NextAuth(authConfig);

// Explicit named export agar Next.js 16 mengenali ini sebagai fungsi middleware.
export const middleware = auth;

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
