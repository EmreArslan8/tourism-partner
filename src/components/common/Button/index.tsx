"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import styles from "./styles";

type ButtonVariant = keyof typeof styles.variants;
type ButtonSize = keyof typeof styles.sizes;

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: any };

type Props = ButtonProps | AnchorProps;

const Button = ({
  variant = "solid",
  size = "md",
  block = false,
  loading = false,
  icon,
  children,
  className,
  ...props
}: Props) => {
  const baseClasses = cn(
    styles.base,
    styles.variants[variant],
    styles.sizes[size],
    block && styles.states.block,
    loading && styles.states.loading,
    className
  );

  const content = (
    <>
      {loading && (
        <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel, ...rest } = props as AnchorProps;
    const isStringHref = typeof href === "string";
    
    if (isStringHref && (href.startsWith("http") || href.startsWith("mailto:") || target === "_blank")) {
      return (
        <a 
          href={href} 
          target={target} 
          rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel} 
          className={baseClasses}
          {...rest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses} {...(rest as any)}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...rest } = props as ButtonProps;

  return (
    <button type={type} className={baseClasses} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
};

export default Button;
