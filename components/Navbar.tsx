import Link from 'next/link';
import { Github, Linkedin, Code2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <div className="bg-blue-600 text-white p-1 rounded-lg">
            <Code2 size={20} />
          </div>
          <span>Dani Ruliansyah</span>
        </div>

        {/* Menu Kanan */}
        <div className="flex items-center gap-6">
          <Link href="#projects" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium hidden sm:block">
            Projects
          </Link>
          
          {/* Social Icons */}
          <div className="flex gap-4 border-l pl-6 border-gray-200">
            <a href="https://github.com/daniruliansyah" target="_blank" className="text-gray-500 hover:text-gray-900 transition">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/dani-ruliansyah-1039b43aa/" target="_blank" className="text-gray-500 hover:text-blue-700 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}