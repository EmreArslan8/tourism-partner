import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./styles";

const PremiumPartnerBadge = ({ label = "Premium İş Ortağı", className }: { label?: string; className?: string }) => {
  return (
    <span className={cn(styles.base, className)}>
      <Crown strokeWidth={2.4} aria-hidden />
      {label}
    </span>
  );
};

export default PremiumPartnerBadge;
