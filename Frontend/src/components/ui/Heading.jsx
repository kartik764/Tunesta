import { cn } from "../../lib/utils";

function Heading({
  title,
  subtitle,
  className,
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default Heading;