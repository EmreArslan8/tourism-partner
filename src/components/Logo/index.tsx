import Image from "next/image";
import { Link } from "@/i18n/navigation";

// logo.svg viewBox: 493.2 × 300.24 → en/boy oranı (= 685/417 ile aynı)
const RATIO = 493.2 / 300.24;

type Props = {
  href?: string | null;
  className?: string;
  height?: number;
  variant?: "brand" | "light";
  priority?: boolean;
};

function Img({ height = 100, variant = "brand", priority }: Omit<Props, "href" | "className">) {
  return (
    <Image
      src="/assets/logo.svg"
      alt="Tourism Partner"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
      className={variant === "light" ? "[filter:brightness(0)_invert(1)]" : ""}
    />
  );
}

export default function Logo({
  href = "/",
  className = "",
  height = 40,
  variant = "brand",
  priority,
}: Props) {
  if (href === null) {
    return (
      <span className={className} aria-label="Tourism Partner">
        <Img height={height} variant={variant} priority={priority} />
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label="Tourism Partner"
      className={`inline-flex shrink-0 items-center transition-transform duration-200 hover:-translate-y-px ${className}`}
    >
      <Img height={height} variant={variant} priority={priority} />
    </Link>
  );
}
