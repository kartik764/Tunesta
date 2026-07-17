import { cn } from "../../lib/utils";
import Container from "./Container";

function Section({
  children,
  className,
}) {
  return (
    <section className={cn("py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export default Section;