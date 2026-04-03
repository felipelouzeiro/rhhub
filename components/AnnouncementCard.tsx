import { formatDatePtBr, parseSheetDate, toDateKeyBr } from "@/lib/date";
import type { Comunicado } from "@/lib/types";

type Props = {
  item: Comunicado;
  /** Se true, mostra conteúdo completo; senão só título + meta. */
  expanded?: boolean;
  resumo?: string;
};

const catClass: Record<string, string> = {
  RH: "bg-amber-100 text-amber-900",
  Eventos: "bg-orange-100 text-orange-900",
  Políticas: "bg-slate-100 text-slate-800",
  Política: "bg-slate-100 text-slate-800",
  Avisos: "bg-red-50 text-red-900",
  Aviso: "bg-red-50 text-red-900",
};

export function AnnouncementCard({ item, expanded, resumo }: Props) {
  const badge =
    catClass[item.category] ?? "bg-[#F7F8FA] text-[#1F2937]";

  const when =
    item.sortDate instanceof Date && !Number.isNaN(item.sortDate.getTime())
      ? item.sortDate
      : parseSheetDate(item.date);

  return (
    <article className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
        >
          {item.category}
        </span>
        <time
          className="text-sm text-[#6B7280]"
          dateTime={when ? toDateKeyBr(when) : undefined}
        >
          {when ? formatDatePtBr(when) : "—"}
        </time>
      </div>
      <h2 className="text-lg font-semibold text-[#1F2937]">{item.title}</h2>
      {resumo != null && resumo !== "" && !expanded ? (
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{resumo}</p>
      ) : null}
      {expanded ? (
        <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1F2937]">
          {item.content || "—"}
        </div>
      ) : null}
    </article>
  );
}
