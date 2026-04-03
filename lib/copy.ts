import { ORG_NAME } from "@/lib/site";

export function homeLead(): string {
  return `Comunicados, agenda de eventos e links úteis da ${ORG_NAME} em um só lugar.`;
}

export const leadComunicados =
  "Avisos e informações oficiais para a equipe.";

export const leadEventos =
  "Treinamentos, encontros e campanhas internas.";

export const leadRecursos =
  "Ferramentas e páginas úteis do dia a dia.";

export function leadEmpresa(): string {
  return `Cultura e valores da ${ORG_NAME}.`;
}

export const emptyEventosProximos = "Nenhum evento futuro no momento.";
export const emptyComunicados = "Nenhum comunicado no momento.";
export const emptyOnboarding = "Nenhuma atividade no momento.";
export const emptyRecursos = "Nenhum recurso no momento.";
export const emptyEventosCalendar = "Nenhum evento no momento.";

const loadFailed: Record<string, string> = {
  comunicados: "Não foi possível carregar os comunicados.",
  eventos: "Não foi possível carregar os eventos.",
  onboarding: "Não foi possível carregar o onboarding.",
  recursos: "Não foi possível carregar os recursos.",
};

export function errorLoadSection(tab: string): string {
  return (
    loadFailed[tab] ??
    "Não foi possível carregar esta seção. Tente novamente em instantes."
  );
}

export const errorContentUnavailable =
  "Conteúdo indisponível no momento. Tente novamente em instantes ou fale com o RH.";

export const errorContentInvalid =
  "Não foi possível exibir esta seção. Tente novamente mais tarde.";

export const errorNetwork =
  "Não foi possível conectar. Verifique sua internet e tente de novo.";

export const footerTagline = "Portal do colaborador";

export const footerSupport =
  "Dúvidas? Procure o Recursos Humanos.";
