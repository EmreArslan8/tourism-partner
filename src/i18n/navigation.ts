import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/* Locale-bilinçli gezinme yardımcıları — next/link/useRouter yerine bunlar kullanılır. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
