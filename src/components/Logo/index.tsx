import Image from "next/image";
import { Link, type Href } from "@/i18n/navigation";

// Marka lockup'ları (işaret + iki satır "TOURISM PARTNER"). Her varyantın
// kendi SVG'si var; light versiyon degradeyi filtrelemek yerine tek parça
// temiz beyaz işaret kullanır.
const VARIANTS = {
  brand: { src: "/assets/logo-light.svg", ratio: 497 / 199 },
  light: { src: "/assets/logo-dark.png", ratio: 482 / 181 },
} as const;

type Props = {
  href?: Href | null;
  className?: string;
  height?: number;
  variant?: "brand" | "light";
  priority?: boolean;
};

const Img = ({ height = 100, variant = "brand", priority }: Omit<Props, "href" | "className">) => {
  const image = (src: string, ratio: number, className?: string, scale = 1) => {
    const renderedHeight = Math.round(height * scale);

    return (
    <Image
      src={src}
      alt=""
      width={Math.round(renderedHeight * ratio)}
      height={renderedHeight}
      priority={priority}
      className={className}
      style={{ height: renderedHeight, width: "auto" }}
    />
    );
  };

  if (variant === "light") {
    return image(VARIANTS.light.src, VARIANTS.light.ratio, undefined, 0.88);
  }

  return (
    <>
      {image(VARIANTS.brand.src, VARIANTS.brand.ratio, "block dark:hidden")}
      {image(VARIANTS.light.src, VARIANTS.light.ratio, "hidden dark:block", 0.88)}
    </>
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
      <span className={className} role="img" aria-label="Tourism Partner">
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
