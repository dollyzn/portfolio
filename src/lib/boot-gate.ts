/**
 * Porta de sincronização entre o globo 3D e a intro.
 * A intro fica em "booting" até markGlobeReady() (ou o teto de tempo).
 */

type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function isGlobeReady() {
  return ready;
}

export function markGlobeReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
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
