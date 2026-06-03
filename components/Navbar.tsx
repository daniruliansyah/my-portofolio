import Link from "next/link";
import { Github, Linkedin, Code2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[var(--nav-bg)] backdrop-blur-md border-b border-th-border z-50 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-th-ink">
          <div className="bg-th-accent text-white p-1 rounded-lg">
            <Code2 size={20} />
          </div>
          <span>Dani Ruliansyah</span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Nav links — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-5">
            <Link href="#experience" className="text-th-muted hover:text-th-accent transition-colors text-sm font-medium">
              Experience
            </Link>
            <Link href="#projects" className="text-th-muted hover:text-th-accent transition-colors text-sm font-medium">
              Projects
            </Link>
            <Link href="#skills" className="text-th-muted hover:text-th-accent transition-colors text-sm font-medium">
              Skills
            </Link>
            <Link href="#certificates" className="text-th-muted hover:text-th-accent transition-colors text-sm font-medium">
              Certificates
            </Link>
          </div>

          {/* Social + Theme toggle */}
          <div className="flex items-center gap-3 border-l border-th-border pl-4 sm:pl-5">
            <a
              href="https://github.com/daniruliansyah"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-th-muted hover:text-th-ink transition-colors"
            >
              <Github size={19} />
            </a>
            <a
              href="https://linkedin.com/in/dani-ruliansyah-1039b43aa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-th-muted hover:text-th-accent transition-colors"
            >
              <Linkedin size={19} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
