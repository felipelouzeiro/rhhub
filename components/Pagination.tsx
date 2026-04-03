import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  /** Rota sem query, ex.: /comunicados */
  basePath: string;
};

function hrefForPage(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const linkClass =
    "rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 font-medium text-[#1F2937] shadow-sm transition-colors hover:border-[#F2C94C] hover:bg-[#F2C94C]/15";

  const disabledClass = "cursor-default rounded-lg border border-transparent px-4 py-2 text-[#9CA3AF]";

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      aria-label="Paginação"
    >
      {currentPage > 1 ? (
        <Link href={hrefForPage(basePath, currentPage - 1)} className={linkClass}>
          Anterior
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Anterior
        </span>
      )}

      <span className="min-w-[8rem] text-center text-sm tabular-nums text-[#6B7280]">
        Página {currentPage} de {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={hrefForPage(basePath, currentPage + 1)} className={linkClass}>
          Próxima
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Próxima
        </span>
      )}
    </nav>
  );
}
