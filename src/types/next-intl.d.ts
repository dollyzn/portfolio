import type pt from "../../messages/pt.json";
import type { AppLocale } from "@/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof pt;
  }
}
