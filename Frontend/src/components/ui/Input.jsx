import { cn } from "../../lib/utils";

function Input({
  className,
  ...props
}) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-white/10",
        "bg-zinc-900/70",
        "px-4",
        "text-white",
        "placeholder:text-zinc-500",
        "outline-none",
        "transition-all",
        "focus:border-violet-500",
        "focus:ring-2",
        "focus:ring-violet-500/20",
        className
      )}
      {...props}
    />
  );
}

export default Input;