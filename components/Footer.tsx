import { footerSupport, footerTagline } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-white py-8 text-sm text-[#6B7280]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>{footerTagline}</p>
        <p className="max-w-md text-right sm:text-right">{footerSupport}</p>
      </div>
    </footer>
  );
}
