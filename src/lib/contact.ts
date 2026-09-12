import * as z from "zod";

export const CONTACT_INTENTS = ["project", "role", "collab", "other"] as const;
export type ContactIntent = (typeof CONTACT_INTENTS)[number];

export type ContactField =
  | "name"
  | "email"
  | "company"
  | "intent"
  | "message"
  | "token";
export type ContactFieldErrorCode =
  | "nameMin"
  | "nameMax"
  | "emailInvalid"
  | "emailMax"
  | "companyMax"
  | "intentInvalid"
  | "messageMin"
  | "messageMax"
  | "captchaRequired";
export type ContactFieldErrors = Partial<
  Record<ContactField, ContactFieldErrorCode>
>;

export const CONTACT_FIELD_ORDER: ContactField[] = [
  "name",
  "email",
  "company",
  "intent",
  "message",
  "token",
];

const FIELD_ERROR_CODES = new Set<string>([
  "nameMin",
  "nameMax",
  "emailInvalid",
  "emailMax",
  "companyMax",
  "intentInvalid",
  "messageMin",
  "messageMax",
  "captchaRequired",
]);

export function isContactFieldErrorCode(
  value: string,
): value is ContactFieldErrorCode {
  return FIELD_ERROR_CODES.has(value);
}

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(80, "nameMax"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "emailMax")
    .pipe(z.email("emailInvalid")),
  company: z.preprocess(
    emptyToUndefined,
    z.string().max(80, "companyMax").optional(),
  ),
  intent: z.enum(CONTACT_INTENTS, { error: "intentInvalid" }),
  message: z.string().trim().min(20, "messageMin").max(2000, "messageMax"),
});

export const contactSubmissionSchema = contactSchema.extend({
  token: z
    .string()
    .trim()
    .min(1, "captchaRequired")
    .max(2048, "captchaRequired"),
  website: z.string().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function fieldErrorsFromZod(error: z.ZodError): ContactFieldErrors {
  const fields: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      key === "name" ||
      key === "email" ||
      key === "company" ||
      key === "intent" ||
      key === "message" ||
      key === "token"
    ) {
      if (!fields[key] && isContactFieldErrorCode(issue.message)) {
        fields[key] = issue.message;
      }
    }
  }
  return fields;
}

export function parseContactSubmission(input: unknown) {
  return contactSubmissionSchema.safeParse(input);
}
