import type { ContactIntent, ContactPayload } from "@/lib/contact";
import { site } from "@/lib/site";

const INTENT_LABEL: Record<ContactIntent, string> = {
  project: "Projeto",
  role: "Vaga",
  collab: "Parceria",
  other: "Outro",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessage(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export function contactEmailSubject(payload: ContactPayload) {
  return `[${INTENT_LABEL[payload.intent]}] ${payload.name}`;
}

export function contactEmailText(payload: ContactPayload) {
  return [
    `Nova mensagem pelo formulário de ${site.url}`,
    "",
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    payload.company ? `Empresa: ${payload.company}` : null,
    `Assunto: ${INTENT_LABEL[payload.intent]}`,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export function contactEmailHtml(payload: ContactPayload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const company = payload.company ? escapeHtml(payload.company) : "-";
  const intent = escapeHtml(INTENT_LABEL[payload.intent]);
  const message = formatMessage(payload.message);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(contactEmailSubject(payload))}</title>
  </head>
  <body style="margin:0;padding:0;background:#02040a;color:#eef3fb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#02040a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 8px 28px;font-family:Geist,ui-sans-serif,system-ui,sans-serif;">
                <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#4cb1fc;">07 — Contato</p>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.1;letter-spacing:-0.03em;font-weight:500;color:#eef3fb;">
                  Natã<span style="color:#4cb1fc;">.</span>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="background:#070b16;border:1px solid rgba(255,255,255,0.07);border-radius:24px;padding:28px 24px;font-family:Geist,ui-sans-serif,system-ui,sans-serif;">
                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#7f8fa8;">
                  Nova mensagem pelo formulário do portfólio.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${metaRow("Nome", name)}
                  ${metaRow("E-mail", `<a href="mailto:${email}" style="color:#4cb1fc;text-decoration:none;">${email}</a>`)}
                  ${metaRow("Empresa", company)}
                  ${metaRow("Assunto", intent)}
                </table>
                <div style="margin-top:22px;padding-top:22px;border-top:1px solid rgba(255,255,255,0.07);">
                  <p style="margin:0 0 10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7f8fa8;">
                    Mensagem
                  </p>
                  <p style="margin:0;font-size:15px;line-height:1.75;color:#eef3fb;">
                    ${message}
                  </p>
                </div>
                <p style="margin:28px 0 0;">
                  <a href="mailto:${email}" style="display:inline-block;background:#eef3fb;color:#02040a;text-decoration:none;border-radius:999px;padding:11px 18px;font-size:13px;font-weight:500;">
                    Responder ${name}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 8px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5a6880;">
                ${year} · ${escapeHtml(site.url.replace(/^https?:\/\//, ""))} · Brasília, DF
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function metaRow(label: string, value: string) {
  return `<tr>
    <td style="padding:0 0 14px;">
      <p style="margin:0 0 4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7f8fa8;">${label}</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#eef3fb;">${value}</p>
    </td>
  </tr>`;
}
