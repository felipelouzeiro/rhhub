import {
  errorContentInvalid,
  errorContentUnavailable,
  errorLoadSection,
  errorNetwork,
} from "@/lib/copy";
import { parseSheetDate } from "@/lib/date";
import { cell } from "@/lib/rowHelpers";
import type {
  Comunicado,
  Evento,
  OnboardingKanbanItem,
  Recurso,
} from "@/lib/types";

const OPENSHEET = "https://opensheet.elk.sh";

/** Padrão 60s: em produção (Vercel) o Next cacheia o fetch; 24h fazia a planilha parecer “congelada”. 0 = sem cache. */
function sheetFetchOptions(): { cache: "no-store" } | { next: { revalidate: number } } {
  const raw = process.env.SPREADSHEET_REVALIDATE_SECONDS?.trim();
  if (raw === "0" || raw?.toLowerCase() === "false") {
    return { cache: "no-store" };
  }
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  const seconds = Number.isFinite(n) && n >= 0 ? n : 60;
  return { next: { revalidate: seconds } };
}

function getSpreadsheetId(): string | null {
  const id = process.env.SPREADSHEET_ID?.trim();
  return id || null;
}

export type SheetFetchResult<T> = {
  data: T;
  error: string | null;
};

export async function fetchSheetRows(
  tab: string,
): Promise<SheetFetchResult<Record<string, string>[]>> {
  const id = getSpreadsheetId();
  if (!id) {
    return {
      data: [],
      error: errorContentUnavailable,
    };
  }

  const url = `${OPENSHEET}/${encodeURIComponent(id)}/${encodeURIComponent(tab)}?raw=true`;

  try {
    const res = await fetch(url, sheetFetchOptions());

    if (!res.ok) {
      return {
        data: [],
        error: errorLoadSection(tab),
      };
    }

    const json: unknown = await res.json();
    if (!Array.isArray(json)) {
      return { data: [], error: errorContentInvalid };
    }

    const rows = json.map((row) => {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        const o = row as Record<string, unknown>;
        return Object.fromEntries(
          Object.entries(o).map(([k, v]) => [k, v == null ? "" : String(v)]),
        ) as Record<string, string>;
      }
      return {} as Record<string, string>;
    });

    return { data: rows, error: null };
  } catch {
    return {
      data: [],
      error: errorNetwork,
    };
  }
}

function mapComunicado(row: Record<string, string>): Comunicado {
  const title = cell(row, "title", "titulo", "título");
  const dateRaw = cell(row, "date", "data");
  const sortDate = parseSheetDate(dateRaw);
  return {
    title: title || "Sem título",
    date: dateRaw,
    category: cell(row, "category", "categoria") || "Geral",
    content: cell(row, "content", "conteudo", "conteúdo"),
    sortDate,
  };
}

function mapEvento(row: Record<string, string>): Evento {
  const title = cell(row, "title", "titulo", "título");
  const dateRaw = cell(row, "date", "data");
  return {
    title: title || "Sem título",
    date: dateRaw,
    location: cell(row, "location", "local"),
    description: cell(row, "description", "descricao", "descrição"),
    category: cell(row, "category", "categoria") || "evento",
    sortDate: parseSheetDate(dateRaw),
  };
}

function parseLocked(raw: string): boolean {
  const t = raw.trim().toLowerCase();
  return (
    t === "sim" ||
    t === "s" ||
    t === "true" ||
    t === "1" ||
    t === "yes" ||
    t === "verdadeiro" ||
    t === "bloqueado" ||
    t === "locked"
  );
}

function mapOnboardingKanban(
  row: Record<string, string>,
  index: number,
): OnboardingKanbanItem {
  const task = cell(row, "task", "tarefa", "title", "titulo", "título");
  const idRaw = cell(row, "id", "id_tarefa");
  const id =
    idRaw ||
    `task-${index}-${task.slice(0, 24).replace(/\s+/g, "-").toLowerCase()}`;
  const deadlineRaw = cell(row, "deadline", "prazo", "date", "data");
  return {
    id,
    title: task || `Atividade ${index + 1}`,
    description: cell(row, "description", "descricao", "descrição"),
    category: cell(row, "category", "categoria") || "geral",
    locked: parseLocked(cell(row, "locked", "bloqueado", "immutable")),
    deadline: deadlineRaw,
    sortDeadline: parseSheetDate(deadlineRaw),
  };
}

function mapRecurso(row: Record<string, string>): Recurso {
  return {
    title: cell(row, "title", "titulo", "nome") || "Sem título",
    description: cell(row, "description", "descricao", "descrição"),
    url: cell(row, "url", "link", "href"),
  };
}

export async function getComunicados(): Promise<
  SheetFetchResult<Comunicado[]>
> {
  const { data, error } = await fetchSheetRows("comunicados");
  if (error) return { data: [], error };
  const list = data.map(mapComunicado).filter((c) => c.title || c.content);
  list.sort((a, b) => {
    const ta = a.sortDate?.getTime() ?? 0;
    const tb = b.sortDate?.getTime() ?? 0;
    return tb - ta;
  });
  return { data: list, error: null };
}

export async function getEventos(): Promise<SheetFetchResult<Evento[]>> {
  const { data, error } = await fetchSheetRows("eventos");
  if (error) return { data: [], error };
  const list = data.map(mapEvento).filter((e) => e.title);
  list.sort((a, b) => {
    const ta = a.sortDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const tb = b.sortDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });
  return { data: list, error: null };
}

export async function getOnboardingKanbanItems(): Promise<
  SheetFetchResult<OnboardingKanbanItem[]>
> {
  const { data, error } = await fetchSheetRows("onboarding");
  if (error) return { data: [], error };
  const list = data.map(mapOnboardingKanban).filter((t) => t.title);
  return { data: list, error: null };
}

export async function getRecursos(): Promise<SheetFetchResult<Recurso[]>> {
  const { data, error } = await fetchSheetRows("recursos");
  if (error) return { data: [], error };
  const list = data
    .map(mapRecurso)
    .filter((r) => r.title && r.url)
    .map((r) => ({
      ...r,
      url: r.url.startsWith("http") ? r.url : `https://${r.url}`,
    }));
  return { data: list, error: null };
}

export function comunicadoResumo(c: Comunicado, maxLen = 160): string {
  const s = c.content.trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen).trim()}…`;
}
