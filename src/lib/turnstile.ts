import { TURNSTILE_ACTION } from "@/lib/turnstile-action";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export { TURNSTILE_ACTION };

export type TurnstileVerifyResult =
  | { ok: true; hostname: string }
  | { ok: false; reason: "config" | "token" | "upstream" | "mismatch" };

function expectedHostnames() {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

export async function verifyTurnstileToken(
  token: unknown,
  remoteip?: string,
  expectedAction = TURNSTILE_ACTION,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET ?? "";
  const hosts = expectedHostnames();

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    !secret ||
    hosts.size === 0
  ) {
    return {
      ok: false,
      reason: !secret || hosts.size === 0 ? "config" : "token",
    };
  }

  let result: {
    success?: boolean;
    action?: string;
    hostname?: string;
  };

  try {
    const response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteip ? { remoteip } : {}),
      }),
    });
    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = (await response.json()) as typeof result;
  } catch {
    return { ok: false, reason: "upstream" };
  }

  if (
    !result.success ||
    result.action !== expectedAction ||
    !result.hostname ||
    !hosts.has(result.hostname)
  ) {
    return { ok: false, reason: "mismatch" };
  }

  return { ok: true, hostname: result.hostname };
}
