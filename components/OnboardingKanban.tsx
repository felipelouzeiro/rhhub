"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { formatDatePtBr, parseSheetDate } from "@/lib/date";
import {
  type KanbanColumn,
  KANBAN_COLUMNS,
  isKanbanColumn,
} from "@/lib/kanban";
import { emptyOnboarding } from "@/lib/copy";
import type { OnboardingKanbanItem } from "@/lib/types";

const STORAGE_KEY = "onboardingKanbanStatus";
const DROP_PREFIX = "col:";

function loadStatusFromStorage(): Record<string, KanbanColumn> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const o = parsed as Record<string, string>;
    const next: Record<string, KanbanColumn> = {};
    for (const [k, v] of Object.entries(o)) {
      if (isKanbanColumn(v)) next[k] = v;
    }
    return next;
  } catch {
    return {};
  }
}

function dropId(col: KanbanColumn) {
  return `${DROP_PREFIX}${col}`;
}

function parseDropId(s: string): KanbanColumn | null {
  if (!s.startsWith(DROP_PREFIX)) return null;
  const rest = s.slice(DROP_PREFIX.length);
  return isKanbanColumn(rest) ? rest : null;
}

type Props = {
  items: OnboardingKanbanItem[];
};

function deadlineSortKey(it: OnboardingKanbanItem): number {
  const raw = it.sortDeadline;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.getTime();
  }
  if (typeof raw === "string") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  const p = parseSheetDate(it.deadline);
  return p?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function KanbanColumnDrop({
  id,
  title,
  count,
  children,
}: {
  id: KanbanColumn;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dropId(id) });
  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[320px] flex-col rounded-xl border border-[#E5E7EB] bg-[#F7F8FA]/90 p-3 transition-shadow ${
        isOver ? "ring-2 ring-[#F2C94C] ring-offset-2" : ""
      }`}
    >
      <h2 className="mb-3 border-b border-[#E5E7EB] pb-2 text-sm font-semibold text-[#1F2937]">
        {title}
        <span className="ml-2 font-normal text-[#6B7280]">({count})</span>
      </h2>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </section>
  );
}

function KanbanCard({
  item,
  column,
  onMoveSelect,
}: {
  item: OnboardingKanbanItem;
  column: KanbanColumn;
  onMoveSelect: (id: string, col: KanbanColumn) => void;
}) {
  const locked = item.locked;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: locked,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-sm"
    >
      <div className="flex gap-2">
        {!locked ? (
          <button
            type="button"
            className="mt-0.5 cursor-grab touch-none text-[#9CA3AF] active:cursor-grabbing"
            aria-label="Arrastar cartão"
            {...listeners}
            {...attributes}
          >
            <FaGripVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <span
            className="mt-0.5 text-[#D1D5DB]"
            title="Não pode ser movido"
          >
            <FaGripVertical className="h-4 w-4" aria-hidden />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[#1F2937]">{item.title}</p>
          {item.description ? (
            <p className="mt-1 text-sm text-[#6B7280]">{item.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-[#6B7280]">
            Prazo:{" "}
            {formatDatePtBr(
              item.sortDeadline instanceof Date
                ? item.sortDeadline
                : typeof item.sortDeadline === "string"
                  ? item.sortDeadline
                  : parseSheetDate(item.deadline) ?? item.deadline,
            )}
          </p>
          {locked ? (
            <p className="mt-2 text-xs font-medium text-[#6B7280]">
              Definição institucional
            </p>
          ) : null}
          <label className="mt-3 block text-xs text-[#6B7280]">
            <span className="sr-only">Mover para coluna</span>
            <select
              className="mt-1 w-full rounded-md border border-[#E5E7EB] bg-white px-2 py-1.5 text-sm text-[#1F2937] disabled:cursor-not-allowed disabled:bg-[#F7F8FA]"
              value={locked ? "A Fazer" : column}
              disabled={locked}
              onChange={(e) => {
                const v = e.target.value;
                if (isKanbanColumn(v)) onMoveSelect(item.id, v);
              }}
              aria-label={`Mover “${item.title}” de coluna`}
            >
              {KANBAN_COLUMNS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export function OnboardingKanban({ items }: Props) {
  const [statusById, setStatusById] = useState<Record<string, KanbanColumn>>(
    loadStatusFromStorage,
  );

  const validIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  useEffect(() => {
    try {
      const toSave: Record<string, KanbanColumn> = {};
      for (const [k, v] of Object.entries(statusById)) {
        if (validIds.has(k)) toSave[k] = v;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* ignore */
    }
  }, [statusById, validIds]);

  const byId = useMemo(
    () => new Map(items.map((i) => [i.id, i] as const)),
    [items],
  );

  const columnFor = useCallback(
    (item: OnboardingKanbanItem): KanbanColumn => {
      if (item.locked) return "A Fazer";
      const s = statusById[item.id];
      if (s && isKanbanColumn(s)) return s;
      return "A Fazer";
    },
    [statusById],
  );

  const grouped = useMemo(() => {
    const m: Record<KanbanColumn, OnboardingKanbanItem[]> = {
      "A Fazer": [],
      "Em Andamento": [],
      "Concluído": [],
    };
    for (const it of items) {
      m[columnFor(it)].push(it);
    }
    for (const col of KANBAN_COLUMNS) {
      m[col].sort((a, b) => deadlineSortKey(a) - deadlineSortKey(b));
    }
    return m;
  }, [items, columnFor]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeId = String(active.id);
    const item = byId.get(activeId);
    if (!item || item.locked) return;
    const overId = String(over.id);
    let targetCol = parseDropId(overId);
    if (!targetCol) {
      const hit = byId.get(overId);
      if (hit) targetCol = columnFor(hit);
    }
    if (!targetCol) return;
    setStatusById((prev) => ({ ...prev, [activeId]: targetCol }));
  };

  const moveSelect = useCallback(
    (id: string, col: KanbanColumn) => {
      const item = byId.get(id);
      if (!item) return;
      if (item.locked && col !== "A Fazer") return;
      setStatusById((prev) => ({ ...prev, [id]: col }));
    },
    [byId],
  );

  if (items.length === 0) {
    return (
      <p className="text-sm text-[#6B7280]">{emptyOnboarding}</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumnDrop
            key={col}
            id={col}
            title={col}
            count={grouped[col].length}
          >
            {grouped[col].map((it) => (
              <KanbanCard
                key={it.id}
                item={it}
                column={col}
                onMoveSelect={moveSelect}
              />
            ))}
          </KanbanColumnDrop>
        ))}
      </div>
    </DndContext>
  );
}
