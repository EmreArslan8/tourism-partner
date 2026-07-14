import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  titleAs?: ElementType;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descClassName?: string;
};

const SectionHeader = ({
  eyebrow,
  title,
  desc,
  titleAs: Title = "h2",
  className,
  eyebrowClassName,
  titleClassName,
  descClassName,
}: SectionHeaderProps) => {
  if (!eyebrow && !title && !desc) return null;

  return (
    <div className={cn("section-copy", className)}>
      {eyebrow ? <span className={cn(!eyebrowClassName && "eyebrow mb-2", eyebrowClassName)}>{eyebrow}</span> : null}
      {title ? <Title className={cn(!titleClassName && "heading-section text-ink", titleClassName)}>{title}</Title> : null}
      {desc ? <p className={cn(!descClassName && "section-desc max-w-[60ch]", descClassName)}>{desc}</p> : null}
    </div>
  );
};

export default SectionHeader;
