"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from "motion/react";
import {
  Check,
  Cpu,
  Download,
  Lock,
  Pause,
  Play,
  ScanLine,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const STEPS = ["upload", "read", "fill", "download"] as const;
const LAST = STEPS.length - 1;
const STEP_MS = 3400;
const EASE = [0.16, 1, 0.3, 1] as const;

/* Palco desenhado num canvas fixo e escalado para caber na coluna.
   Abaixo de STACK_BELOW px tudo vira uma pilha vertical. */
const STACK_BELOW = 420;
const MAX_SCALE = 1.12;
const SLIP_SIZE = { width: 164, height: 250 };
const SHEET_SIZE = { width: 250, height: 354 };

type Box = { left: number; top: number; width: number; height: number };
type Point = [x: number, y: number];
type Layout = {
  w: number;
  h: number;
  stacked: boolean;
  slip: Box;
  node: { cx: number; cy: number; size: number };
  chips: Box;
  sheet: Box;
  pillTop: number;
  /** Feixes: deslocamentos (no canvas) a partir do centro de cada ponta. */
  beamIn: { from: Point; to: Point };
  beamOut: { source: "node" | "chips"; from: Point; to: Point };
};

const dropzoneOf = (slip: Box): Box => ({
  left: slip.left - 12,
  top: slip.top - 26,
  width: slip.width + 24,
  height: slip.height + 68,
});

const WIDE: Layout = {
  w: 640,
  h: 480,
  stacked: false,
  // centro da dropzone, do nó e do recibo na mesma linha (y = 229)
  slip: { left: 24, top: 96, ...SLIP_SIZE },
  node: { cx: 270, cy: 229, size: 60 },
  chips: { left: 210, top: 295, width: 120, height: 91 },
  sheet: { left: 368, top: 52, ...SHEET_SIZE },
  pillTop: 420,
  beamIn: { from: [96, 0], to: [-34, 0] },
  beamOut: { source: "node", from: [34, 0], to: [-127, 0] },
};

const STACK: Layout = {
  w: 360,
  h: 976,
  stacked: true,
  slip: { left: 98, top: 70, ...SLIP_SIZE },
  node: { cx: 180, cy: 430, size: 60 },
  chips: { left: 20, top: 476, width: 320, height: 44 },
  sheet: { left: 55, top: 556, ...SHEET_SIZE },
  pillTop: 924,
  beamIn: { from: [0, 161], to: [0, -34] },
  beamOut: { source: "chips", from: [0, 26], to: [0, -179] },
};

type T = ReturnType<typeof useTranslations<"projects.recibo.stage">>;

function useFit(ref: RefObject<HTMLElement | null>) {
  const [fit, setFit] = useState<{ scale: number; L: Layout } | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const L = width < STACK_BELOW ? STACK : WIDE;
      setFit({ scale: Math.min(width / L.w, MAX_SCALE), L });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return fit;
}

export function ReciboStage({ className }: { className?: string }) {
  const t = useTranslations("projects.recibo.stage");
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const fit = useFit(outerRef);
  const L = fit?.L ?? WIDE;
  const inView = useInView(outerRef, { amount: 0.3 });

  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const stepRef = useRef(0);
  const progress = useMotionValue(0);

  // Sem animação, abre direto no recibo pronto; as abas continuam navegáveis.
  const s = reduced && !touched ? LAST : step;
  const running = !reduced && inView && !paused;

  const goTo = (next: number) => {
    stepRef.current = next;
    progress.set(0);
    if (next === 0) setCycle((c) => c + 1);
    setStep(next);
  };

  useAnimationFrame((_, delta) => {
    if (!running) return;
    const next = progress.get() + delta / STEP_MS;
    if (next < 1) {
      progress.set(next);
      return;
    }
    goTo((stepRef.current + 1) % STEPS.length);
  });

  const k = fit?.scale ?? 1;
  const beamColors = {
    pathColor: "var(--electric)",
    pathOpacity: 0.16,
    pathWidth: 1.5,
    gradientStartColor: "var(--electric)",
    gradientStopColor: "var(--cyan-bright)",
  };
  const idle = {
    ...beamColors,
    gradientStartColor: "transparent",
    gradientStopColor: "transparent",
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div ref={outerRef} className="w-full">
        <div
          ref={wrapRef}
          role="img"
          aria-label={t("label")}
          className="relative mx-auto w-full"
          style={{ aspectRatio: `${L.w} / ${L.h}`, maxWidth: L.w * MAX_SCALE }}
        >
          <div
            aria-hidden
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: L.w,
              height: L.h,
              transform: `scale(${k})`,
              visibility: fit ? "visible" : "hidden",
            }}
          >
            <Chrome L={L} t={t} />
            <Dropzone ref={dropRef} L={L} active={s === 0} t={t} />
            <Slip L={L} step={s} cycle={cycle} t={t} reduced={reduced} />
            <BrowserNode ref={nodeRef} L={L} step={s} t={t} reduced={reduced} />
            <Chips ref={chipsRef} L={L} step={s} t={t} />
            <Sheet ref={sheetRef} L={L} step={s} cycle={cycle} t={t} />
            <DownloadPill L={L} step={s} cycle={cycle} t={t} />
          </div>

          {fit ? (
            <>
              <AnimatedBeam
                key={`in-${k}-${L.w}-${s === 1}-${cycle}`}
                containerRef={wrapRef}
                fromRef={dropRef}
                toRef={nodeRef}
                startXOffset={L.beamIn.from[0] * k}
                startYOffset={L.beamIn.from[1] * k}
                endXOffset={L.beamIn.to[0] * k}
                endYOffset={L.beamIn.to[1] * k}
                duration={1.6}
                {...(s === 1 ? beamColors : idle)}
              />
              <AnimatedBeam
                key={`out-${k}-${L.w}-${s === 2}-${cycle}`}
                containerRef={wrapRef}
                fromRef={L.beamOut.source === "node" ? nodeRef : chipsRef}
                toRef={sheetRef}
                startXOffset={L.beamOut.from[0] * k}
                startYOffset={L.beamOut.from[1] * k}
                endXOffset={L.beamOut.to[0] * k}
                endYOffset={L.beamOut.to[1] * k}
                duration={1.6}
                {...(s === 2 ? beamColors : idle)}
              />
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-stretch gap-2 px-1">
        <ol className="grid flex-1 grid-cols-4 gap-2">
          {STEPS.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  setTouched(true);
                  goTo(i);
                }}
                aria-current={i === s ? "step" : undefined}
                className={cn(
                  "group/step flex w-full flex-col gap-2 rounded-md px-1 pb-1 pt-1.5 text-left transition-colors duration-300",
                  i === s ? "text-paper" : "text-dim hover:text-mist",
                )}
              >
                <span className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "hidden font-mono text-[10px] tracking-[0.14em] transition-colors sm:inline",
                      i === s ? "text-cyan-bright" : "text-dim",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span className="text-[12.5px] font-medium tracking-tight">
                    {t(`steps.${key}`)}
                  </span>
                </span>
                <span className="relative block h-px w-full overflow-hidden bg-line-strong">
                  <motion.span
                    className="absolute inset-0 origin-left bg-gradient-to-r from-electric to-cyan-bright"
                    style={{
                      scaleX: i === s && !reduced ? progress : i <= s ? 1 : 0,
                    }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
        {reduced ? null : (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? t("play") : t("pause")}
            className="grid size-9 shrink-0 place-items-center self-center rounded-full border border-line text-dim transition-colors hover:border-electric/40 hover:text-paper"
          >
            {paused ? (
              <Play className="size-3.5" strokeWidth={2} />
            ) : (
              <Pause className="size-3.5" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Chrome({ L, t }: { L: Layout; t: T }) {
  return (
    <div className="absolute inset-x-3 top-3 flex h-7 items-center gap-2">
      {L.stacked ? null : (
        <>
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="mr-1 size-2 rounded-full bg-electric/50" />
        </>
      )}
      <div className="flex h-full min-w-0 flex-1 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-line bg-surface px-3 font-mono text-[10.5px] text-dim">
        <Lock className="size-3 shrink-0 text-cyan-bright" strokeWidth={2.2} />
        <span className="text-mist">recibo-livre</span>
        <span className="truncate">/gerar</span>
      </div>
      <div className="flex h-full shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-bright/25 bg-cyan-bright/[0.06] px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cyan-bright">
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan-bright/60" />
          <span className="relative size-1.5 rounded-full bg-cyan-bright" />
        </span>
        {L.stacked ? t("localShort") : t("local")}
      </div>
    </div>
  );
}

const Dropzone = forwardRef<
  HTMLDivElement,
  { L: Layout; active: boolean; t: T }
>(function Dropzone({ L, active, t }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute rounded-xl border border-dashed transition-colors duration-700",
        active
          ? "border-electric/60 bg-electric/[0.06]"
          : "border-line-strong bg-surface",
      )}
      style={dropzoneOf(L.slip)}
    >
      <span
        className={cn(
          "absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors duration-700",
          active ? "text-electric" : "text-dim",
        )}
      >
        <Download className="size-3" strokeWidth={2.2} />
        {t("dropzone")}
      </span>
    </div>
  );
});

const SLIP_ROWS = [
  { key: "slipAmount", value: "R$ 2.500,00" },
  { key: "slipDate", value: "18/09/2026 14:32" },
  { key: "slipPayer", value: "ESTUDIO AURORA LTDA" },
  { key: "slipAuth", value: "8F2A.91C4.77D0" },
] as const;

function Slip({
  L,
  step,
  cycle,
  t,
  reduced,
}: {
  L: Layout;
  step: number;
  cycle: number;
  t: T;
  reduced: boolean;
}) {
  return (
    <motion.div
      key={cycle}
      initial={reduced ? false : { y: -70, opacity: 0, rotate: -6 }}
      animate={{ y: 0, opacity: 1, rotate: -1.5 }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.25 }}
      className="absolute overflow-hidden rounded-t-md bg-[#fbfaf5] text-[#1b2230] shadow-[0_18px_40px_-18px_rgba(2,6,23,0.55)] ring-1 ring-black/5"
      style={{
        ...L.slip,
        maskImage:
          "linear-gradient(#000,#000), conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)",
        maskSize: "100% calc(100% - 7px), 12px 7px",
        maskPosition: "top, bottom",
        maskRepeat: "no-repeat, repeat-x",
      }}
    >
      <div className="flex items-center gap-1.5 px-3 pt-3">
        <span className="rounded-[3px] bg-[#d9412b] px-1 font-mono text-[7px] font-bold leading-[13px] text-white">
          PDF
        </span>
        <span className="truncate font-mono text-[8px] text-[#6b7280]">
          comprovante.pdf
        </span>
      </div>
      <p className="px-3 pt-2.5 text-[12px] font-semibold tracking-tight">
        {t("slip")}
      </p>
      <div className="mx-3 mt-2 border-t border-dashed border-[#1b2230]/20" />

      <div className="relative mt-1 flex flex-col gap-0.5 px-1.5">
        {SLIP_ROWS.map((row, i) => (
          <div key={row.key} className="relative rounded-[4px] px-1.5 py-1.5">
            <AnimatePresence>
              {step >= 1 ? (
                <motion.span
                  className="absolute inset-0 rounded-[4px] border border-[#1558d6]/45 bg-[#1558d6]/[0.07]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: step === 1 ? 0.35 + i * 0.4 : 0,
                    duration: 0.4,
                    ease: EASE,
                  }}
                />
              ) : null}
            </AnimatePresence>
            <p className="relative text-[6.5px] uppercase tracking-[0.14em] text-[#6b7280]">
              {t(row.key)}
            </p>
            <p className="relative mt-0.5 font-mono text-[9.5px] font-medium">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-3 mt-1.5 space-y-1">
        <span className="block h-[3px] w-[80%] rounded-full bg-[#1b2230]/10" />
        <span className="block h-[3px] w-[56%] rounded-full bg-[#1b2230]/10" />
      </div>

      {step === 1 ? (
        <motion.span
          className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#1558d6]/20 to-transparent"
          initial={{ top: "-15%" }}
          animate={{ top: "100%" }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-[#1558d6]/70 shadow-[0_0_10px_#1558d6]" />
        </motion.span>
      ) : null}
    </motion.div>
  );
}

const BrowserNode = forwardRef<
  HTMLDivElement,
  { L: Layout; step: number; t: T; reduced: boolean }
>(function BrowserNode({ L, step, t, reduced }, ref) {
  const NODE = L.node;
  const busy = step === 1 || step === 2;
  const left = NODE.cx - NODE.size / 2;
  const top = NODE.cy - NODE.size / 2;

  return (
    <>
      <p
        className={cn(
          "absolute w-[140px] text-[11px] font-medium tracking-tight text-paper",
          L.stacked ? "text-left" : "text-center",
        )}
        style={
          L.stacked
            ? { left: NODE.cx + NODE.size / 2 + 14, top: NODE.cy - 17 }
            : { left: NODE.cx - 70, top: top - 26 }
        }
      >
        {t("browser")}
      </p>
      <div
        ref={ref}
        className="absolute"
        style={{ left, top, width: NODE.size, height: NODE.size }}
      >
        <motion.span
          className="absolute -inset-[5px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0 55%, var(--cyan-bright) 80%, var(--electric) 100%)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
          animate={
            busy && !reduced ? { rotate: 360, opacity: 1 } : { opacity: 0 }
          }
          transition={
            busy
              ? {
                  rotate: { duration: 1.4, ease: "linear", repeat: Infinity },
                  opacity: { duration: 0.3 },
                }
              : { duration: 0.3 }
          }
        />
        <div
          className={cn(
            "relative grid size-full place-items-center rounded-full border bg-panel transition-[border-color,box-shadow] duration-500",
            busy
              ? "border-electric/50 shadow-[0_0_36px_-4px_color-mix(in_oklab,var(--electric)_55%,transparent)]"
              : "border-line-strong",
          )}
        >
          <Cpu
            className={cn(
              "size-6 transition-colors duration-500",
              busy ? "text-cyan-bright" : "text-slate-blue",
            )}
            strokeWidth={1.6}
          />
        </div>
      </div>
      <p
        className={cn(
          "absolute w-[160px] font-mono text-[9.5px] text-dim",
          L.stacked ? "text-left" : "text-center",
        )}
        style={
          L.stacked
            ? { left: NODE.cx + NODE.size / 2 + 14, top: NODE.cy + 2 }
            : { left: NODE.cx - 80, top: top + NODE.size + 10 }
        }
      >
        {step === 1 ? (
          <span className="text-electric">
            {t("reading")}
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              …
            </motion.span>
          </span>
        ) : (
          t("browserHint")
        )}
      </p>
    </>
  );
});

const CHIP_KEYS = [
  "fieldAmount",
  "fieldDate",
  "fieldPayer",
  "fieldAuth",
] as const;

const Chips = forwardRef<HTMLDivElement, { L: Layout; step: number; t: T }>(
  function Chips({ L, step, t }, ref) {
    const done = step >= 2;
    return (
      <div
        ref={ref}
        className={cn(
          "absolute flex items-center gap-[5px]",
          L.stacked
            ? "flex-row flex-wrap content-center justify-center"
            : "flex-col",
        )}
        style={L.chips}
      >
        <AnimatePresence>
          {step >= 1
            ? CHIP_KEYS.map((key, i) => (
                <motion.span
                  key={key}
                  initial={{ opacity: 0, x: -14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{
                    delay: step === 1 ? 0.45 + i * 0.4 : 0,
                    duration: 0.45,
                    ease: EASE,
                  }}
                  className={cn(
                    "inline-flex h-[19px] items-center gap-1.5 rounded-full border px-2 font-mono text-[9px] transition-colors duration-500",
                    done
                      ? "border-cyan-bright/35 bg-cyan-bright/[0.08] text-cyan-bright"
                      : "border-electric/30 bg-electric/[0.06] text-electric",
                  )}
                >
                  {done ? (
                    <Check className="size-2.5" strokeWidth={3} />
                  ) : (
                    <ScanLine className="size-2.5" strokeWidth={2.4} />
                  )}
                  {t(key)}
                </motion.span>
              ))
            : null}
        </AnimatePresence>
      </div>
    );
  },
);

const TEAL = "#087f76";

function Fill({
  show,
  delay = 0,
  w,
  className,
  children,
}: {
  show: boolean;
  delay?: number;
  w: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("relative block h-[11px]", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {show ? (
          <motion.span
            key="v"
            className="absolute inset-0 block truncate"
            initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ delay, duration: 0.45, ease: EASE }}
          >
            {children}
          </motion.span>
        ) : (
          <motion.span
            key="s"
            className="absolute left-0 top-1/2 block h-[5px] -translate-y-1/2 rounded-full bg-[#102a2b]/[0.08]"
            style={{ width: w }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

const Sheet = forwardRef<
  HTMLDivElement,
  { L: Layout; step: number; cycle: number; t: T }
>(function Sheet({ L, step, cycle, t }, ref) {
  const filled = step >= 2;
  const done = step >= 3;

  return (
    <div
      ref={ref}
      className="absolute overflow-hidden rounded-[3px] text-[#102a2b] shadow-[0_28px_60px_-24px_rgba(2,6,23,0.6)] ring-1 ring-black/5"
      style={{
        ...L.sheet,
        background:
          "radial-gradient(90% 60% at 100% 0%, rgba(8,127,118,0.09), transparent 60%), #f8faf8",
      }}
    >
      <div className="flex h-full flex-col px-[18px] pb-3 pt-[18px] text-[6px] leading-snug">
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="grid size-[15px] place-items-center rounded-[4px] text-white"
              style={{ background: TEAL }}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <div>
              <p className="text-[8.5px] font-semibold tracking-tight">
                {t("receiptTitle")}
              </p>
              <p className="text-[4.5px] uppercase tracking-[0.16em] text-[#607071]">
                {t("receiptConfirmed")}
              </p>
            </div>
          </div>
          <div className="w-[52px] text-right text-[5.5px] text-[#607071]">
            <p className="font-semibold text-[#102a2b]">Nº 0042</p>
            <Fill show={filled} w="100%" className="mt-0.5 h-[8px]">
              18/09/2026, 14:32
            </Fill>
          </div>
        </header>

        <section className="mt-5">
          <p
            className="text-[5.5px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: TEAL }}
          >
            {t("receiptAmount")}
          </p>
          <p className="mt-1 text-[23px] font-semibold leading-none tracking-[-0.03em]">
            R${" "}
            {filled ? (
              <NumberTicker
                key={cycle}
                value={2500}
                decimalPlaces={2}
                locale="pt-BR"
                delay={0.15}
              />
            ) : (
              <span className="text-[#102a2b]/20">0,00</span>
            )}
          </p>
          <div className="mt-2 space-y-1">
            <span className="block h-[3px] w-[74%] rounded-full bg-[#102a2b]/[0.07]" />
            <span className="block h-[3px] w-[48%] rounded-full bg-[#102a2b]/[0.07]" />
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 border-y border-[#cbd6d3]">
          <div className="flex flex-col gap-1.5 py-2.5 pr-2.5">
            <p
              className="text-[4.5px] font-semibold uppercase tracking-[0.17em]"
              style={{ color: TEAL }}
            >
              {t("receiptPaidBy")}
            </p>
            <Fill show={filled} delay={0.1} w="86%" className="font-semibold">
              Estúdio Aurora LTDA
            </Fill>
            <Fill show={filled} delay={0.18} w="70%">
              12.345.678/0001-90
            </Fill>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-[#cbd6d3] py-2.5 pl-2.5">
            <p
              className="text-[4.5px] font-semibold uppercase tracking-[0.17em]"
              style={{ color: TEAL }}
            >
              {t("receiptReceivedBy")}
            </p>
            <Fill show={filled} delay={0.26} w="72%" className="font-semibold">
              Natã Santos
            </Fill>
            <Fill show={filled} delay={0.34} w="88%">
              Campos dos Goytacazes - RJ
            </Fill>
          </div>
        </section>

        <section className="flex flex-col gap-1.5 border-b border-[#cbd6d3] py-2.5">
          <p
            className="text-[4.5px] font-semibold uppercase tracking-[0.17em]"
            style={{ color: TEAL }}
          >
            {t("receiptItems")}
          </p>
          {[
            { label: t("item1"), value: "R$ 1.800,00", w: "60%" },
            { label: t("item2"), value: "R$ 700,00", w: "50%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Fill
                show={filled}
                delay={0.42 + i * 0.08}
                w={item.w}
                className="flex-1 text-[7px] font-semibold"
              >
                {item.label}
              </Fill>
              <Fill
                show={filled}
                delay={0.46 + i * 0.08}
                w="100%"
                className="w-[44px] text-right text-[7px] font-semibold"
              >
                {item.value}
              </Fill>
            </div>
          ))}
        </section>

        <div className="mt-2.5 space-y-1">
          <span className="block h-[3px] w-full rounded-full bg-[#102a2b]/[0.07]" />
          <span className="block h-[3px] w-[64%] rounded-full bg-[#102a2b]/[0.07]" />
        </div>

        <div className="relative mt-auto w-[118px]">
          <svg
            viewBox="0 0 120 34"
            className="absolute -top-7 left-1 h-[30px] w-[108px] overflow-visible"
            fill="none"
          >
            <AnimatePresence>
              {done ? (
                <motion.path
                  key={cycle}
                  d="M4 24c6-10 10-17 14-16 4 1-4 18 1 18 4 0 8-15 12-15 3 0-1 12 3 12 5 0 7-9 10-9 2 0 0 7 3 7 5 0 9-11 14-11 3 0 1 9 5 9 6 0 13-8 20-8 6 0 12 3 18 1"
                  stroke="#102a2b"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.3,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              ) : null}
            </AnimatePresence>
          </svg>
          <div className="border-t border-[#102a2b] pt-1">
            <p className="text-[6px] font-semibold">Natã Santos</p>
            <p className="text-[4.5px] uppercase tracking-[0.14em] text-[#607071]">
              {t("signature")}
            </p>
          </div>
        </div>

        <footer className="mt-3 flex items-end justify-between border-t border-[#cbd6d3] pt-1.5 text-[4.5px] text-[#607071]">
          <span>ID E0000000020260918 · 8F2A.91C4.77D0</span>
          <span
            className="font-semibold uppercase tracking-[0.12em]"
            style={{ color: TEAL }}
          >
            {t("paid")}
          </span>
        </footer>
      </div>

      <AnimatePresence>
        {done ? (
          <motion.div
            key={cycle}
            className="absolute right-[16px] top-[66px] flex items-center gap-1 rounded-[5px] border-[1.5px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{
              color: TEAL,
              borderColor: TEAL,
              background: "rgba(8,127,118,0.06)",
            }}
            initial={{ opacity: 0, scale: 2.2, rotate: -22 }}
            animate={{ opacity: 0.92, scale: 1, rotate: -11 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
          >
            <Check className="size-3" strokeWidth={3} />
            {t("paid")}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

function DownloadPill({
  L,
  step,
  cycle,
  t,
}: {
  L: Layout;
  step: number;
  cycle: number;
  t: T;
}) {
  return (
    <AnimatePresence>
      {step >= 3 ? (
        <motion.div
          key={cycle}
          className="absolute flex items-center gap-2.5 overflow-hidden rounded-xl border border-line-strong bg-panel/95 px-2.5 py-2 shadow-[0_18px_40px_-20px_rgba(2,6,23,0.6)] backdrop-blur"
          style={{
            left: L.sheet.left + 18,
            top: L.pillTop,
            width: L.sheet.width - 36,
          }}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          <span className="relative grid size-7 shrink-0 place-items-center rounded-lg bg-electric/12 text-electric">
            <motion.span
              className="absolute"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: 6 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              <Download className="size-3.5" strokeWidth={2.2} />
            </motion.span>
            <motion.span
              className="absolute text-cyan-bright"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.6,
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
            >
              <Check className="size-3.5" strokeWidth={2.6} />
            </motion.span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-mono text-[10.5px] text-paper">
              recibo-0042.pdf
            </span>
            <span className="block font-mono text-[9px] text-dim">
              48 KB ·{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-cyan-bright"
              >
                {t("downloaded")}
              </motion.span>
            </span>
          </span>
          <motion.span
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-electric to-cyan-bright"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.1, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
