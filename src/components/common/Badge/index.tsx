import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./styles";

type BadgeVariant = keyof typeof styles.variants;

interface Props {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const Badge = ({ variant = "default", children, className }: Props) => {
  return (
    <span className={cn(styles.base, styles.variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
