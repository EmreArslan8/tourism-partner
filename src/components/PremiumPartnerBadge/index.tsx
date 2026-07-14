import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./styles";

const PremiumPartnerBadge = ({ label = "Premium Partner", className }: { label?: string; className?: string }) => {
  return (
    <span className={cn(styles.base, className)}>
      <Star strokeWidth={2.4} fill="currentColor" aria-hidden />
      {label}
    </span>
  );
};

export default PremiumPartnerBadge;
