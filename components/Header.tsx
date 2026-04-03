import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/comunicados", label: "Comunicados" },
  { href: "/eventos", label: "Eventos" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/empresa", label: "Empresa" },
  { href: "/recursos", label: "Recursos" },
];

export function Header() {
  return (
    <header className="border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-[#1F2937] no-underline"
        >
          <Image
            src="/invent_software_logo.png"
            alt="Invent Software"
            width={200}
            height={56}
            className="h-14 w-auto max-w-[min(100%,220px)] object-contain sm:h-16"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-[#6B7280]"
          aria-label="Principal"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-1 text-[#1F2937] transition-colors hover:text-[#F2994A]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
