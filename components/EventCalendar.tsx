"use client";

import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { formatDatePtBr, parseSheetDate } from "@/lib/date";
import type { EventoCalView } from "@/lib/eventView";

type Props = {
  events: EventoCalView[];
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function EventCalendar({ events }: Props) {
  const [cursor, setCursor] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [modal, setModal] = useState<EventoCalView | null>(null);

  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modal]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byDay = useMemo(() => {
    const map = new Map<string, EventoCalView[]>();
    for (const e of events) {
      if (!e.dateKey) continue;
      const list = map.get(e.dateKey) ?? [];
      list.push(e);
      map.set(e.dateKey, list);
    }
    return map;
  }, [events]);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: { key: string | null; label: number | null }[] = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push({ key: null, label: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${pad(month + 1)}-${pad(d)}`;
    cells.push({ key, label: d });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ key: null, label: null });
  }

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#1F2937] shadow-sm hover:bg-[#F7F8FA]"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Mês anterior"
        >
          <FaChevronLeft aria-hidden />
        </button>
        <h2 className="text-lg font-semibold capitalize text-[#1F2937]">
          {monthLabel}
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#1F2937] shadow-sm hover:bg-[#F7F8FA]"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Próximo mês"
        >
          <FaChevronRight aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#6B7280]">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (c.label == null || c.key == null) {
            return <div key={`e-${i}`} className="min-h-[3rem]" />;
          }
          const dayEvents = byDay.get(c.key) ?? [];
          const has = dayEvents.length > 0;
          return (
            <button
              key={c.key}
              type="button"
              className={`flex min-h-[3rem] flex-col items-center justify-start rounded-md border p-1 text-sm transition-colors ${
                has
                  ? "border-[#F2C94C] bg-[#F2C94C]/20 font-semibold text-[#1F2937] hover:bg-[#F2C94C]/35"
                  : "border-transparent bg-white text-[#6B7280] hover:bg-[#F7F8FA]"
              }`}
              onClick={() => {
                if (has && dayEvents[0]) {
                  setModal(dayEvents[0]);
                }
              }}
              disabled={!has}
              aria-label={
                has
                  ? `${c.label}, ${dayEvents.length} evento(s)`
                  : `${c.label}, sem eventos`
              }
            >
              <span>{c.label}</span>
              {has ? (
                <span className="mt-0.5 text-[10px] text-[#6B7280]">
                  {dayEvents.length} evt.
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-[#1F2937]">
          Lista de eventos
        </h3>
        <ul className="space-y-2">
          {events.length === 0 ? (
            <li className="text-sm text-[#6B7280]">Nenhum evento cadastrado.</li>
          ) : (
            events.map((e, idx) => (
              <li key={`${e.title}-${e.dateKey}-${idx}`}>
                <button
                  type="button"
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-left text-sm shadow-sm transition-shadow hover:shadow-md"
                  onClick={() => setModal(e)}
                >
                  <span className="font-medium text-[#1F2937]">{e.title}</span>
                  <span className="mt-1 block text-[#6B7280]">
                    {formatDatePtBr(parseSheetDate(e.date) ?? e.date)}
                    {e.location ? ` · ${e.location}` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evt-modal-title"
          onClick={() => setModal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="evt-modal-title"
              className="text-lg font-semibold text-[#1F2937]"
            >
              {modal.title}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-[#6B7280]">Data</dt>
                <dd className="text-[#1F2937]">
                  {formatDatePtBr(parseSheetDate(modal.date) ?? modal.date)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[#6B7280]">Local</dt>
                <dd className="text-[#1F2937]">{modal.location || "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#6B7280]">Categoria</dt>
                <dd className="text-[#1F2937]">{modal.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#6B7280]">Descrição</dt>
                <dd className="whitespace-pre-wrap text-[#1F2937]">
                  {modal.description || "—"}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-[#F2C94C] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#e6b93f]"
              onClick={() => setModal(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
