import { FaExternalLinkAlt } from "react-icons/fa";

type Props = {
  title: string;
  description: string;
  url: string;
};

export function ResourceCard({ title, description, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 max-w-full flex-col rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 flex-1 break-words font-semibold text-[#1F2937] group-hover:text-[#F2994A]">
          {title}
        </span>
        <FaExternalLinkAlt
          className="mt-0.5 shrink-0 text-[#6B7280]"
          aria-hidden
        />
      </span>
      {description ? (
        <p className="mt-2 min-w-0 break-words text-sm text-[#6B7280]">
          {description}
        </p>
      ) : null}
      <span className="mt-3 min-w-0 break-all text-xs leading-relaxed text-[#6B7280]">
        {url}
      </span>
    </a>
  );
}
