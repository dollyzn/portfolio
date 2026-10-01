/**
 * Modo de desempenho.
 *
 * Sem aceleração de hardware o navegador rasteriza WebGL em software
 * (SwiftShader / llvmpipe) e composita blur e filtros na CPU - o globo e os
 * glows do site passam a custar centenas de ms por frame. Aqui a gente
 * descobre isso antes de montar o 3D e troca o site para uma versão leve.
 *
 * Store externo (sem provider) no mesmo espírito do boot-gate: o snapshot é
 * estável para o useSyncExternalStore e o primeiro render do cliente bate com
 * o HTML do servidor.
 */

export type PerfPreference = "auto" | "lite" | "full";
export type PerfMode = "full" | "lite";
/** O que sugeriu o modo leve. null = nada detectado. */
export type PerfTrigger = "software-renderer" | "no-webgl" | "low-fps" | null;

export type PerfSnapshot = {
  mode: PerfMode;
  preference: PerfPreference;
  trigger: PerfTrigger;
  /** Driver reportado pelo navegador, quando ele expõe. */
  renderer: string | null;
  /** A sondagem do WebGL já rodou neste cliente. */
  resolved: boolean;
  noticeDismissed: boolean;
};

const PREFERENCE_KEY = "nsantos:perf";
const NOTICE_KEY = "nsantos:perf-notice";
const PROBE_KEY = "nsantos:perf-probe";

/** Rasterizadores de software conhecidos. */
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render|generic renderer|mesa offscreen|virgl/i;

const SERVER_SNAPSHOT: PerfSnapshot = Object.freeze({
  mode: "full",
  preference: "auto",
  trigger: null,
  renderer: null,
  resolved: false,
  noticeDismissed: false,
});

let snapshot: PerfSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function readStore(storage: "local" | "session", key: string) {
  try {
    const store = storage === "local" ? localStorage : sessionStorage;
    return store.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(storage: "local" | "session", key: string, value: string) {
  try {
    const store = storage === "local" ? localStorage : sessionStorage;
    store.setItem(key, value);
  } catch {
    /* modo privado / storage bloqueado */
  }
}

function resolveMode(
  preference: PerfPreference,
  trigger: PerfTrigger,
): PerfMode {
  if (preference === "lite") return "lite";
  if (preference === "full") return "full";
  return trigger ? "lite" : "full";
}

function commit(next: Partial<PerfSnapshot>) {
  const merged = { ...snapshot, ...next };
  merged.mode = resolveMode(merged.preference, merged.trigger);

  const changed = (Object.keys(merged) as (keyof PerfSnapshot)[]).some(
    (key) => merged[key] !== snapshot[key],
  );
  if (!changed) return;

  snapshot = merged;
  document.documentElement.dataset.perf = merged.mode;
  listeners.forEach((listener) => listener());
}

type Probe = { trigger: PerfTrigger; renderer: string | null };

/**
 * `failIfMajorPerformanceCaveat` é o próprio navegador dizendo que aquele
 * contexto vai rodar em software; a string do driver entra só como detalhe
 * para a mensagem (e nem todo navegador expõe).
 */
function probeRenderer(): Probe {
  const cached = readStore("session", PROBE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as Probe;
    } catch {
      /* cache inválido: sonda de novo */
    }
  }

  let result: Probe = { trigger: null, renderer: null };

  try {
    const canvas = document.createElement("canvas");
    const accelerated = canvas.getContext("webgl", {
      failIfMajorPerformanceCaveat: true,
    });
    const gl =
      accelerated ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);

    if (!gl) {
      result = { trigger: "no-webgl", renderer: null };
    } else {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "")
        : "";

      result = {
        trigger:
          !accelerated || SOFTWARE_RENDERER.test(renderer)
            ? "software-renderer"
            : null,
        renderer: renderer || null,
      };

      // libera o contexto da sondagem (em software ele é caro de manter)
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    result = { trigger: "no-webgl", renderer: null };
  }

  writeStore("session", PROBE_KEY, JSON.stringify(result));
  return result;
}

/** Idempotente: roda a sondagem uma vez por documento. */
export function initPerfMode() {
  if (snapshot.resolved) return;

  const stored = readStore("local", PREFERENCE_KEY);
  const preference: PerfPreference =
    stored === "lite" || stored === "full" ? stored : "auto";
  const { trigger, renderer } = probeRenderer();

  commit({
    preference,
    trigger,
    renderer,
    resolved: true,
    noticeDismissed: readStore("local", NOTICE_KEY) === "1",
  });
}

export function subscribePerf(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPerfSnapshot() {
  return snapshot;
}

export function getServerPerfSnapshot() {
  return SERVER_SNAPSHOT;
}

export function setPerfPreference(preference: PerfPreference) {
  if (preference === "auto") {
    try {
      localStorage.removeItem(PREFERENCE_KEY);
    } catch {
      /* ignore */
    }
  } else {
    writeStore("local", PREFERENCE_KEY, preference);
  }

  // escolha explícita encerra o assunto: o aviso não volta
  if (preference !== "auto") writeStore("local", NOTICE_KEY, "1");
  commit({
    preference,
    noticeDismissed: preference !== "auto" || snapshot.noticeDismissed,
  });
}

export function dismissPerfNotice() {
  writeStore("local", NOTICE_KEY, "1");
  commit({ noticeDismissed: true });
}

/** Watchdog de FPS: pega lentidão que a sondagem de WebGL não revela. */
export function reportSlowRuntime() {
  if (snapshot.preference !== "auto" || snapshot.trigger) return;
  commit({ trigger: "low-fps" });
}

/** O aviso só aparece quando o site decidiu degradar sozinho. */
export function shouldShowPerfNotice(state: PerfSnapshot) {
  return (
    state.resolved &&
    state.mode === "lite" &&
    state.preference === "auto" &&
    state.trigger !== null &&
    !state.noticeDismissed
  );
}
