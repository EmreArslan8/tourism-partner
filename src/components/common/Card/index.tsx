import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./styles";

type Variant = keyof typeof styles.variants;
type Padding = keyof typeof styles.body;
type ChipTone = keyof typeof styles.chip;

interface CardProps {
  children?: ReactNode;
  header?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  iconTone?: ChipTone;
  action?: ReactNode;
  footer?: ReactNode;
  variant?: Variant;
  padding?: Padding;
  interactive?: boolean;
  className?: string;
  bodyClassName?: string;
}

interface CardSlotProps {
  children?: ReactNode;
  className?: string;
}

interface CardContentProps extends CardSlotProps {
  padding?: Padding;
}

interface CardIconProps extends CardSlotProps {
  tone?: ChipTone;
}

/* Merkezi, theme'li Card. header/footer/content props olarak gelir; stil
   kararları styles.ts'te. Hem public hem admin sayfaları bundan beslenir. */
const Card = ({
  children,
  header,
  title,
  description,
  icon,
  iconTone = "blue",
  action,
  footer,
  variant = "default",
  padding = "md",
  interactive = false,
  className,
  bodyClassName,
}: CardProps) => {
  const hasHeader = header || title || action;

  return (
    <div className={cn(styles.base, styles.variants[variant], interactive && styles.interactive, className)}>
      {hasHeader &&
        (header ?? (
          <div className={styles.header}>
            <div className={styles.headerMain}>
              {icon && <span className={cn(styles.chipBox, styles.chip[iconTone])}>{icon}</span>}
              <div className="min-w-0">
                {title && <p className={styles.title}>{title}</p>}
                {description && <p className={styles.description}>{description}</p>}
              </div>
            </div>
            {action}
          </div>
        ))}

      {children != null && <div className={cn(styles.body[padding], bodyClassName)}>{children}</div>}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

const CardHeader = ({ children, className }: CardSlotProps) => (
  <div className={cn(styles.header, className)}>{children}</div>
);

const CardTitle = ({ children, className }: CardSlotProps) => (
  <p className={cn(styles.title, className)}>{children}</p>
);

const CardDescription = ({ children, className }: CardSlotProps) => (
  <p className={cn(styles.description, className)}>{children}</p>
);

const CardAction = ({ children, className }: CardSlotProps) => (
  <div className={className}>{children}</div>
);

const CardContent = ({ children, className, padding = "md" }: CardContentProps) => (
  <div className={cn(styles.body[padding], className)}>{children}</div>
);

const CardFooter = ({ children, className }: CardSlotProps) => (
  <div className={cn(styles.footer, className)}>{children}</div>
);

const CardIcon = ({ children, className, tone = "blue" }: CardIconProps) => (
  <span className={cn(styles.chipBox, styles.chip[tone], className)}>{children}</span>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardIcon,
};

export default Card;
