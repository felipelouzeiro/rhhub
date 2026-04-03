export type KanbanColumn = "A Fazer" | "Em Andamento" | "Concluído";

export const KANBAN_COLUMNS: KanbanColumn[] = [
  "A Fazer",
  "Em Andamento",
  "Concluído",
];

export function isKanbanColumn(s: string): s is KanbanColumn {
  return (KANBAN_COLUMNS as string[]).includes(s);
}
