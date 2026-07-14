const styles = {
  base: "btn transition-all duration-200 ease-brand",
  variants: {
    solid: "btn-solid",
    prominent: "btn-solid btn-elevated",
    secondary: "btn-secondary",
    outline: "btn-outline",
    pine: "btn-pine",
    cream: "btn-cream",
    ghost: "bg-transparent text-ink hover:bg-black/5",
    soft: "bg-cream-deep text-brand hover:bg-cream",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-px",
    link: "rounded-none border-0 bg-transparent px-0 py-0 text-terra hover:text-terra-deep",
  },
  sizes: {
    xs: "gap-1.5 px-3 py-2 text-[12.5px] font-semibold",
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  },
  iconOnlySizes: {
    xs: "h-8 w-8 p-0",
    sm: "h-9 w-9 p-0",
    md: "h-11 w-11 p-0",
    lg: "h-14 w-14 p-0",
  },
  states: {
    block: "btn-block",
    iconOnly: "aspect-square",
    loading: "pointer-events-none opacity-65",
    disabled: "pointer-events-none opacity-65",
  },
  spinner: "animate-spin -ml-1 mr-2 h-4 w-4",
  spinnerOnly: "animate-spin h-4 w-4",
  icon: "shrink-0",
} as const;

export default styles;
