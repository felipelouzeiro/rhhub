import { footerSupport, footerTagline } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-white py-8 text-sm text-[#6B7280]">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <p className="min-w-0 break-words">{footerTagline}</p>
        <p className="min-w-0 break-words sm:max-w-md sm:text-right">
          {footerSupport}
        </p>
      </div>
    </footer>
  );
}
