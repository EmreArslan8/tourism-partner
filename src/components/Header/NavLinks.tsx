"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { Href } from "@/i18n/navigation";
import styles from "./styles";

type NavLink = { href: Href; label: string };

/* Aktif-link vurgusu pathname gerektirir → header'ın tek client adası. */
const NavLinks = ({ links }: { links: NavLink[] }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {links.map((link) => {
        const hrefObj = link.href as any;
        const isActive = pathname === hrefObj.pathname && !hrefObj.hash;

        return (
          <Link
            key={hrefObj.pathname + (hrefObj.hash || "")}
            href={link.href}
            scroll={!hrefObj.hash}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
