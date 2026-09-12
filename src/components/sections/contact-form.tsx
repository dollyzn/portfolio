"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { submitContact } from "@/app/actions/contact";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactTurnstile } from "@/components/ui/turnstile";
import {
  CONTACT_FIELD_ORDER,
  CONTACT_INTENTS,
  contactSubmissionSchema,
  fieldErrorsFromZod,
  isContactFieldErrorCode,
  type ContactField,
  type ContactFieldErrors,
  type ContactIntent,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_MS = 420;
const EMPTY_VALUES = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function ContactForm() {
  const t = useTranslations("contact");
  const formId = useId();
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const successRef = useRef<HTMLHeadingElement>(null);
  const exitTimer = useRef<number>(0);
  const [intent, setIntent] = useState<ContactIntent>("project");
  const [values, setValues] = useState(EMPTY_VALUES);
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  useEffect(() => {
    return () => window.clearTimeout(exitTimer.current);
  }, []);

  const translateField = (code?: string) =>
    code && isContactFieldErrorCode(code)
      ? t(`fieldErrors.${code}`)
      : undefined;

  const focusFirstError = (errors: ContactFieldErrors) => {
    const first = CONTACT_FIELD_ORDER.find((field) => errors[field]);
    if (!first || first === "token" || first === "intent") return;
    document.getElementById(`${formId}-${first}`)?.focus();
  };

  const setField = (field: keyof typeof EMPTY_VALUES, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateClient = () => {
    const parsed = contactSubmissionSchema.safeParse({
      ...values,
      intent,
      token,
      website: "",
    });
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const errors = fieldErrorsFromZod(parsed.error);
    setFieldErrors(errors);
    focusFirstError(errors);
    return false;
  };

  const resetFields = () => {
    setValues(EMPTY_VALUES);
    setIntent("project");
    setToken("");
    setFieldErrors({});
    setFormError(null);
    turnstileRef.current?.reset();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setFormError(null);
    if (!validateClient()) {
      setFormError(t("errors.validation"));
      return;
    }

    const data = new FormData(event.currentTarget);
    data.set("intent", intent);
    data.set("cf-turnstile-response", token);

    setPending(true);

    try {
      const result = await submitContact(data);

      if (result.ok) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = window.setTimeout(() => {
          setStatus("ok");
          setPending(false);
          window.setTimeout(() => successRef.current?.focus(), 80);
        }, EXIT_MS);
        return;
      }

      turnstileRef.current?.reset();
      setToken("");
      if (result.fields) setFieldErrors(result.fields);
      setFormError(t(`errors.${result.error}`));
      setPending(false);
    } catch {
      turnstileRef.current?.reset();
      setToken("");
      setFormError(t("errors.generic"));
      setPending(false);
    }
  };

  const describedBy = (field: ContactField, extra?: string) =>
    [fieldErrors[field] ? `${formId}-${field}-error` : null, extra]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
      className="relative overflow-hidden rounded-[1.75rem] border border-line bg-panel/80 p-5 sm:p-7"
    >
      <BorderBeam
        size={90}
        duration={10}
        borderWidth={1}
        colorFrom="var(--electric)"
        colorTo="var(--cyan-bright)"
      />

      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (status === "ok") resetFields();
        }}
      >
        {status === "ok" ? (
          <motion.div
            key="ok"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex min-h-112 flex-col items-center justify-center px-4 text-center"
          >
            <span className="grid size-12 place-items-center rounded-full bg-electric/10 text-electric">
              <Check className="size-5" strokeWidth={2.2} />
            </span>
            <h3
              ref={successRef}
              tabIndex={-1}
              className="mt-5 text-[1.35rem] font-medium tracking-tight text-paper outline-none"
            >
              {t("successTitle")}
            </h3>
            <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-slate-blue">
              {t("successBody")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-7"
              onClick={() => setStatus("idle")}
            >
              {t("sendAnother")}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            aria-busy={pending}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: EXIT_MS / 1000, ease: EASE }}
            className="relative space-y-5"
          >
            <div className="sr-only">
              <label htmlFor={`${formId}-website`}>{t("honeypot")}</label>
              <input
                id={`${formId}-website`}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <fieldset className="space-y-2.5">
              <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-blue">
                {t("intentLabel")}
              </legend>
              <input type="hidden" name="intent" value={intent} />
              <div
                role="radiogroup"
                aria-label={t("intentLabel")}
                className="flex flex-wrap gap-2"
              >
                {CONTACT_INTENTS.map((value, index) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={intent === value}
                    tabIndex={intent === value ? 0 : -1}
                    onClick={() => setIntent(value)}
                    onKeyDown={(event) => {
                      const next =
                        event.key === "ArrowRight" || event.key === "ArrowDown"
                          ? CONTACT_INTENTS[
                              (index + 1) % CONTACT_INTENTS.length
                            ]
                          : event.key === "ArrowLeft" || event.key === "ArrowUp"
                            ? CONTACT_INTENTS[
                                (index - 1 + CONTACT_INTENTS.length) %
                                  CONTACT_INTENTS.length
                              ]
                            : null;
                      if (!next) return;
                      event.preventDefault();
                      setIntent(next);
                      event.currentTarget.parentElement
                        ?.querySelector<HTMLButtonElement>(
                          `[data-intent="${next}"]`,
                        )
                        ?.focus();
                    }}
                    data-intent={value}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[12.5px] tracking-tight transition-colors duration-300",
                      intent === value
                        ? "border-electric/40 bg-electric/10 text-paper"
                        : "border-line bg-surface text-slate-blue hover:border-electric/25 hover:text-paper",
                    )}
                  >
                    {t(`intents.${value}`)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("name")}
                htmlFor={`${formId}-name`}
                required
                error={translateField(fieldErrors.name)}
                errorId={`${formId}-name-error`}
              >
                <Input
                  id={`${formId}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  aria-required
                  maxLength={80}
                  value={values.name}
                  onChange={(event) => setField("name", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={describedBy("name")}
                  placeholder={t("namePlaceholder")}
                />
              </Field>
              <Field
                label={t("email")}
                htmlFor={`${formId}-email`}
                required
                error={translateField(fieldErrors.email)}
                errorId={`${formId}-email-error`}
              >
                <Input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required
                  maxLength={120}
                  value={values.email}
                  onChange={(event) => setField("email", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={describedBy("email")}
                  placeholder={t("emailPlaceholder")}
                />
              </Field>
            </div>

            <Field
              label={t("company")}
              htmlFor={`${formId}-company`}
              optional
              error={translateField(fieldErrors.company)}
              errorId={`${formId}-company-error`}
            >
              <Input
                id={`${formId}-company`}
                name="company"
                autoComplete="organization"
                maxLength={80}
                value={values.company}
                onChange={(event) => setField("company", event.target.value)}
                aria-invalid={Boolean(fieldErrors.company)}
                aria-describedby={describedBy("company")}
                placeholder={t("companyPlaceholder")}
              />
            </Field>

            <Field
              label={t("message")}
              htmlFor={`${formId}-message`}
              required
              error={translateField(fieldErrors.message)}
              errorId={`${formId}-message-error`}
              hint={`${values.message.trim().length}/2000`}
              hintId={`${formId}-message-count`}
            >
              <Textarea
                id={`${formId}-message`}
                name="message"
                required
                aria-required
                maxLength={2000}
                value={values.message}
                onChange={(event) => setField("message", event.target.value)}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={describedBy(
                  "message",
                  `${formId}-message-count`,
                )}
                placeholder={t("messagePlaceholder")}
              />
            </Field>

            <div
              aria-describedby={
                fieldErrors.token ? `${formId}-token-error` : undefined
              }
            >
              <ContactTurnstile
                widgetRef={turnstileRef}
                onSuccessAction={(value) => {
                  setToken(value);
                  if (fieldErrors.token) {
                    setFieldErrors((prev) => ({ ...prev, token: undefined }));
                  }
                }}
              />
              {fieldErrors.token ? (
                <p
                  id={`${formId}-token-error`}
                  role="alert"
                  className="mt-2 text-[13px] text-red-400/90"
                >
                  {translateField(fieldErrors.token)}
                </p>
              ) : null}
            </div>

            <div aria-live="assertive" className="min-h-5">
              {formError ? (
                <p role="alert" className="text-[13.5px] text-red-400/90">
                  {formError}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ArrowUpRight className="size-4" strokeWidth={1.8} />
              )}
              {pending ? t("sending") : t("submit")}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  required,
  error,
  errorId,
  hint,
  hintId,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  required?: boolean;
  error?: string;
  errorId?: string;
  hint?: string;
  hintId?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("contact");
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="sr-only"> {t("required")}</span> : null}
          {optional ? (
            <span className="normal-case tracking-normal text-dim">
              {" "}
              · {t("optional")}
            </span>
          ) : null}
        </Label>
        {hint ? (
          <span
            id={hintId}
            className="font-mono text-[10px] tracking-[0.12em] text-dim"
          >
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] text-red-400/90">
          {error}
        </p>
      ) : null}
    </div>
  );
}
