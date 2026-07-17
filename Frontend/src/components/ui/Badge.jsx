import { cn } from "../../lib/utils";

function Badge({
  children,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        "border border-violet-500/20",
        "bg-violet-500/10",
        "px-4 py-1.5",
        "text-sm font-medium text-violet-300",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;