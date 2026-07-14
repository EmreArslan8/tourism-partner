import type { ReactNode } from "react";
import type { SocialPlatform } from "@/lib/types";

/* Sosyal medya marka ikonları — lucide brand ikonlarını kaldırdığı için inline SVG.
   Hem işletme profilinde hem footer'daki platform hesaplarında kullanılır. */

export type SocialIconProps = { size?: number; "aria-hidden"?: boolean };

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const InstagramIcon = ({ size = 17, ...rest }: SocialIconProps) => (
  <svg {...svgProps(size)} {...rest}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 17, ...rest }: SocialIconProps) => (
  <svg {...svgProps(size)} {...rest}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const LinkedinIcon = ({ size = 17, ...rest }: SocialIconProps) => (
  <svg {...svgProps(size)} {...rest}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A6 6 0 0 1 16 8z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const YoutubeIcon = ({ size = 17, ...rest }: SocialIconProps) => (
  <svg {...svgProps(size)} {...rest}>
    <path d="M22.5 12s0-3.4-.4-5a2.8 2.8 0 0 0-2-2C18.5 4.5 12 4.5 12 4.5s-6.5 0-8.1.5a2.8 2.8 0 0 0-2 2c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.8 2.8 0 0 0 2 2c1.6.5 8.1.5 8.1.5s6.5 0 8.1-.5a2.8 2.8 0 0 0 2-2c.4-1.6.4-5 .4-5z" />
    <path d="m9.8 15.2 5.4-3.2-5.4-3.2z" fill="currentColor" stroke="none" />
  </svg>
);

export const XIcon = ({ size = 17, ...rest }: SocialIconProps) => (
  <svg {...svgProps(size)} {...rest}>
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

export const SOCIAL_ICONS: Record<SocialPlatform, (p: SocialIconProps) => ReactNode> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  x: XIcon,
};
