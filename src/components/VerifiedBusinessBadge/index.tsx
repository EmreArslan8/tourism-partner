import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-5 w-5 [&_svg]:h-5 [&_svg]:w-5",
  md: "h-6 w-6 [&_svg]:h-6 [&_svg]:w-6",
  lg: "h-8 w-8 [&_svg]:h-[30px] [&_svg]:w-[30px]",
} as const;

const VerifiedBusinessBadge = ({
  label,
  size = "md",
  className,
}: {
  label: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-grid shrink-0 place-items-center text-white drop-shadow-[0_2px_3px_rgba(120,78,8,.18)]",
      sizeClasses[size],
      className,
    )}
    title={label}
    aria-label={label}
  >
    <BadgeCheck fill="#c89422" strokeWidth={2.25} aria-hidden />
  </span>
);

export default VerifiedBusinessBadge;
