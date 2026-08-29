import { cn } from "@/lib/utils";
import FounderPartnerBadge from "@/components/FounderPartnerBadge";
import PremiumPartnerBadge from "@/components/PremiumPartnerBadge";
import VerifiedBusinessBadge from "@/components/VerifiedBusinessBadge";

type BadgeSize = "sm" | "md" | "lg";
type BadgeMode = "identity" | "premium" | "all";

const founderSizes: Record<BadgeSize, string> = {
  sm: "!h-6 !w-[22px]",
  md: "!h-7 !w-[25px]",
  lg: "!h-9 !w-[33px]",
};

const BusinessBadges = ({
  verified,
  founderPartner,
  sponsored,
  labels,
  mode = "all",
  size = "md",
  premiumVariant = "default",
  className,
  verifiedClassName,
  founderClassName,
  premiumClassName,
}: {
  verified?: boolean;
  founderPartner?: boolean;
  sponsored?: boolean;
  labels: { verified: string; founder: string; premium: string };
  mode?: BadgeMode;
  size?: BadgeSize;
  premiumVariant?: "default" | "onImage";
  className?: string;
  verifiedClassName?: string;
  founderClassName?: string;
  premiumClassName?: string;
}) => {
  const showIdentity = mode === "identity" || mode === "all";
  const showPremium = mode === "premium" || mode === "all";
  const hasBadge = (showIdentity && (verified || founderPartner)) || (showPremium && sponsored);
  if (!hasBadge) return null;

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      {showIdentity && verified && (
        <VerifiedBusinessBadge label={labels.verified} size={size} className={verifiedClassName} />
      )}
      {showIdentity && founderPartner && (
        <FounderPartnerBadge
          label={labels.founder}
          className={cn(founderSizes[size], founderClassName)}
        />
      )}
      {showPremium && sponsored && (
        <PremiumPartnerBadge
          label={labels.premium}
          variant={premiumVariant}
          className={premiumClassName}
        />
      )}
    </span>
  );
};

export default BusinessBadges;
