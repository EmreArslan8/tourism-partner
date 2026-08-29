import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./styles";

const PremiumPartnerBadge = ({
  label = "Premium Partner",
  className,
  variant = "default",
}: {
  label?: string;
  className?: string;
  variant?: "default" | "onImage";
}) => {
  return (
    <span className={cn(styles.base, variant === "onImage" ? styles.onImage : styles.default, className)}>
      <Star strokeWidth={2.4} fill="currentColor" aria-hidden />
      {label}
    </span>
  );
};

export default PremiumPartnerBadge;
