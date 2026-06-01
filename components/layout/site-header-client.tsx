"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export function SiteHeaderClient({ name, githubUrl }: { name: string; githubUrl: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`nav-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="container nav-inner">
        <Link
          href="/"
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--foreground)",
            letterSpacing: "-0.01em",
            textDecoration: "none",
          }}
        >
          {name}
        </Link>

        <div className="desktop-nav">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                {link.label}
              </Link>
            );
          })}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ marginLeft: 8 }}>
            GitHub ↗
          </a>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            padding: "6px 8px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            backgroundColor: "transparent",
            cursor: "pointer",
            color: "var(--foreground-secondary)",
            fontSize: 13,
          }}
          type="button"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px 16px",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              padding: "8px 0",
              fontSize: 14,
              color: pathname.startsWith(link.href) ? "var(--accent-blue)" : "var(--foreground-secondary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
