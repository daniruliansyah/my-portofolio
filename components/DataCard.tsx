"use client"; // Wajib ada karena pakai animasi
import { Data } from "../data/data";
import { motion } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";

interface DataCardProps {
  data: Data;
  index: number; // Kita butuh index untuk mengatur urutan animasi
}

export default function DataCard({ data, index }: DataCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }} // Muncul berurutan (0.1s, 0.2s, dst)
      className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <FolderGit2 size={24} />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
        {data.title}
      </h3>
      
      <p className="text-gray-500 mb-6 text-sm leading-relaxed min-h-[60px]">
        {data.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {data.techStack.map((tech, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
            {tech}
          </span>
        ))}
      </div>

      {data.repoLink && (
        <a 
          href={data.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          Lihat Repository <ExternalLink size={14} />
        </a>
      )}
    </motion.div>
  );
}