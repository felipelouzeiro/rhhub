"use client";

import dynamic from "next/dynamic";
import type { OnboardingKanbanItem } from "@/lib/types";

const OnboardingKanban = dynamic(
  () =>
    import("@/components/OnboardingKanban").then((m) => ({
      default: m.OnboardingKanban,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid gap-4 md:grid-cols-3"
        aria-busy="true"
        aria-label="Carregando quadro"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl bg-[#E5E7EB]/60"
          />
        ))}
      </div>
    ),
  },
);

type Props = {
  items: OnboardingKanbanItem[];
};

export function OnboardingKanbanClientShell({ items }: Props) {
  return <OnboardingKanban items={items} />;
}
