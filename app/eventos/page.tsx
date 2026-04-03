import { EventCalendar } from "@/components/EventCalendar";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { toEventoCalView } from "@/lib/eventView";
import { getEventos } from "@/lib/fetchData";

export const metadata = {
  title: "Eventos",
};

export default async function EventosPage() {
  const { data, error } = await getEventos();
  const views = data.map(toEventoCalView);

  return (
    <div>
      <SheetErrorBanner message={error} />
      <h1 className="mb-2 text-2xl font-semibold text-[#1F2937]">Eventos</h1>
      <p className="mb-8 text-[#6B7280]">
        Calendário institucional: treinamentos, confraternizações e campanhas.
        Toque em um dia com marcação ou em um item da lista para ver detalhes.
      </p>
      <EventCalendar events={views} />
    </div>
  );
}
