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
};

type Slot = "alpha" | "beta";

export default function LivePdfPreview({
  doc,
  maxWidth = 800,
  debounceMs = 200,
  transitionMs = 300,
}: Props) {
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
      } else {
        setFileBeta(blob);
        setBetaVersion((v) => v + 1);
        setNumPagesBeta(0);
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
        } else {
          setFileAlpha(null);
          setNumPagesAlpha(0);
        }
      }, transitionMs);
    },
    [front, transitionMs]
  );

  function onLoadAlpha({ numPages }: PDFDocumentProxy) {
    console.log("Changing to Alpha");
    setNumPagesAlpha(numPages);
    if (front !== "alpha") startCrossfade("alpha");
  }

  function onLoadBeta({ numPages }: PDFDocumentProxy) {
    console.log("Changing to Beta");
    setNumPagesBeta(numPages);
    if (front !== "beta") startCrossfade("beta");
  }

  const alphaTarget =
    fadeTo === "alpha" ? 1 : fadeTo === "beta" ? 0 : front === "alpha" ? 1 : 0;
  const betaTarget =
    fadeTo === "beta" ? 1 : fadeTo === "alpha" ? 0 : front === "beta" ? 1 : 0;

  const width = containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth;

  return (
    <div
      ref={setContainerEl}
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
      }}
    >
      {/* ALPHA LAYER */}
      {fileAlpha && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: alphaTarget,
            transition: `opacity ${transitionMs}ms ease`,
            pointerEvents: alphaTarget > 0.5 ? "auto" : "none",
          }}
        >
          <Document
            key={`alpha-${alphaVersion}`}
            file={fileAlpha} // ← pass Blob directly
            onLoadSuccess={onLoadAlpha}
            options={documentOptions}
          >
            {Array.from({ length: numPagesAlpha }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}

      {/* BETA LAYER */}
      {fileBeta && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: betaTarget,
            transition: `opacity ${transitionMs}ms ease`,
            pointerEvents: betaTarget > 0.5 ? "auto" : "none",
          }}
        >
          <Document
            key={`beta-${betaVersion}`}
            file={fileBeta} // ← pass Blob directly
            onLoadSuccess={onLoadBeta}
            options={documentOptions}
          >
            {Array.from({ length: numPagesBeta }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}

      {!fileAlpha && !fileBeta && (
        <div style={{ width, height: 1 }} aria-hidden />
      )}
    </div>
  );
}
