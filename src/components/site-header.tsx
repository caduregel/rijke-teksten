import Link from "next/link";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { getCurrentUser } from "@/lib/session";

const links = [
  { href: "/", label: "Home" },
  { href: "/lessen", label: "Alle teksten" },
  { href: "/over-de-3v-leesroutine", label: "Over de 3V-leesroutine" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const navLinks =
    user?.role === "admin" ? [...links, { href: "/beheer", label: "Beheer" }] : links;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}
