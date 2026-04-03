import { ResourceCard } from "@/components/ResourceCard";
import { emptyRecursos, leadRecursos } from "@/lib/copy";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { getRecursos } from "@/lib/fetchData";

export const metadata = {
  title: "Recursos",
};

export default async function RecursosPage() {
  const { data, error } = await getRecursos();

  return (
    <div>
      <SheetErrorBanner message={error} />
      <h1 className="mb-2 text-2xl font-semibold text-[#1F2937]">Recursos</h1>
      <p className="mb-8 text-[#6B7280]">{leadRecursos}</p>
      {data.length === 0 && !error ? (
        <p className="text-sm text-[#6B7280]">{emptyRecursos}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((r, i) => (
            <ResourceCard
              key={`${r.title}-${i}`}
              title={r.title}
              description={r.description}
              url={r.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
