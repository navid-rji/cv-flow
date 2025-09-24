import type React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section
      className={cn("max-w-7xl mx-auto w-full px-4 md:px-16", className)}
    >
      {children}
    </section>
  );
}
