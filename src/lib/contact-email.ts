import type { ContactIntent, ContactPayload } from "@/lib/contact";
import { site } from "@/lib/site";

const INTENT_LABEL: Record<ContactIntent, string> = {
  project: "Projeto",
  role: "Vaga",
  collab: "Parceria",
  other: "Outro",
};

const RECEIPT_LINE: Record<ContactIntent, string> = {
  project:
    "Projeto. Vou ler o contexto com calma antes de responder - sem chute.",
  role: "Vaga. Se o encaixe fizer sentido, a gente conversa. Se não, eu digo.",
  collab: "Parceria. Curto quando a ideia é clara dos dois lados.",
  other: "Recebi. Já está comigo, não numa caixa preta.",
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO =
  "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

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

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function hostLabel() {
  return site.url.replace(/^https?:\/\//, "");
}

function stampedInBrasilia() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function emailDocument({
  lang = "pt-BR",
  title,
  preheader,
  body,
}: {
  lang?: string;
  title: string;
  preheader: string;
  body: string;
}) {
  return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background: transparent !important;
        background-color: transparent !important;
      }
      body { color: #1a2332; }
      a { color: #1558d6; }
      .text { color: #1a2332 !important; }
      .muted { color: #5a6880 !important; }
      .accent { color: #1558d6 !important; }
      .rule { border-color: #d5dce8 !important; }
      .chip {
        border-color: #1558d6 !important;
        color: #1558d6 !important;
      }
      .btn {
        background: #1a2332 !important;
        color: #f4f7fb !important;
      }
      @media (prefers-color-scheme: dark) {
        body { color: #eef3fb !important; }
        a { color: #4cb1fc !important; }
        .text { color: #eef3fb !important; }
        .muted { color: #8b9bb3 !important; }
        .accent { color: #4cb1fc !important; }
        .rule { border-color: #2c3648 !important; }
        .chip {
          border-color: #4cb1fc !important;
          color: #4cb1fc !important;
        }
        .btn {
          background: #eef3fb !important;
          color: #0a1220 !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:transparent;background-color:transparent;color:#1a2332;">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;line-height:1px;font-size:1px;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:transparent;background-color:transparent;">
      <tr>
        <td align="left" style="padding:28px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
            ${body}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function brandHeader() {
  return `<tr>
    <td style="padding:0 0 28px;font-family:${FONT};">
      <p class="accent" style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#1558d6;">07 — Contato</p>
      <h1 class="text" style="margin:10px 0 0;font-size:26px;line-height:1.15;letter-spacing:-0.03em;font-weight:500;color:#1a2332;">
        Natã<span class="accent" style="color:#1558d6;">.</span>
      </h1>
    </td>
  </tr>`;
}

function emailFooter() {
  const year = new Date().getFullYear();
  return `<tr>
    <td style="padding:28px 0 0;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">
      <p class="muted" style="margin:0;color:#5a6880;">
        ${year} · <a class="muted" href="${escapeHtml(site.url)}" style="color:#5a6880;text-decoration:none;">${escapeHtml(hostLabel())}</a>
        · Brasília, DF
      </p>
    </td>
  </tr>`;
}

function metaRow(label: string, value: string) {
  return `<tr>
    <td class="rule" style="padding:0 0 14px;border-bottom:1px solid #d5dce8;">
      <p class="muted" style="margin:0 0 4px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5a6880;">${label}</p>
      <p class="text" style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:1.5;color:#1a2332;">${value}</p>
    </td>
  </tr>`;
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
    `Quando: ${stampedInBrasilia()} (Brasília)`,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export function contactEmailHtml(payload: ContactPayload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const company = payload.company ? escapeHtml(payload.company) : "—";
  const intent = escapeHtml(INTENT_LABEL[payload.intent]);
  const message = formatMessage(payload.message);
  const when = escapeHtml(stampedInBrasilia());

  const body = `${brandHeader()}
            <tr>
              <td style="padding:0 0 22px;font-family:${FONT};">
                <p class="muted" style="margin:0;font-size:15px;line-height:1.65;color:#5a6880;">
                  Sinal novo no formulário. Sem caixa preta — o contexto está abaixo.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="chip" width="2" style="width:2px;background:#1558d6;font-size:0;line-height:0;">&nbsp;</td>
                    <td style="padding:0 0 0 16px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${metaRow("Nome", name)}
                        ${metaRow("E-mail", `<a class="accent" href="mailto:${email}" style="color:#1558d6;text-decoration:none;">${email}</a>`)}
                        ${metaRow("Empresa", company)}
                        ${metaRow("Assunto", intent)}
                        ${metaRow("Quando", `${when} · Brasília`)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 0 0;font-family:${FONT};">
                <p class="muted" style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5a6880;">
                  Mensagem
                </p>
                <p class="text" style="margin:0;font-size:15px;line-height:1.75;color:#1a2332;">
                  ${message}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 0 0;font-family:${FONT};">
                <a class="btn" href="mailto:${email}" style="display:inline-block;background:#1a2332;color:#f4f7fb;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:13px;font-weight:500;">
                  Responder ${name}
                </a>
              </td>
            </tr>
            ${emailFooter()}`;

  return emailDocument({
    title: contactEmailSubject(payload),
    preheader: `${payload.name} escreveu sobre ${INTENT_LABEL[payload.intent].toLowerCase()}.`,
    body,
  });
}

export function receiptEmailSubject(payload: ContactPayload) {
  return `${firstName(payload.name)}, o sinal chegou.`;
}

export function receiptEmailText(payload: ContactPayload) {
  return [
    `Olá, ${firstName(payload.name)}.`,
    "",
    RECEIPT_LINE[payload.intent],
    "",
    `Assunto: ${INTENT_LABEL[payload.intent]}`,
    payload.company ? `Empresa: ${payload.company}` : null,
    `Quando: ${stampedInBrasilia()} (Brasília)`,
    "",
    "Não é um ticket. É um recado de que a mensagem não se perdeu no caminho.",
    `Se quiser acrescentar algo, responde este e-mail — cai direto comigo: ${site.email}`,
    "",
    site.name,
    site.url,
  ]
    .filter(Boolean)
    .join("\n");
}

export function receiptEmailHtml(payload: ContactPayload) {
  const name = escapeHtml(firstName(payload.name));
  const intent = escapeHtml(INTENT_LABEL[payload.intent]);
  const line = escapeHtml(RECEIPT_LINE[payload.intent]);
  const when = escapeHtml(stampedInBrasilia());
  const company = payload.company ? escapeHtml(payload.company) : null;

  const body = `${brandHeader()}
            <tr>
              <td style="padding:0 0 8px;font-family:${FONT};">
                <p class="text" style="margin:0;font-size:22px;line-height:1.25;letter-spacing:-0.03em;font-weight:500;color:#1a2332;">
                  ${name}, o sinal chegou.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0 22px;font-family:${FONT};">
                <p class="muted" style="margin:0;font-size:15px;line-height:1.7;color:#5a6880;">
                  ${line}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 6px;">
                <span class="chip" style="display:inline-block;border:1px solid #1558d6;border-radius:999px;padding:6px 12px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#1558d6;">
                  07 · sinal recebido
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${metaRow("Assunto", intent)}
                  ${company ? metaRow("Empresa", company) : ""}
                  ${metaRow("Quando", `${when} · Brasília`)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;font-family:${FONT};">
                <p class="text" style="margin:0;font-size:15px;line-height:1.7;color:#1a2332;">
                  Não é um ticket. É só o recado de que a mensagem não se perdeu no caminho.
                  Se quiser acrescentar contexto, responde este e-mail — cai direto comigo.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 0 0;font-family:${FONT};">
                <a class="btn" href="${escapeHtml(site.url)}" style="display:inline-block;background:#1a2332;color:#f4f7fb;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:13px;font-weight:500;">
                  Enquanto isso, o portfólio
                </a>
              </td>
            </tr>
            ${emailFooter()}`;

  return emailDocument({
    title: receiptEmailSubject(payload),
    preheader: RECEIPT_LINE[payload.intent],
    body,
  });
}
