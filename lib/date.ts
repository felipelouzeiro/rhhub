const PT_BR = "pt-BR";
const TZ_BR = "America/Sao_Paulo";

/**
 * Dias “serial” do Excel / Google Sheets → UTC (meia-noite UTC do dia civil).
 * 25569 = diferença em dias entre 30/12/1899 (base Sheets/Excel) e 01/01/1970.
 */
function parseSpreadsheetSerialDays(s: string): Date | null {
  const t = s.trim();
  if (!/^\d+(\.\d+)?$/.test(t)) {
    return null;
  }
  const n = parseFloat(t);
  if (!Number.isFinite(n)) {
    return null;
  }
  /** Faixa típica de datas ~1950–2100 em serial; evita confundir com outros números. */
  const whole = Math.floor(n);
  if (whole < 18000 || whole > 55000) {
    return null;
  }
  const utcDays = Math.floor(n - 25569);
  /** Meio-dia UTC evita cair no dia anterior em fusos como America/Sao_Paulo. */
  const ms = utcDays * 86400 * 1000 + 12 * 3600 * 1000;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Interpreta datas vindas da planilha:
 * - ISO AAAA-MM-DD
 * - DD/MM/AAAA (Brasil)
 * - Número serial (com ?raw=true no opensheet)
 * Não usa `new Date(string)` genérico (ex.: "46124" virava ano 46124).
 */
export function parseSheetDate(raw: string | null | undefined): Date | null {
  if (raw == null || String(raw).trim() === "") {
    return null;
  }
  const s = String(raw).trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (iso) {
    const d = new Date(
      `${iso[1]}-${iso[2]}-${iso[3]}T12:00:00`,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const br = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
  if (br) {
    const dd = br[1].padStart(2, "0");
    const mm = br[2].padStart(2, "0");
    const yyyy = br[3];
    const d = new Date(`${yyyy}-${mm}-${dd}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const serial = parseSpreadsheetSerialDays(s);
  if (serial) {
    return serial;
  }

  return null;
}

/** Chave AAAA-MM-DD no fuso de São Paulo (para calendário e agrupamento). */
export function toDateKeyBr(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_BR,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !day) {
    return "";
  }
  return `${y}-${m}-${day}`;
}

export function startOfTodayBr(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_BR,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  return new Date(`${y}-${m}-${d}T00:00:00`);
}

/** Formata data para exibição (calendário gregoriano, Brasil). */
export function formatDatePtBr(
  input: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
): string {
  if (input === null || input === undefined || input === "") {
    return "—";
  }
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      return "—";
    }
    return input.toLocaleDateString(PT_BR, { timeZone: TZ_BR, ...options });
  }
  if (typeof input === "string") {
    const parsed = parseSheetDate(input);
    if (!parsed) {
      return "—";
    }
    return parsed.toLocaleDateString(PT_BR, { timeZone: TZ_BR, ...options });
  }
  if (typeof input === "number") {
    const parsed = parseSheetDate(String(input));
    if (parsed) {
      return parsed.toLocaleDateString(PT_BR, { timeZone: TZ_BR, ...options });
    }
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) {
      return "—";
    }
    return d.toLocaleDateString(PT_BR, { timeZone: TZ_BR, ...options });
  }
  return "—";
}
