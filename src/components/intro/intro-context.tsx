"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { LayoutGroup } from "motion/react";
import { whenGlobeReady } from "@/lib/boot-gate";

export type IntroPhase =
  | "booting"
  | "drawing"
  | "moving"
  | "revealing"
  | "complete";

const PHASE_ORDER: IntroPhase[] = [
  "booting",
  "drawing",
  "moving",
  "revealing",
  "complete",
];

/** Se o globo demorar demais, a intro não trava pra sempre. */
const GLOBE_WAIT_CAP_MS = 10000;

type IntroContextValue = {
  phase: IntroPhase;
  /** Avança só para frente na sequência. */
  setPhase: (phase: IntroPhase) => void;
  /** Hero / nav já podem animar a entrada. */
  isRevealing: boolean;
  isComplete: boolean;
  /** Preferência de reduced-motion já resolvida no cliente. */
  reduced: boolean;
};

const IntroContext = createContext<IntroContextValue | null>(null);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const media = window.matchMedia(REDUCED_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getReducedSnapshot = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServerSnapshot = () => false;

function readHash(): string {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#top") return "";
  return hash;
}

export function IntroProvider({
  children,
  skip = false,
}: {
  children: React.ReactNode;
  skip?: boolean;
}) {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    getReducedServerSnapshot,
  );

  const [phase, setPhaseState] = useState<IntroPhase>(() =>
    skip ? "complete" : "booting",
  );
  const pendingHashRef = useRef("");

  const effectivePhase = reduced || skip ? "complete" : phase;

  const setPhase = useCallback(
    (next: IntroPhase) => {
      if (reduced || skip) return;
      setPhaseState((prev) => {
        if (PHASE_ORDER.indexOf(next) <= PHASE_ORDER.indexOf(prev)) return prev;
        return next;
      });
    },
    [reduced, skip],
  );

  // F5 / reload: trava scroll restoration e força o topo antes da paint.
  useLayoutEffect(() => {
    if (skip || reduced) {
      document.documentElement.dataset.intro = "done";
      if (skip) return;
    } else {
      // Antes da paint: se viemos do Colophon, o html ainda está em
      // data-intro="done" e o hero vazaria por cima da intro.
      document.documentElement.dataset.intro = "playing";
    }

    const previous = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* ignore */
    }

    pendingHashRef.current = readHash();
    window.scrollTo(0, 0);

    return () => {
      try {
        history.scrollRestoration = previous;
      } catch {
        /* ignore */
      }
    };
  }, [skip, reduced]);

  // Boot gate: espera o globo (ou o teto) antes de desenhar a logo.
  useEffect(() => {
    if (skip || reduced || effectivePhase !== "booting") return;

    let cancelled = false;

    const unlock = () => {
      if (!cancelled) setPhase("drawing");
    };

    const cap = window.setTimeout(unlock, GLOBE_WAIT_CAP_MS);
    const unsub = whenGlobeReady(unlock);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      unsub();
    };
  }, [skip, reduced, effectivePhase, setPhase]);

  useEffect(() => {
    if (effectivePhase === "complete") {
      document.documentElement.dataset.intro = "done";
      document.body.style.overflow = "";
      return;
    }

    if (effectivePhase === "revealing") {
      document.documentElement.dataset.intro = "revealing";
    } else {
      document.documentElement.dataset.intro = "playing";
    }

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [effectivePhase]);

  // Depois da intro + hero: scroll para o hash da URL, se houver.
  useEffect(() => {
    if (effectivePhase !== "complete") return;

    const hash = pendingHashRef.current || readHash();
    if (!hash) return;

    pendingHashRef.current = "";

    const id = window.setTimeout(
      () => {
        const el = document.querySelector(hash);
        if (!el) return;
        el.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
      },
      reduced ? 0 : 120,
    );

    return () => window.clearTimeout(id);
  }, [effectivePhase, reduced]);

  // Escape pula a intro (a11y) sem botão invisível cobrindo a tela.
  useEffect(() => {
    if (effectivePhase === "complete" || reduced) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPhaseState("complete");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [effectivePhase, reduced]);

  // Revela nav/hero enquanto a logo ainda está a caminho do header.
  useEffect(() => {
    if (effectivePhase !== "moving") return;
    const id = window.setTimeout(() => setPhase("revealing"), 280);
    return () => window.clearTimeout(id);
  }, [effectivePhase, setPhase]);

  // Safety após o draw começar - o boot do globo já tem o próprio teto.
  useEffect(() => {
    if (
      reduced ||
      effectivePhase === "complete" ||
      effectivePhase === "booting"
    ) {
      return;
    }
    const id = window.setTimeout(() => setPhaseState("complete"), 5000);
    return () => window.clearTimeout(id);
  }, [effectivePhase, reduced]);

  const value = useMemo<IntroContextValue>(
    () => ({
      phase: effectivePhase,
      setPhase,
      isRevealing:
        effectivePhase === "revealing" || effectivePhase === "complete",
      isComplete: effectivePhase === "complete",
      reduced,
    }),
    [effectivePhase, setPhase, reduced],
  );

  return (
    <IntroContext.Provider value={value}>
      <LayoutGroup id="brand-intro">{children}</LayoutGroup>
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used within IntroProvider");
  }
  return ctx;
}

/** Versão segura para seções que podem renderizar fora do provider. */
export function useIntroOptional() {
  return useContext(IntroContext);
}
