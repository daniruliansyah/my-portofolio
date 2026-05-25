import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Memaksa Node.js membaca file .env sebelum konfigurasi Prisma dimuat
dotenv.config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});