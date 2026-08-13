import Image from "next/image";
import { Link, type Href } from "@/i18n/navigation";

// Marka lockup'ları (işaret + iki satır "TOURISM PARTNER"). Her varyantın
// kendi SVG'si var; light versiyon degradeyi filtrelemek yerine tek parça
// temiz beyaz işaret kullanır.
const VARIANTS = {
  brand: { src: "/assets/logo.svg", ratio: 590.6 / 213.09 },
  light: { src: "/assets/logo-white.svg", ratio: 595.6 / 217.09 },
} as const;

type Props = {
  href?: Href | null;
  className?: string;
  height?: number;
  variant?: "brand" | "light";
  priority?: boolean;
};

const Img = ({ height = 100, variant = "brand", priority }: Omit<Props, "href" | "className">) => {
  const { src, ratio } = VARIANTS[variant];
  return (
    <Image
      src={src}
      alt="Tourism Partner"
      width={Math.round(height * ratio)}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );
};

const Logo = ({
  href = "/",
  className = "",
  height = 40,
  variant = "brand",
  priority,
}: Props) => {
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
};

export default Logo;
