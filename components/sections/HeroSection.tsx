"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-20 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="max-w-2xl flex flex-col items-center"
      >
        {/* Profile photo with dual-accent gradient ring */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full p-[3px]"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))" }}>
          <div className="rounded-full overflow-hidden w-full h-full relative"
            style={{ background: "var(--bg-primary)", padding: "3px" }}>
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/images/profile.png"
                alt="Foto Profil Dani Ruliansyah"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-th-badge-bg text-th-badge text-sm font-semibold mb-3 border border-th-border"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: "var(--accent3)" }}
            />
          </span>
          Fullstack Web Dev (Omnichannel) · DBKLIK Surabaya
        </motion.div>

        {/* Education badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-th-badge-bg text-th-badge text-sm font-semibold mb-6 border border-th-border"
        >
          <GraduationCap size={14} className="shrink-0" />
          Airlangga University · Undergraduate Informatics Engineering · GPA 3.41
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-th-ink mb-5 leading-[1.1]"
        >
          Informatics Student &{" "}
          <br className="hidden sm:block" />
          <span style={{ color: "var(--accent)" }}>Fullstack Enthusiast.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-th-muted max-w-2xl mx-auto leading-relaxed mb-9 text-justify sm:text-center"
      >
        Mahasiswa tingkat akhir <strong className="text-th-ink font-semibold">Teknik Informatika</strong> yang berspesialisasi dalam membangun aplikasi web <strong className="text-th-ink font-semibold">end-to-end</strong> yang scalable. Mahir dalam menjembatani arsitektur server-side yang tangguh menggunakan <strong className="text-th-ink font-semibold">PHP (Laravel)</strong> dan <strong className="text-th-ink font-semibold">Python</strong> dengan antarmuka yang responsif menggunakan teknologi frontend modern seperti <strong className="text-th-ink font-semibold">Next.js dan Tailwind CSS</strong>. Berpengalaman dalam mengembangkan platform HRIS dan omnichannel RMA yang komprehensif, mengawasi seluruh siklus pengembangan mulai dari desain UI (<strong className="text-th-ink font-semibold">Figma</strong>) hingga integrasi database yang kompleks. Saat ini aktif memperluas kapabilitas full-stack di dalam ekosistem <strong className="text-th-ink font-semibold">TypeScript</strong>, dan siap memanfaatkan kemampuan pemecahan masalah saya untuk menghadirkan solusi web yang inovatif sebagai <strong className="text-th-ink font-semibold">Full-Stack Developer</strong>.
      </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ruliansyahdani@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-opacity hover:opacity-85 active:scale-95 duration-200"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Hubungi Saya <ArrowRight size={17} />
          </a>
          <a
            href="https://github.com/daniruliansyah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-th-soft text-th-ink border border-th-border hover:border-[var(--accent)] transition-colors duration-200 active:scale-95"
          >
            <Github size={17} /> GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Subtle divider below hero */}
      <div className="mt-20 w-full max-w-2xl mx-auto h-px bg-th-border" />
    </section>
  );
}
