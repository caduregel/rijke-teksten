import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/over-de-3v-leesroutine", label: "Over de 3V-routine" },
  { href: "/lessen", label: "Voor scholen" },
  { href: "/inloggen", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Rijke Teksten</p>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
