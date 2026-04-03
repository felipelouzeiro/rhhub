import { startOfTodayBr } from "@/lib/date";
import type { Evento } from "@/lib/types";

/** Próximos eventos: apenas datas a partir de hoje (fuso BR), ordenados. */
export function proximosEventos(eventos: Evento[], limit: number): Evento[] {
  const start = startOfTodayBr().getTime();
  return eventos
    .filter((e) => e.sortDate && e.sortDate.getTime() >= start)
    .slice(0, limit);
}
