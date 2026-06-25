import { cn } from "@/lib/utils";

 const styles = {
  base: "btn transition-all duration-200 ease-brand",
  variants: {
    solid: "btn-solid",
    outline: "btn-outline",
    pine: "btn-pine",
    cream: "btn-cream",
    ghost: "bg-transparent hover:bg-black/5 text-ink",
  },
  sizes: {
    sm: "btn-sm",
    md: "",
    lg: "px-8 py-4 text-base",
  },
  states: {
    block: "btn-block",
    loading: "opacity-70 pointer-events-none",
  },
  spinner: "animate-spin -ml-1 mr-2 h-4 w-4",
} as const;

export default styles;