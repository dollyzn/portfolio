"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  contactEmailHtml,
  contactEmailSubject,
  contactEmailText,
} from "@/lib/contact-email";
import {
  fieldErrorsFromZod,
  parseContactSubmission,
  type ContactFieldErrors,
  type ContactPayload,
} from "@/lib/contact";
import { site } from "@/lib/site";
import { verifyTurnstileToken } from "@/lib/turnstile";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      error: "captcha" | "validation" | "mail" | "rate";
      fields?: ContactFieldErrors;
    };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function envFlag(name: string) {
  const value = process.env[name]?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function envOr(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function headerValue(headerList: Headers, name: string) {
  const value = headerList.get(name)?.trim();
  return value || undefined;
}

function clientIp(headerList: Headers) {
  // cf-connecting-ip só é confiável atrás do proxy da Cloudflare.
  if (envFlag("TRUST_CF_CONNECTING_IP")) {
    const cfIp = headerValue(headerList, "cf-connecting-ip");
    if (cfIp) return cfIp;
  }

  const realIp = headerValue(headerList, "x-real-ip");
  if (realIp) return realIp;

  const forwarded = headerValue(headerList, "x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    return hops.at(-1) ?? "";
  }

  return "";
}

function allow(ip: string) {
  const key = ip || "unknown";
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

function read(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function deliver(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxx") return false;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: envOr(
        process.env.CONTACT_FROM,
        "Natã Santos <onboarding@resend.dev>",
      ),
      to: envOr(process.env.CONTACT_TO, site.email),
      replyTo: payload.email,
      subject: contactEmailSubject(payload),
      html: contactEmailHtml(payload),
      text: contactEmailText(payload),
    });

    if (error) {
      console.error("[contact] resend", error.message);
      return false;
    }

    return true;
  } catch {
    console.error("[contact] resend");
    return false;
  }
}

export async function submitContact(
  formData: FormData,
): Promise<ContactResult> {
  const headerList = await headers();
  const ip = clientIp(headerList);

  if (!allow(ip)) return { ok: false, error: "rate" };
  if (read(formData, "website")) return { ok: true };

  const parsed = parseContactSubmission({
    name: read(formData, "name"),
    email: read(formData, "email"),
    company: read(formData, "company"),
    intent: read(formData, "intent"),
    message: read(formData, "message"),
    token: read(formData, "cf-turnstile-response"),
    website: read(formData, "website"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fields: fieldErrorsFromZod(parsed.error),
    };
  }

  const captcha = await verifyTurnstileToken(
    parsed.data.token,
    ip || undefined,
  );
  if (!captcha.ok) return { ok: false, error: "captcha" };

  const { name, email, company, intent, message } = parsed.data;
  const sent = await deliver({ name, email, company, intent, message });

  if (!sent) return { ok: false, error: "mail" };
  return { ok: true };
}
