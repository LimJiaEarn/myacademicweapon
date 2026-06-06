"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";

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
  options,
}: {
  eyebrow: string;
  label: string;
  isPlaceholder?: boolean;
  options: CrumbOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 bg-white border border-pri_bg_card2 rounded-xl font-bold text-pri_navy_main hover:border-pri_mint_main hover:bg-pri_bg_card transition ease-in-out duration-150"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold tracking-wider uppercase text-pri_mint_darker/90 mb-0.5">
              {eyebrow}
            </span>
            <span
              className={`text-[15px] md:text-lg leading-tight text-left ${
                isPlaceholder ? "font-normal italic text-pri_navy_light" : "font-bold"
              }`}
            >
              {label}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-pri_mint_main shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-1.5">
        <div className="flex flex-col">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-pri_navy_dark hover:bg-pri_bg_card transition-colors ${
                opt.active ? "bg-pri_bg_card" : ""
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

export default function StudyBreadcrumbs({
  level,
  subject,
  resourceType,
}: StudyBreadcrumbsProps) {
  const subjects = StudyResourceNavItems[level] || [];
  const currentTypeShort = resourceType?.split(" ")[0];
  const currentType = TYPES.find((t) => t.value.split(" ")[0] === currentTypeShort);

  const levelOptions: CrumbOption[] = LEVELS.map((l) => ({
    label: l.label,
    // Subject is dropped when switching level (subject sets differ per level).
    href: buildHref(l.value, { resourceType }),
    active: l.value === level,
  }));

  const subjectOptions: CrumbOption[] = subjects.map((s) => ({
    label: s.title,
    href: buildHref(level, { subject: s.title, resourceType }),
    active: s.title === subject,
  }));

  const typeOptions: CrumbOption[] = TYPES.map((t) => ({
    label: t.label,
    href: buildHref(level, { subject, resourceType: t.value }),
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
      className="flex flex-wrap items-center gap-1.5 px-2 md:px-4 py-2"
    >
      <CrumbDropdown eyebrow="Level" label={levelLabel(level)} options={levelOptions} />
      <Separator />
      <CrumbDropdown
        eyebrow="Subject"
        label={subject || "Select subject"}
        isPlaceholder={!subject}
        options={subjectOptions}
      />
      <Separator />
      <CrumbDropdown
        eyebrow="Papers"
        label={currentType?.label || "Select papers"}
        isPlaceholder={!currentType}
        options={typeOptions}
      />
    </nav>
  );
}
