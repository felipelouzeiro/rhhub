import { toDateKeyBr } from "@/lib/date";
import type { Evento } from "@/lib/types";

/** Props serializáveis para o calendário no cliente. */
export type EventoCalView = {
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  dateKey: string | null;
};

export function toEventoCalView(e: Evento): EventoCalView {
  return {
    title: e.title,
    date: e.date,
    location: e.location,
    description: e.description,
    category: e.category,
    dateKey: e.sortDate ? toDateKeyBr(e.sortDate) : null,
  };
}
