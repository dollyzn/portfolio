"use client";

import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { GithubIcon } from "@/components/ui/icons";

export function RepoPreview({
  href,
  label,
  name,
}: {
  href: string;
  label: string;
  name: string;
}) {
  const host = href.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <Tooltip delay={180}>
      <TooltipTrigger
        render={
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={name}
            className="group/link inline-flex items-center gap-2 text-[13.5px] text-mist transition-colors duration-300 hover:text-paper"
          />
        }
      >
        <GithubIcon className="size-[15px] opacity-70 transition-opacity group-hover/link:opacity-100" />
        <span className="relative">
          {label}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-electric transition-transform duration-400 ease-out-expo group-hover/link:scale-x-100"
          />
        </span>
      </TooltipTrigger>
      <TooltipPanel
        side="top"
        sideOffset={10}
        className="max-w-none px-3 py-2.5"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary-foreground/15">
            <GithubIcon className="size-3.5" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-[12.5px] font-medium">{name}</span>
            <span className="block font-mono text-[10px] opacity-70">
              {host}
            </span>
          </span>
        </span>
      </TooltipPanel>
    </Tooltip>
  );
}
