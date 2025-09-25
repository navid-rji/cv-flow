import React from "react";

import { Header } from "@/components/header";
import { Section } from "@/components/section";

function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Section>
        <div className="w-full min-h-screen flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-center text-black font-semibold">
            Under construction...
          </h1>
        </div>
      </Section>
    </div>
  );
}

export default Page;
