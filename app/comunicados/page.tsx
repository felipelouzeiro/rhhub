import { AnnouncementCard } from "@/components/AnnouncementCard";
import {
  emptyComunicadosPage,
  leadComunicados,
} from "@/lib/copy";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { getComunicados } from "@/lib/fetchData";

export const metadata = {
  title: "Comunicados",
};

export default async function ComunicadosPage() {
  const { data, error } = await getComunicados();

  return (
    <div>
      <SheetErrorBanner message={error} />
      <h1 className="mb-2 text-2xl font-semibold text-[#1F2937]">
        Comunicados
      </h1>
      <p className="mb-8 text-[#6B7280]">{leadComunicados}</p>
      {data.length === 0 && !error ? (
        <p className="text-sm text-[#6B7280]">{emptyComunicadosPage}</p>
      ) : (
        <div className="space-y-6">
          {data.map((c, i) => (
            <AnnouncementCard key={`${c.title}-${i}`} item={c} expanded />
          ))}
        </div>
      )}
    </div>
  );
}
