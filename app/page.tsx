import React from "react";
import { Header } from "@/components/header";
import { ScrollSection } from "@/components/scroll-section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Particles } from "@/components/ui/particles";

import {
  Sparkles,
  Wand2,
  CheckCircle2,
  PenTool,
  Rocket,
  MousePointerClick,
} from "lucide-react";

export default function Home() {
  const faqs = [
    {
      q: "Is CVflow really free?",
      a: "Yes. CVflow is free and will always be free. No hidden fees, no locked exports.",
    },
    {
      q: "How many templates are there?",
      a: "Right now there’s one carefully-designed template that works for most roles. We’ll add more over time—still free.",
    },
    {
      q: "Is the template ATS-friendly?",
      a: "Yes. The layout and structure are designed to parse well while staying human-readable.",
    },
    {
      q: "Do I need an account to export?",
      a: "No. You can build and export a PDF without creating an account.",
    },
    {
      q: "Can I customize section order?",
      a: "Yes. You can easily reorder or hide sections to match your story.",
    },
    {
      q: "Which file formats can I download?",
      a: "Currently you can export high-quality PDFs—perfect for applications.",
    },
    {
      q: "Does CVflow work on mobile?",
      a: "Absolutely. The builder is responsive, so you can create and edit from any device.",
    },
    {
      q: "Will more templates be added?",
      a: "Yes. As CVflow grows, we’ll keep releasing new templates—still free.",
    },
    {
      q: "Can I use CVflow for cover letters too?",
      a: "At the moment CVflow focuses on CVs, but cover letter support is on our roadmap.",
    },
    {
      q: "Is my data saved online?",
      a: "Your CV content stays local in your browser. No sign‑up required, no cloud lock‑in.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center px-16 pt-8">
          <Particles
            className="absolute inset-0 z-0"
            quantity={75}
            ease={80}
            size={0.1}
            color={"#000000"}
            refresh
          />
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black text-foreground leading-[0.9] text-balance uppercase">
                  CREATE YOUR PERFECT CV
                </h1>
                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  CVflow is a fast, focused CV builder. Simply add your
                  experience and export a polished CV — free today, free
                  forever. No trials, no paywalls, no watermarks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-8"
                  >
                    Start Creating
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 bg-transparent"
                  >
                    View Templates
                  </Button> */}
                </div>
              </div>
              {/* Hero mockup placeholder */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl border bg-muted/30 grid place-items-center">
                  <div className="text-center p-8">
                    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Sparkles className="h-4 w-4" /> Live Preview
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold">
                      Template Showcase
                    </h3>
                    <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                      Drop a product screenshot here later. For now, this
                      placeholder highlights where your CV preview will live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Comfortable gap between hero and the next section */}
        <div className="mt-16 md:mt-24" />

        {/* Value Props */}
        <ScrollSection
          className="relative z-10 py-20 px-16 bg-black"
          roundedTop
        >
          <div className="max-w-7xl mx-auto dark">
            <div className="text-center mt-8 mb-16">
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Everything you need.
                <br />
                Nothing you don’t.
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                CVflow is intentionally simple, so you can focus on content —
                not fiddly design tools. Add sections, edit inline, and export a
                crisp PDF that hiring managers can actually read.
              </p>
            </div>

            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
              <FeatureCard
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={
                  <Wand2 className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Effortless editing"
                description="Inline fields, smart spacing, and instant preview keep you in flow."
              />
              {/* <FeatureCard
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={
                  <LayoutTemplate className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Clean template"
                description="One template, carefully tuned for readability and ATS parsing."
              /> */}
              <FeatureCard
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={
                  <PenTool className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Content first"
                description="Structured sections help you tell a clear, impact-driven story."
              />
              <FeatureCard
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={
                  <Rocket className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Fast exports"
                description="Generate pixel-perfect PDFs in seconds — no watermarks, ever."
              />
              <FeatureCard
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={
                  <MousePointerClick className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Zero learning curve"
                description="Start typing immediately. Move, rename, and hide sections easily."
              />
              <FeatureCard
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={
                  <CheckCircle2 className="h-4 w-4 text-black dark:text-neutral-400" />
                }
                title="Free forever"
                description="No paywalls. No credit card. The builder you can actually rely on."
              />
            </ul>

            <div className="text-center mt-46 mb-16">
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-6">
                From blank page to hired.
                <br />
                Three simple steps.
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                CVflow trims the busywork. Create a sharp CV you’re proud of in
                less time than your coffee break.
              </p>
            </div>
            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-3  lg:gap-4 xl:max-h-[34rem]">
              <StepCard
                step="01"
                title="Add your details"
                desc="Fill in essentials: experience, education, skills, links."
              />
              <StepCard
                step="02"
                title="Polish the story"
                desc="Reorder sections, tighten bullets, and highlight impact."
              />
              <StepCard
                step="03"
                title="Export and apply"
                desc="Download a crisp PDF and send it with confidence."
              />
            </ul>
            {/* <div className="mt-10 w-full flex items-center justify-center">
              <Button size="lg" className="rounded-full px-8">
                Start Creating
              </Button>
            </div> */}
          </div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center mt-46">
            <div className="space-y-4">
              <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">
                Your next role starts with a sharp CV
              </h2>
              <p className="text-gray-300 text-lg">
                Create, refine, and export—without distractions or paywalls.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-8"
                >
                  Create my CV now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 bg-transparent border-background/40 text-background"
                >
                  Explore the template
                </Button>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] rounded-2xl bg-background/10 border border-background/20 grid place-items-center">
                <div className="text-center px-8">
                  <h3 className="text-white text-xl font-semibold">
                    Live editor preview
                  </h3>
                  <p className="mt-2 text-gray-300 max-w-sm">
                    Replace this with a GIF or screenshot of the editing flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>

        {/* FAQ */}
        <div className="w-full pt-24 bg-black">
          <ScrollSection className="py-24 px-16 bg-background" roundedTop>
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Left column: title + CTA */}
              <div className="flex flex-col justify-start">
                <div className="mb-10 md:mb-12">
                  <h2 className="text-black text-4xl md:text-5xl font-bold text-balance tracking-tight mb-6">
                    Frequently asked questions.
                  </h2>
                  <p className="text-muted-foreground max-w-xl">
                    Quick answers about CVflow.
                  </p>
                </div>

                <div>
                  <Button size="lg" className="rounded-full px-8 w-fit">
                    Start for free
                  </Button>
                </div>
              </div>

              {/* Right column: accordion */}
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Your next role starts with a sharp CV
                </h2>
                <p className="text-lg opacity-90">
                  Create, refine, and export—without distractions or paywalls.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Create my CV now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 bg-transparent border-background/40 text-background"
                  >
                    Explore the template
                  </Button>
                </div>
              </div>
              <div>
                <div className="aspect-[4/3] rounded-2xl bg-background/10 border border-background/20 grid place-items-center">
                  <div className="text-center px-8">
                    <h3 className="text-xl font-semibold">
                      Live editor preview
                    </h3>
                    <p className="mt-2 opacity-80 max-w-sm">
                      Replace this with a GIF or screenshot of the editing flow.
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </ScrollSection>
        </div>

        {/* Final CTA */}
        {/* <ScrollSection
          className="py-24 px-6 bg-foreground text-background"
          roundedTop
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Your next role starts with a sharp CV
              </h2>
              <p className="text-lg opacity-90">
                Create, refine, and export—without distractions or paywalls.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-8"
                >
                  Create my CV now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 bg-transparent border-background/40 text-background"
                >
                  Explore the template
                </Button>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] rounded-2xl bg-background/10 border border-background/20 grid place-items-center">
                <div className="text-center px-8">
                  <h3 className="text-xl font-semibold">Live editor preview</h3>
                  <p className="mt-2 opacity-80 max-w-sm">
                    Replace this with a GIF or screenshot of the editing flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection> */}

        <footer className="px-6 py-12 text-sm text-muted-foreground">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} CVflow. Free forever.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({
  area,
  icon,
  title,
  description,
}: {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <li className={`min-h-[14rem] list-none`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {/* <div className="w-fit rounded-lg border border-gray-600 p-2">
              {step}
            </div> */}
            <p className="font-mono tracking-wider text-xl/[1.375rem] text-black md:text-2xl/[1.875rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
              {step}
            </p>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {desc}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
