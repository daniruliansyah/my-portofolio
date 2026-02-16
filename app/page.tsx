// app/page.tsx
"use client";

import { datas } from "../data/data";
import DataCard from "../components/DataCard";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image"; // IMPORT WAJIB: Komponen Gambar Next.js

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        {/* HERO SECTION (RATA TENGAH) */}
        {/* Tambahkan 'flex flex-col items-center text-center' di section pembungkus */}
        <section className="mb-24 mt-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl flex flex-col items-center" // Tambahkan items-center di sini juga
          >
            {/* --- AREA FOTO PROFIL --- */}
            {/* Gunakan pembungkus div relatif untuk ukuran gambar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 animate-blob">
              <div className="bg-white rounded-full p-1 w-full h-full overflow-hidden relative">
                <Image
                  src="/images/profile.png" // Pastikan path ini sesuai dengan file Anda
                  alt="Foto Profil Dani Ruliansyah"
                  fill // Agar gambar mengisi penuh pembungkusnya
                  className="object-cover rounded-full"
                  priority // Prioritaskan loading gambar ini karena di atas lipatan
                />
              </div>
            </div>
            {/* ------------------------- */}

            {/* Badge Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              fullstack web dev CV. DBKLIK Surabaya
            </div>

            {/* Judul Utama */}
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Informatics Student & <br />
              <span className="text-blue-600">Fullstack Enthusiast.</span>
            </h1>

            {/* Deskripsi (tambahkan mx-auto agar paragrafnya juga di tengah) */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Halo! Saya Dani. Saat ini fokus membangun aplikasi web modern
              dengan
              <strong className="text-gray-900"> Laravel</strong>,
              <strong className="text-gray-900"> React</strong>, dan
              <strong className="text-gray-900"> Data Analysis</strong>. Suka
              memecahkan masalah kompleks menjadi solusi yang simpel.
            </p>

            {/* Tombol (tambahkan justify-center) */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300">
                Hubungi Saya <ArrowRight size={18} />
              </button>
              <a
                href="https://github.com/daniruliansyah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-gray-400 transition hover:-translate-y-1 duration-300"
              >
                <FileText size={18} /> Lihat CV
              </a>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datas.map((item, index) => (
              <DataCard key={item.id} data={item} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
