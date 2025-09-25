"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full px-6 py-4">
      <nav className="flex items-center justify-between mx-auto">
        <Link href="/" scroll={false}>
          <span className="text-xl font-bold text-foreground">CVflow</span>
        </Link>

        {/* <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            Templates
          </a>
          <a
            href="#"
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            Examples
          </a>
          <a
            href="#"
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            Tips
          </a>
          <a
            href="#"
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            About
          </a>
        </div> */}
        {pathname !== "/build" && (
          <a href="/build">
            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
              Create CV
            </Button>
          </a>
        )}
      </nav>
    </header>
  );
}
