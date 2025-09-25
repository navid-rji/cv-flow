"use client";
import React from "react";
import dynamic from "next/dynamic";
// import { pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";

import { Font } from "@react-pdf/renderer";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

Font.registerHyphenationCallback((word) => [word]); // no hyphenation

export { SimpleCVDocument } from "./simple/document";

export const PDFViewer = dynamic(
  async () => await import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  }
);

export const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button disabled>
        <Loader2 className="animate-spin" />
        Loading...
      </Button>
    ),
  }
);

export const PDFDownloadLinkSmall = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button className="text-xs text-slate-300">Loading...</button>
    ),
  }
);

export const LivePdfPreview = dynamic(() => import("./live-pdf-preview"), {
  ssr: false,
});
