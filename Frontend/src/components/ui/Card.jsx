import { cn } from "../../lib/utils";

function Card({
  children,
  className,
  hover = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#171720]/80 backdrop-blur-xl",
        "shadow-[0_10px_30px_rgba(0,0,0,.35)]",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#1E1E2B]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;