export function SheetErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="mb-6 rounded-md border border-[#EB5757]/30 bg-[#EB5757]/10 px-4 py-3 text-sm text-[#1F2937]"
      role="alert"
    >
      {message}
    </div>
  );
}
