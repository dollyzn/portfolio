import { cn } from "@/lib/utils";

/**
 * Mockups desenhados em HTML/SVG com a mesma paleta do site.
 * Nada de screenshot falso: são representações abstratas da interface.
 */
export function ProjectMockup({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-full w-full overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#081127_0%,#03060f_60%,#02040a_100%)]",
        className,
      )}
    >
      <div className="bg-tech-grid absolute inset-0 opacity-[0.55]" />
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-electric/12 blur-[64px]" />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <Chrome />
        <div className="mt-3 min-h-0 flex-1">
          {slug === "eventflow" ? <EventFlow /> : null}
          {slug === "nexus-api" ? <NexusApi /> : null}
          {slug === "devboard" ? <DevBoard /> : null}
          {slug === "checkpoint" ? <Checkpoint /> : null}
        </div>
      </div>
    </div>
  );
}

function Chrome() {
  return (
    <div className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-white/12" />
      <span className="size-1.5 rounded-full bg-white/12" />
      <span className="size-1.5 rounded-full bg-electric/50" />
      <div className="ml-2 h-4 flex-1 rounded-full border border-white/[0.06] bg-white/[0.015]" />
    </div>
  );
}

function Bar({ w, tone = "dim" }: { w: string; tone?: "dim" | "mid" | "hot" }) {
  const color =
    tone === "hot"
      ? "bg-cyan-bright/70"
      : tone === "mid"
        ? "bg-electric/45"
        : "bg-white/[0.09]";
  return <span className={cn("block h-1.5 rounded-full", color)} style={{ width: w }} />;
}

function EventFlow() {
  const bars = [42, 68, 34, 88, 56, 74, 96, 62, 80];
  return (
    <div className="grid h-full grid-cols-[26%_1fr] gap-3">
      <div className="space-y-2.5 border-r border-white/[0.05] pr-3">
        {["hot", "dim", "dim", "dim", "dim"].map((t, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-1.5 rounded-sm",
                t === "hot" ? "bg-cyan-bright/80" : "bg-white/10",
              )}
            />
            <Bar w={i === 0 ? "70%" : `${52 + ((i * 13) % 34)}%`} tone={t as "hot" | "dim"} />
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {["1.2k", "318", "97%"].map((v, i) => (
            <div
              key={v}
              className="rounded-md border border-white/[0.06] bg-white/[0.015] p-2"
            >
              <span
                className={cn(
                  "font-mono text-[10px] leading-none",
                  i === 2 ? "text-cyan-bright" : "text-mist",
                )}
              >
                {v}
              </span>
              <div className="mt-1.5">
                <Bar w="60%" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 items-end gap-[5px] rounded-md border border-white/[0.06] bg-white/[0.012] p-2.5">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "w-full rounded-sm",
                i === 6
                  ? "bg-gradient-to-t from-electric/25 to-cyan-bright/80"
                  : "bg-gradient-to-t from-electric/10 to-electric/35",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NexusApi() {
  const rows = [
    { m: "GET", w: "62%", ok: true },
    { m: "POST", w: "48%", ok: true },
    { m: "GET", w: "72%", ok: true },
    { m: "PATCH", w: "40%", ok: false },
    { m: "DEL", w: "54%", ok: true },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded border border-white/[0.05] bg-white/[0.012] px-2 py-[7px]"
        >
          <span
            className={cn(
              "rounded px-1 font-mono text-[8.5px] leading-4 tracking-wide",
              r.m === "GET"
                ? "bg-cyan-bright/12 text-cyan-bright"
                : r.m === "POST"
                  ? "bg-electric/14 text-electric"
                  : "bg-white/[0.05] text-slate-blue",
            )}
          >
            {r.m}
          </span>
          <Bar w={r.w} tone={i === 0 ? "mid" : "dim"} />
          <span className="ml-auto flex items-center gap-1">
            <span
              className={cn(
                "size-1 rounded-full",
                r.ok ? "bg-cyan-bright/80" : "bg-blue-600/70",
              )}
            />
            <span className="font-mono text-[8.5px] text-dim">
              {r.ok ? "200" : "422"}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function DevBoard() {
  const cols = [3, 2, 4];
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {cols.map((n, c) => (
        <div key={c} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 pb-1">
            <span
              className={cn(
                "size-1 rounded-full",
                c === 1 ? "bg-cyan-bright/80" : "bg-white/12",
              )}
            />
            <Bar w="48%" />
          </div>
          {Array.from({ length: n }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "space-y-1.5 rounded-md border p-2",
                c === 1 && i === 0
                  ? "border-electric/25 bg-electric/[0.05]"
                  : "border-white/[0.06] bg-white/[0.014]",
              )}
            >
              <Bar w="82%" tone={c === 1 && i === 0 ? "mid" : "dim"} />
              <Bar w="52%" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Checkpoint() {
  return (
    <div className="grid h-full place-items-center">
      <div className="relative size-[62%] min-h-[86px] min-w-[86px]">
        {[
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "left-0 bottom-0 border-l border-b",
          "right-0 bottom-0 border-r border-b",
        ].map((pos) => (
          <span
            key={pos}
            className={cn("absolute size-5 rounded-[3px] border-cyan-bright/60", pos)}
          />
        ))}
        <div className="absolute inset-[18%] grid grid-cols-4 grid-rows-4 gap-1 opacity-70">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "rounded-[2px]",
                [0, 3, 5, 6, 9, 10, 12, 15].includes(i)
                  ? "bg-electric/45"
                  : "bg-white/[0.06]",
              )}
            />
          ))}
        </div>
        <span className="absolute inset-x-[10%] top-1/2 h-px bg-cyan-bright/60 shadow-[0_0_12px_rgba(114,222,254,0.6)]" />
      </div>
    </div>
  );
}
