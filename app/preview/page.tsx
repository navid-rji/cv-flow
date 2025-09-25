"use client";

import { useMemo, useState } from "react";
import {
  LivePdfPreview,
  PDFDownloadLinkSmall,
  SimpleCVDocument,
} from "@/components/pdf";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

export default function Page() {
  const [title, setTitle] = useState("Alex Smith");
  const [showForm, setShowForm] = useState(true);
  // const [zoom, setZoom] = useState(1); // 100%

  // const zoomIn = () => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)));
  // const zoomOut = () => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)));
  // const reset = () => setZoom(1);

  const doc = useMemo(() => <SimpleCVDocument title={title} />, [title]);

  return (
    <div className={`relative flex flex-col gap-4 md:flex-row px-4 md:px-16`}>
      <div
        className="min-h-screen p-2 overflow-hidden transition-[flex-basis,opacity] duration-300"
        style={{
          flexBasis: showForm ? "50%" : "0%",
          opacity: showForm ? 1 : 0,
          pointerEvents: showForm ? "auto" : "none",
        }}
        aria-hidden={!showForm}
      >
        <input
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type a title…"
        />
      </div>

      <div
        className={`hidden lg:flex p-2 transition-all duration-300 ml-auto origin-right`}
        style={{ width: showForm ? "50%" : "100%" }}
      >
        {/* Make the whole viewer stick */}
        <div className="w-full lg:sticky lg:top-4 self-start">
          {/* Viewer shell */}
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/10 overflow-hidden">
            {/* Header / toolbar */}
            <div className="flex items-center justify-start px-4 py-2 border-b bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Maximize"
                  title="Maximize"
                  onClick={() => setShowForm((prev) => !prev)}
                  className="hover:scale-120 transition-transform duration-75"
                >
                  <Maximize2 size={14} strokeWidth={2} />
                </button>
                <span className="ml-3 text-sm font-medium text-slate-800">
                  CV.pdf
                </span>
              </div>

              {/* zoom controls */}
              {/* <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 text-sm rounded-md border border-slate-200 hover:bg-slate-50"
                  aria-label="Zoom out"
                  onClick={zoomOut}
                >
                  -
                </button>
                <span className="text-xs text-slate-600 tabular-nums w-16 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  className="px-2 py-1 text-sm rounded-md border border-slate-200 hover:bg-slate-50"
                  aria-label="Zoom in"
                  onClick={zoomIn}
                >
                  +
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded-md border border-slate-200 hover:bg-slate-50"
                  onClick={reset}
                  aria-label="Reset zoom"
                >
                  100%
                </button>
              </div> */}
            </div>

            {/* Paper backdrop + inner scroll area */}
            <div className="bg-background px-4 py-2 relative">
              {/* <div className="absolute top-0 left-0  backdrop-blur-lg w-full z-50 h-6" /> */}
              <div className="mx-auto w-full max-w-[920px]">
                {/* Let the preview itself scroll internally so the chrome stays put */}
                <LivePdfPreview
                  doc={doc}
                  transitionMs={100}
                  maxHeight="calc(100vh - 8rem)" /* header+padding space */
                  gapPx={16}
                />
              </div>
            </div>

            {/* Footer (optional) */}
            <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-slate-500">
              <span>Viewing • PDF</span>
              <div className="flex items-center gap-3">
                <Button
                  variant={"link"}
                  className="hover:no-underline underline-offset-auto text-xs text-slate-500 font-normal p-0"
                  asChild
                >
                  <PDFDownloadLinkSmall document={doc}>
                    <p className="hover:underline">Download</p>
                  </PDFDownloadLinkSmall>
                </Button>
                <span className="text-slate-400">|</span>
                <button className="hover:underline">Print</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
