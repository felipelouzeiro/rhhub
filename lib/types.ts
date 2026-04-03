export type Comunicado = {
  title: string;
  date: string;
  category: string;
  content: string;
  sortDate: Date | null;
};

export type Evento = {
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  sortDate: Date | null;
};

/** Linha da aba onboarding — quadro Kanban pessoal (status no navegador). */
export type OnboardingKanbanItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  locked: boolean;
  deadline: string;
  sortDeadline: Date | null;
};

export type Recurso = {
  title: string;
  description: string;
  url: string;
};
