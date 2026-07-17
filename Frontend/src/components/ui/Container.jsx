import { cn } from "../../lib/utils";

function Container({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Container;