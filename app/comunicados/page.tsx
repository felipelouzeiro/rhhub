import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Pagination } from "@/components/Pagination";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { emptyComunicados, leadComunicados } from "@/lib/copy";
import { getComunicados } from "@/lib/fetchData";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Comunicados",
};

const PAGE_SIZE = 10;
const BASE_PATH = "/comunicados";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ComunicadosPage({ searchParams }: PageProps) {
  const { data, error } = await getComunicados();
  const sp = await searchParams;
  const raw = sp.page;

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  let currentPage = 1;
  if (raw !== undefined) {
    const n = Number.parseInt(String(raw), 10);
    if (!Number.isFinite(n) || n < 1) {
      redirect(BASE_PATH);
    }
    if (n > totalPages) {
      redirect(totalPages <= 1 ? BASE_PATH : `${BASE_PATH}?page=${totalPages}`);
    }
    currentPage = n;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = data.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <SheetErrorBanner message={error} />
      <h1 className="mb-2 text-2xl font-semibold text-[#1F2937]">
        Comunicados
      </h1>
      <p className="mb-8 text-[#6B7280]">{leadComunicados}</p>
      {data.length === 0 && !error ? (
        <p className="text-sm text-[#6B7280]">{emptyComunicados}</p>
      ) : (
        <>
          <div className="space-y-6">
            {pageItems.map((c, idx) => (
              <AnnouncementCard
                key={`${c.title}-${start + idx}-${c.date}`}
                item={c}
                expanded
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={BASE_PATH}
          />
        </>
      )}
    </div>
  );
}
