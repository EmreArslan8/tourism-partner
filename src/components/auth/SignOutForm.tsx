"use client";

import { signOut } from "@/lib/actions/auth";

/*
 * Manuel çıkış formu — signOut server action'ını sarar. Çıkıştan hemen önce
 * sessionStorage'a bir bayrak koyar; böylece AuthWatcher, çıkışın kullanıcı
 * tarafından bilinçli yapıldığını anlar ve yanlışlıkla "oturumunuz doldu"
 * (?expired=1) ekranı göstermez. Tüm çıkış butonları bunu kullanmalı.
 */
export const INTENTIONAL_SIGNOUT_KEY = "tp-intentional-signout";

export default function SignOutForm({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={signOut}
      className={className}
      onSubmit={() => {
        try {
          sessionStorage.setItem(INTENTIONAL_SIGNOUT_KEY, "1");
        } catch {
          // sessionStorage yoksa sessizce geç — çıkış yine de gerçekleşir.
        }
      }}
    >
      {children}
    </form>
  );
}
