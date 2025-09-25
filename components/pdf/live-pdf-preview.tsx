"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { pdf as buildPdf, Document as RPDFDocument } from "@react-pdf/renderer";
import { pdfjs, Document, Page } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { ComponentProps, ReactElement } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Accept exactly an @react-pdf/renderer <Document/>
type RendererDocElement = ReactElement<ComponentProps<typeof RPDFDocument>>;

type Props = {
  doc: RendererDocElement;
  maxWidth?: number;
  debounceMs?: number;
  transitionMs?: number;
  /** gap (px) between pages; keep in sync with your className gap */
  gapPx?: number;
  /** optional: constrain height to create an internal scroll area */
  maxHeight?: number | string; // e.g.  "70vh" or 800
  // zoom?: number;
};

type Slot = "alpha" | "beta";

export default function LivePdfPreview({
  doc,
  maxWidth = Infinity,
  debounceMs = 200,
  transitionMs = 300,
  gapPx = 16,
  maxHeight,
}: // zoom = 1,
Props) {
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  // Buffers now hold Blobs instead of object URLs
  const [fileAlpha, setFileAlpha] = useState<Blob | null>(null);
  const [fileBeta, setFileBeta] = useState<Blob | null>(null);

  // Force remounts when a new Blob arrives
  const [alphaVersion, setAlphaVersion] = useState(0);
  const [betaVersion, setBetaVersion] = useState(0);

  const [numPagesAlpha, setNumPagesAlpha] = useState<number>(0);
  const [numPagesBeta, setNumPagesBeta] = useState<number>(0);

  // NEW: page aspect ratios (height / width) for each buffer
  const [pageARAlpha, setPageARAlpha] = useState<number | null>(null);
  const [pageARBeta, setPageARBeta] = useState<number | null>(null);

  const [front, setFront] = useState<Slot>("alpha");
  const frontRef = useRef<Slot>(front);
  useEffect(() => {
    frontRef.current = front;
  }, [front]);
  const [fadeTo, setFadeTo] = useState<Slot | null>(null);

  const fadeTimerRef = useRef<number | null>(null);

  const documentOptions = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      standardFontDataUrl: "/standard_fonts/",
      // wasmUrl: '/wasm/',
    }),
    []
  );

  // ResizeObserver
  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) setContainerWidth(entry.contentRect.width);
  }, []);

  useEffect(() => {
    if (!containerEl || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(onResize);
    ro.observe(containerEl);
    return () => ro.disconnect();
  }, [containerEl, onResize]);

  // Debounced build into the *back* buffer
  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(async () => {
      // IMPORTANT: decide target using the ref, not state in deps
      const currentFront = frontRef.current;
      const target: Slot = currentFront === "alpha" ? "beta" : "alpha";

      const blob = await buildPdf(doc).toBlob();
      if (cancelled) return;

      if (target === "alpha") {
        setFileAlpha(blob);
        setAlphaVersion((v) => v + 1);
        setNumPagesAlpha(0);
        setPageARAlpha(null);
      } else {
        setFileBeta(blob);
        setBetaVersion((v) => v + 1);
        setNumPagesBeta(0);
        setPageARBeta(null);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(t);
      cancelled = true;
    };
    // ⬇️ front REMOVED from deps
  }, [doc, debounceMs]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const startCrossfade = useCallback(
    (to: Slot) => {
      if (to === front) return;
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      setFadeTo(to);

      fadeTimerRef.current = window.setTimeout(() => {
        setFront(to);
        setFadeTo(null);
        fadeTimerRef.current = null;

        // Release the old back buffer to save memory
        if (to === "alpha") {
          // alpha is now front → beta becomes back; we can drop beta if desired
          setFileBeta(null);
          setNumPagesBeta(0);
          setPageARBeta(null);
        } else {
          setFileAlpha(null);
          setNumPagesAlpha(0);
          setPageARAlpha(null);
        }
      }, transitionMs);
    },
    [front, transitionMs]
  );

  // Helper: after a Document loads, grab page 1 size to derive aspect ratio
  async function computeAspectRatio(pdf: PDFDocumentProxy): Promise<number> {
    const first = await pdf.getPage(1);
    const vp = first.getViewport({ scale: 1 });
    return vp.height / vp.width;
  }

  async function onLoadAlpha(pdf: PDFDocumentProxy) {
    setNumPagesAlpha(pdf.numPages);
    const ar = await computeAspectRatio(pdf);
    setPageARAlpha(ar);
    if (front !== "alpha") startCrossfade("alpha");
  }

  async function onLoadBeta(pdf: PDFDocumentProxy) {
    setNumPagesBeta(pdf.numPages);
    const ar = await computeAspectRatio(pdf);
    setPageARBeta(ar);
    if (front !== "beta") startCrossfade("beta");
  }

  function widthFromHeightLimit(
    pages: number,
    ar: number | null,
    gap: number,
    mh?: number
  ): number {
    if (!mh || pages <= 0 || !ar) return Infinity;
    // totalHeight = pages*(width*ar) + (pages-1)*gap  <= mh
    // width <= (mh - (pages-1)*gap) / (pages*ar)
    const usable = mh - Math.max(0, pages - 1) * gap;
    return usable > 0 ? usable / (pages * ar) : 0;
  }

  const alphaTarget =
    fadeTo === "alpha" ? 1 : fadeTo === "beta" ? 0 : front === "alpha" ? 1 : 0;
  const betaTarget =
    fadeTo === "beta" ? 1 : fadeTo === "alpha" ? 0 : front === "beta" ? 1 : 0;

  // If maxHeight is a string (e.g., '70vh'), we can't precompute height-fit width.
  const numericMaxHeight =
    typeof maxHeight === "number" ? maxHeight : undefined;

  // Height-fit width limits for each buffer (Infinity when unknown)
  const wFitAlpha = widthFromHeightLimit(
    numPagesAlpha,
    pageARAlpha,
    gapPx,
    numericMaxHeight
  );
  const wFitBeta = widthFromHeightLimit(
    numPagesBeta,
    pageARBeta,
    gapPx,
    numericMaxHeight
  );

  // Resolve a sensible container width fallback before the observer fires.
  const containerFallback =
    typeof window !== "undefined" ? Math.min(window.innerWidth, 1024) : 800;
  const resolvedContainerWidth =
    containerWidth ?? containerEl?.clientWidth ?? containerFallback;

  // Candidate width limited by container, prop, and height-fit caps
  const widthCandidate = Math.min(
    resolvedContainerWidth,
    maxWidth,
    wFitAlpha,
    wFitBeta
  );

  // Ensure width is always finite & positive
  const width =
    Number.isFinite(widthCandidate) && widthCandidate > 0
      ? widthCandidate
      : resolvedContainerWidth;

  // --- compute total document height(s) to drive a spacer ---
  const fallbackAR = 1.4142; // A-series ratio fallback (A4 ~ √2)

  // One-page height for each layer at the current width
  const pageHeightAlpha = width * (pageARAlpha ?? fallbackAR);
  const pageHeightBeta = width * (pageARBeta ?? fallbackAR);

  // Use the larger of the two so height doesn’t “pop” during crossfade
  const spacerHeight = Math.max(pageHeightAlpha, pageHeightBeta);

  return (
    <div ref={setContainerEl} style={{ width: "100%" }} className="relative">
      <div style={{ width }}>
        {/* Spacer ensures parent has at least one-page height and scrolls if needed */}
        <div style={{ height: spacerHeight }} aria-hidden />

        {/* ALPHA LAYER */}
        {fileAlpha && (
          <DocumentLayer
            opacityTarget={alphaTarget}
            height={spacerHeight}
            transitionMs={transitionMs}
            maxHeight={pageHeightAlpha}
          >
            <Document
              key={`alpha-${alphaVersion}`}
              file={fileAlpha} // ← pass Blob directly
              onLoadSuccess={onLoadAlpha}
              options={documentOptions}
              className="flex flex-col gap-4"
            >
              {Array.from({ length: numPagesAlpha }, (_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    width={width}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </DocumentLayer>
        )}

        {/* BETA LAYER */}
        {fileBeta && (
          <DocumentLayer
            opacityTarget={betaTarget}
            height={spacerHeight}
            transitionMs={transitionMs}
            maxHeight={pageHeightBeta}
          >
            <Document
              key={`beta-${betaVersion}`}
              file={fileBeta} // ← pass Blob directly
              onLoadSuccess={onLoadBeta}
              options={documentOptions}
              className="flex flex-col gap-4"
            >
              {Array.from({ length: numPagesBeta }, (_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    width={width}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </DocumentLayer>
        )}

        {!fileAlpha && !fileBeta && (
          <div style={{ width, height: 1 }} aria-hidden />
        )}
      </div>
    </div>
  );
}

function DocumentLayer({
  children,
  opacityTarget,
  height,
  transitionMs,
  maxHeight,
}: {
  children: React.ReactNode;
  opacityTarget: number;
  height: number;
  transitionMs: number;
  maxHeight?: number | string; // <- optional to match parent usage
}) {
  return (
    <div
      style={{
        opacity: opacityTarget,
        transition: `opacity ${transitionMs}ms ease`,
        pointerEvents: opacityTarget > 0.5 ? "auto" : "none",
        height, // full document stack height
        maxHeight: maxHeight, // cap internal scroll area if provided
        overflowY: "auto",
        scrollbarGutter: "stable",
        // scrollbarColor: "#cdcdcd #f1f5f9",
        scrollbarWidth: "thin",
        paddingRight: "0.5rem",
      }}
      className="absolute top-0 left-0"
    >
      {children}
    </div>
  );
}
