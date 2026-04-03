import Link from "next/link";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { formatDatePtBr, parseSheetDate } from "@/lib/date";
import {
  comunicadoResumo,
  getComunicados,
  getEventos,
  getOnboardingKanbanItems,
} from "@/lib/fetchData";
import { proximosEventos } from "@/lib/events";
import { ORG_NAME, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Início",
};

export default async function Home() {
  const [com, ev, onb] = await Promise.all([
    getComunicados(),
    getEventos(),
    getOnboardingKanbanItems(),
  ]);

  const errorParts = [com.error, ev.error, onb.error].filter(
    (x): x is string => Boolean(x),
  );
  const errorMsg = errorParts.length
    ? [...new Set(errorParts)].join(" ")
    : null;

  const recentes = com.data.slice(0, 3);
  const proximos = proximosEventos(ev.data, 3);
  const destaque = onb.data.slice(0, 3);

  return (
    <div className="space-y-12">
      <SheetErrorBanner message={errorMsg} />

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          Bem-vindo ao {SITE_NAME}
        </h1>
        <p className="mt-3 max-w-2xl text-[#6B7280]">
          Aqui você encontra comunicados, eventos e recursos da {ORG_NAME}. O
          conteúdo é atualizado pelo RH na planilha — atualize a página para ver
          as últimas informações.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Próximos eventos
          </h2>
          <Link
            href="/eventos"
            className="text-sm font-medium text-[#F2994A] hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {proximos.length === 0 ? (
          <p className="text-sm text-[#6B7280]">Nenhum evento próximo.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-3">
            {proximos.map((e) => (
              <li
                key={`${e.title}-${e.date}`}
                className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-[#1F2937]">{e.title}</p>
                <p className="mt-2 text-sm text-[#6B7280]">
                  {formatDatePtBr(parseSheetDate(e.date) ?? e.date)}
                </p>
                {e.location ? (
                  <p className="mt-1 text-sm text-[#6B7280]">{e.location}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Comunicados recentes
          </h2>
          <Link
            href="/comunicados"
            className="text-sm font-medium text-[#F2994A] hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {recentes.length === 0 ? (
          <p className="text-sm text-[#6B7280]">Nenhum comunicado ainda.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentes.map((c, i) => (
              <AnnouncementCard
                key={`${c.title}-${i}`}
                item={c}
                resumo={comunicadoResumo(c)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Onboarding em destaque
          </h2>
          <Link
            href="/onboarding"
            className="text-sm font-medium text-[#F2994A] hover:underline"
          >
            Ver quadro
          </Link>
        </div>
        {destaque.length === 0 ? (
          <p className="text-sm text-[#6B7280]">
            Nenhuma atividade de onboarding cadastrada.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-3">
            {destaque.map((a, i) => (
              <li
                key={`${a.id}-${i}`}
                className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-[#1F2937]">{a.title}</p>
                {a.description ? (
                  <p className="mt-2 line-clamp-4 text-sm text-[#6B7280]">
                    {a.description}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-[#6B7280]">
                  Prazo sugerido:{" "}
                  {formatDatePtBr(a.sortDeadline ?? a.deadline)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
