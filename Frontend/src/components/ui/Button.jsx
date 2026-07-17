import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20",

  secondary:
    "bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800",

  outline:
    "border border-violet-500 text-violet-400 hover:bg-violet-500/10",

  ghost:
    "text-zinc-300 hover:bg-zinc-800",

  danger:
    "bg-red-500 hover:bg-red-600 text-white",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-8 text-lg",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;