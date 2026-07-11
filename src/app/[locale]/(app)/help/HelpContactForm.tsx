"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createPublicSupportTicket } from "@/lib/actions/support";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

/* Public destek formu — ticket olarak admin destek kutusuna düşer. */
const HelpContactForm = () => {
  const [state, action, pending] = useActionState(createPublicSupportTicket, { ok: false });
  const t = useTranslations("helpPage");

  if (state.ok) {
    return (
      <p className="mt-4 rounded-[12px] border border-line bg-cream/40 px-4 py-3.5 text-[14.5px] font-semibold text-ink">
        ✓ {t("sent")}
      </p>
    );
  }

  const errorText =
    state.error === "missing"
      ? t("missing")
      : state.error === "email"
        ? t("invalidEmail")
        : state.error === "rate"
          ? t("rate")
          : state.error
            ? t("error")
            : null;

  return (
    <form className="mt-4 flex flex-col gap-4" action={action}>
      {/* Honeypot — botlar doldurur, kullanıcı görmez. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        <Input name="name" label={t("name")} type="text" required placeholder={t("namePh")} />
        <Input name="email" label={t("email")} type="email" required placeholder={t("emailPh")} />
      </div>
      <Input name="subject" label={t("subject")} type="text" required placeholder={t("subjectPh")} />
      <label className="flex flex-col gap-2 text-[14.5px] font-bold text-ink">
        {t("message")}
        <textarea
          name="message"
          rows={5}
          required
          maxLength={4000}
          placeholder={t("messagePh")}
          className="field w-full py-2.5 text-[15px] font-medium"
        />
      </label>

      {errorText && <p className="text-[13px] font-medium text-red-600">{errorText}</p>}

      <Button type="submit" size="lg" className="w-fit" loading={pending}>
        {t("submit")}
      </Button>
    </form>
  );
};

export default HelpContactForm;
