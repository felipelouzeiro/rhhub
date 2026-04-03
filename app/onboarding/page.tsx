import { OnboardingKanbanClientShell } from "@/components/OnboardingKanbanClientShell";
import { SheetErrorBanner } from "@/components/SheetErrorBanner";
import { getOnboardingKanbanItems } from "@/lib/fetchData";

export const metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage() {
  const { data, error } = await getOnboardingKanbanItems();

  return (
    <div>
      <SheetErrorBanner message={error} />
      <h1 className="mb-6 text-2xl font-semibold text-[#1F2937]">Onboarding</h1>
      <OnboardingKanbanClientShell items={data} />
    </div>
  );
}
