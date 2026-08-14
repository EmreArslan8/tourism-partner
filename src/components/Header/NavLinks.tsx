"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import styles from "./styles";

type NavHref = Extract<Href, { pathname: string }>;
type NavLink = { href: NavHref; label: string };

/* Aktif-link vurgusu pathname gerektirir → header'ın tek client adası. */
const NavLinks = ({ links, onLight = false }: { links: NavLink[]; onLight?: boolean }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {links.map((link) => {
        const isActive = pathname === link.href.pathname && !link.href.hash;

        return (
          <Link
            key={link.href.pathname + (link.href.hash || "")}
            href={link.href}
            scroll={!link.href.hash}
            className={`${styles.navLink} ${onLight ? styles.navLinkOnHero : ""} ${isActive ? (onLight ? styles.navLinkActiveOnHero : styles.navLinkActive) : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
