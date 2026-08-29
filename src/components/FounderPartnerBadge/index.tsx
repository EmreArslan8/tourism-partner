import { cn } from "@/lib/utils";
import InteractiveBusinessBadge from "@/components/InteractiveBusinessBadge";
import styles from "./styles";

const FounderPartnerBadge = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => (
  <InteractiveBusinessBadge
    label={label}
    className={cn(styles.base, className)}
  >
    <svg viewBox="0 0 48 54" aria-hidden>
      <path d="M13 30v18l11-5 11 5V30Z" fill="#ffb957" />
      <path d="M17.5 32.5v8.7l6.5-3 6.5 3v-8.7Z" fill="#0e2745" />
      <circle cx="24" cy="20" r="16" fill="#0e2745" stroke="#ffb957" strokeWidth="5" />
      <path d="m24 9 3.2 6.5 7.2 1-5.2 5 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5 7.2-1Z" fill="#ffb957" />
    </svg>
  </InteractiveBusinessBadge>
);

export default FounderPartnerBadge;
