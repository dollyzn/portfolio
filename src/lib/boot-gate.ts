/**
 * Porta de sincronização entre o globo 3D e a intro.
 * A intro fica em "booting" até markGlobeReady() (ou o teto de tempo).
 */

type Listener = () => void;

let ready = false;
/** Já aquceu pelo menos uma vez neste document (soft nav / locale). */
let warmedUp = false;
const listeners = new Set<Listener>();

export function isGlobeReady() {
  return ready;
}

/** true depois do primeiro markGlobeReady - sobrevive a reset entre remounts. */
export function hasGlobeWarmedUp() {
  return warmedUp;
}

export function markGlobeReady() {
  warmedUp = true;
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Chamar no unmount do globo para a próxima intro esperar o WebGL de novo. */
export function resetGlobeReady() {
  ready = false;
}

/** Chama o callback imediatamente se já estiver pronto; senão espera. */
export function whenGlobeReady(listener: Listener) {
  if (ready) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
