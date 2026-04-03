import { ORG_NAME, SUPPORT_MESSAGE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-white py-8 text-sm text-[#6B7280]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {ORG_NAME}
        </p>
        <p>Portal interno RH</p>
        <p className="max-w-md text-right sm:text-right">{SUPPORT_MESSAGE}</p>
      </div>
    </footer>
  );
}
