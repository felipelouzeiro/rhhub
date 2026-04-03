import { redirect } from "next/navigation";

/** Atividades de onboarding foram unificadas em /onboarding. */
export default function AtividadesRedirectPage() {
  redirect("/onboarding");
}
