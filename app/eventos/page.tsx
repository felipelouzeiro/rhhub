import { EventCalendar } from "@/components/EventCalendar";
import { leadEventos } from "@/lib/copy";
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
      <p className="mb-8 text-[#6B7280]">{leadEventos}</p>
      <EventCalendar events={views} />
    </div>
  );
}
