import { routing } from "../routing";

export type Locale = (typeof routing.locales)[number];

const messageFiles = ["ui", "content"] as const;

type MessageFile = (typeof messageFiles)[number];
type Messages = Record<string, unknown>;
type MessageLoader = () => Promise<unknown>;

const loaders = {
  tr: {
    ui: () => import("./tr/ui.json").then((m) => m.default),
    content: () => import("./tr/content.json").then((m) => m.default),
  },
  en: {
    ui: () => import("./en/ui.json").then((m) => m.default),
    content: () => import("./en/content.json").then((m) => m.default),
  },
  ru: {
    ui: () => import("./ru/ui.json").then((m) => m.default),
    content: () => import("./ru/content.json").then((m) => m.default),
  },
  ar: {
    ui: () => import("./ar/ui.json").then((m) => m.default),
    content: () => import("./ar/content.json").then((m) => m.default),
  },
} satisfies Record<Locale, Record<MessageFile, MessageLoader>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeMessages(base: unknown, override: unknown): unknown {
  if (!isRecord(base) || !isRecord(override)) {
    return override ?? base;
  }

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in merged ? mergeMessages(merged[key], value) : value;
  }
  return merged;
}

async function loadLocaleMessages(locale: Locale): Promise<Messages> {
  const bundles = await Promise.all(
    messageFiles.map(async (file) => await loaders[locale][file]())
  );

  return bundles.reduce((messages, bundle) => mergeMessages(messages, bundle), {}) as Messages;
}

export async function getMessages(locale: Locale): Promise<Messages> {
  const defaultLocale = routing.defaultLocale as Locale;
  const defaultMessages = await loadLocaleMessages(defaultLocale);

  if (locale === defaultLocale) {
    return defaultMessages;
  }

  const localeMessages = await loadLocaleMessages(locale);
  return mergeMessages(defaultMessages, localeMessages) as Messages;
}
