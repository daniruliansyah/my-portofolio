// components/DataCard.tsx
import { Data } from "../data/data";

// Kita beri tahu komponen ini bahwa dia akan menerima prop bernama "data"
interface DataCardProps {
  data: Data;
}

export default function DataCard({ data }: DataCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
      {/* Judul Project */}
      <h3 className="text-xl font-bold mb-2 text-gray-800">{data.title}</h3>
      
      {/* Deskripsi */}
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {data.description}
      </p>

      {/* Tech Stack (Looping badge) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.techStack.map((tech, index) => (
          <span 
            key={index} 
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Link Button (Hanya muncul jika repoLink ada) */}
      {data.repoLink && (
        <a 
          href={data.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          Lihat Repository &rarr;
        </a>
      )}
    </div>
  );
}