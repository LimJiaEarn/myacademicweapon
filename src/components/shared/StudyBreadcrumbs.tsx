"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Loader2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StudyResourceNavItems } from "../../../constants";

const LEVELS = [
  { value: "secondary", label: "Secondary" },
  { value: "jc", label: "JC" },
];

// Long form is kept so old worksheet links + the page's `split(' ')[0]` parse stay valid.
const TYPES = [
  { value: "Notes", label: "Notes" },
  { value: "Topical Practice Papers", label: "Topical Papers" },
  { value: "Yearly Practice Papers", label: "Yearly Papers" },
];

function levelLabel(level: string): string {
  return LEVELS.find((l) => l.value === level)?.label ?? "Level";
}

function buildHref(
  targetLevel: string,
  params: { subject?: string; resourceType?: string }
): string {
  const sp = new URLSearchParams();
  if (params.subject) sp.set("subject", params.subject);
  if (params.resourceType) sp.set("resourceType", params.resourceType);
  const qs = sp.toString();
  return `/study-resources/${targetLevel}${qs ? `?${qs}` : ""}`;
}

interface CrumbOption {
  label: string;
  href: string;
  active: boolean;
}

function CrumbDropdown({
  eyebrow,
  label,
  isPlaceholder,
  loading,
  options,
  onSelect,
}: {
  eyebrow: string;
  label: string;
  isPlaceholder?: boolean;
  loading?: boolean;
  options: CrumbOption[];
  onSelect: (opt: CrumbOption) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 min-h-[46px] px-3.5 py-2 bg-white border border-hairline rounded-xl text-ink shadow-sm hover:border-pri_mint_main hover:bg-pri_mint_main/5 transition ease-in-out duration-150"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-pri_mint_darker/90 mb-0.5">
              {eyebrow}
            </span>
            <span
              className={`text-[15px] md:text-lg leading-tight text-left ${
                isPlaceholder ? "font-normal italic text-pri_navy_light" : "font-bold text-ink"
              }`}
            >
              {label}
            </span>
          </span>
          {loading ? (
            <Loader2 className="h-4 w-4 text-pri_mint_main shrink-0 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 text-pri_mint_main shrink-0" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-1.5 rounded-xl border-hairline shadow-card">
        <div className="flex flex-col">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              onClick={(e) => {
                // Let the browser handle open-in-new-tab / middle-click natively.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                setOpen(false);
                onSelect(opt);
              }}
              className={`flex items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-pri_mint_main/5 transition-colors ${
                opt.active ? "bg-pri_mint_main/10" : ""
              }`}
            >
              <span>{opt.label}</span>
              {opt.active && <Check className="h-4 w-4 text-pri_mint_main" />}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface StudyBreadcrumbsProps {
  level: string; // route param: "secondary" | "jc"
  subject?: string;
  resourceType?: string; // raw, e.g. "Yearly Practice Papers"
}

type CrumbState = {
  level: string;
  subject?: string;
  resourceType?: string;
};

type CrumbSlot = "level" | "subject" | "type";

export default function StudyBreadcrumbs({
  level,
  subject,
  resourceType,
}: StudyBreadcrumbsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingSlot, setPendingSlot] = useState<CrumbSlot | null>(null);

  // Mirror the server-driven selection so a click updates the labels instantly.
  // useOptimistic auto-reverts to the real props once the navigation commits.
  const [optimistic, setOptimistic] = useOptimistic<CrumbState, Partial<CrumbState>>(
    { level, subject, resourceType },
    (prev, next) => ({ ...prev, ...next })
  );

  const select = (slot: CrumbSlot, next: Partial<CrumbState>, href: string) => {
    setPendingSlot(slot);
    startTransition(() => {
      setOptimistic(next);
      router.push(href);
    });
  };

  const subjects = StudyResourceNavItems[optimistic.level] || [];
  const currentTypeShort = optimistic.resourceType?.split(" ")[0];
  const currentType = TYPES.find((t) => t.value.split(" ")[0] === currentTypeShort);

  const levelOptions: CrumbOption[] = LEVELS.map((l) => ({
    label: l.label,
    // Subject is dropped when switching level (subject sets differ per level).
    href: buildHref(l.value, { resourceType: optimistic.resourceType }),
    active: l.value === optimistic.level,
  }));

  const subjectOptions: CrumbOption[] = subjects.map((s) => ({
    label: s.title,
    href: buildHref(optimistic.level, { subject: s.title, resourceType: optimistic.resourceType }),
    active: s.title === optimistic.subject,
  }));

  const typeOptions: CrumbOption[] = TYPES.map((t) => ({
    label: t.label,
    href: buildHref(optimistic.level, { subject: optimistic.subject, resourceType: t.value }),
    active: t.value.split(" ")[0] === currentTypeShort,
  }));

  const Separator = () => (
    <span className="text-pri_mint_main text-xl font-bold px-0.5 select-none" aria-hidden>
      ›
    </span>
  );

  return (
    <nav
      aria-label="Study resource navigation"
      aria-busy={isPending}
      className="flex flex-wrap items-center gap-1.5 px-2 md:px-4 py-2"
    >
      <CrumbDropdown
        eyebrow="Level"
        label={levelLabel(optimistic.level)}
        loading={isPending && pendingSlot === "level"}
        options={levelOptions}
        onSelect={(opt) => {
          const target = LEVELS.find((l) => l.label === opt.label)?.value ?? optimistic.level;
          select("level", { level: target, subject: undefined }, opt.href);
        }}
      />
      <Separator />
      <CrumbDropdown
        eyebrow="Subject"
        label={optimistic.subject || "Select subject"}
        isPlaceholder={!optimistic.subject}
        loading={isPending && pendingSlot === "subject"}
        options={subjectOptions}
        onSelect={(opt) => select("subject", { subject: opt.label }, opt.href)}
      />
      <Separator />
      <CrumbDropdown
        eyebrow="Papers"
        label={currentType?.label || "Select papers"}
        isPlaceholder={!currentType}
        loading={isPending && pendingSlot === "type"}
        options={typeOptions}
        onSelect={(opt) => {
          const target = TYPES.find((t) => t.label === opt.label)?.value;
          select("type", { resourceType: target }, opt.href);
        }}
      />
    </nav>
  );
}
