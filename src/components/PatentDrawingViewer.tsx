import React, { useState } from "react";
import { PatentDrawing, PatentDrawingShape } from "../types";
import { Eye, Grid, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PatentDrawingViewerProps {
  drawings: PatentDrawing[];
}

export default function PatentDrawingViewer({ drawings }: PatentDrawingViewerProps) {
  const [activeFigIndex, setActiveFigIndex] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(1);

  if (!drawings || drawings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
        <Eye className="w-10 h-10 stroke-[1.5] text-gray-400 mb-2 animate-pulse" />
        <p className="text-sm font-medium">No Indian patent drawings generated yet</p>
        <p className="text-xs text-gray-400 mt-1">Complete your patent drafting to generate vector line-art</p>
      </div>
    );
  }

  const activeDrawing = drawings[activeFigIndex] || drawings[0];
  const [copiedSVG, setCopiedSVG] = useState<boolean>(false);

  const handleCopySVGCodeSource = () => {
    const svgElement = document.getElementById(`patent-svg-active`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    navigator.clipboard.writeText(svgString);
    setCopiedSVG(true);
    setTimeout(() => setCopiedSVG(false), 2000);
  };

  const handleDownloadSVG = () => {
    // Generate standard serialized SVG source of the active drawing
    const svgElement = document.getElementById(`patent-svg-active`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    // Create hidden link and click it
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDrawing.figureId.toLowerCase().replace(/\s+/g, "_")}_indian_patent_drawing.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
      {/* Viewer Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white border-b border-slate-200 gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {activeDrawing.figureId}
          </span>
          <h4 className="text-sm font-semibold text-slate-800 tracking-tight">
            {activeDrawing.title}
          </h4>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto">
          {/* Grid Blueprint Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Drafting Grid Guidelines"
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              showGrid
                ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Grid Guides</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.2))}
              title="Zoom Out"
              className="p-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs px-2 text-slate-500 font-mono select-none">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(Math.min(2, zoomScale + 0.2))}
              title="Zoom In"
              className="p-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              title="Reset Zoom"
              className="p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            title="Export Clean Patent-Compliant SVG Drawing"
            className="p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>

          {/* Copy SVG XML */}
          <button
            onClick={handleCopySVGCodeSource}
            title="Copy Raw XML/SVG text to clipboard"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-sm cursor-pointer border ${
              copiedSVG
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2500/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>{copiedSVG ? "Copied!" : "Copy Source"}</span>
          </button>
        </div>
      </div>

      {/* Figures Switcher Tab Row */}
      {drawings.length > 1 && (
        <div className="flex items-center gap-1 bg-slate-100 border-b border-slate-200 px-4 py-1.5 overflow-x-auto">
          {drawings.map((draw, idx) => (
            <button
              key={draw.figureId}
              onClick={() => {
                setActiveFigIndex(idx);
                setZoomScale(1);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-all shrink-0 ${
                activeFigIndex === idx
                  ? "bg-white border-slate-300 text-indigo-700 font-semibold shadow-sm"
                  : "bg-transparent border-transparent text-slate-600 hover:bg-slate-200"
              }`}
            >
              {draw.figureId} Specification
            </button>
          ))}
        </div>
      )}

      {/* SVG Container Stage */}
      <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center min-h-[400px]">
        {/* Render Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-40 select-none bg-blueprint-grid"></div>
        )}

        {/* Paper Sheet Representation */}
        <div
          className="relative transition-transform duration-200 ease-out flex flex-col bg-white border border-slate-300 shadow-md p-6 max-w-full"
          style={{
            width: "600px",
            minHeight: "450px",
            transform: `scale(${zoomScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Top header lines for filing compliance */}
          <div className="w-full flex justify-between text-[9px] font-mono tracking-wider uppercase text-slate-400 border-b border-slate-100 pb-2 mb-2">
            <span>INDIAN PATENT APPLICATION SYSTEM</span>
            <span>SHEET {activeFigIndex + 1} OF {drawings.length}</span>
          </div>

          {/* SVG Frame */}
          <div className="flex-1 flex items-center justify-center p-2 border border-slate-100 bg-white relative">
            <svg
              id="patent-svg-active"
              viewBox="0 0 600 400"
              className="w-full h-auto select-none font-sans"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* White base canvas */}
              <rect width="600" height="400" fill="#FFFFFF" />

              {/* Shapes rendering */}
              {(activeDrawing.shapes || []).map((shape: PatentDrawingShape, index: number) => {
                const strokeColor = "#000000";
                const strokeWidth = shape.isPointer ? 1 : 1.7;

                switch (shape.type) {
                  case "line":
                    return (
                      <line
                        key={index}
                        x1={shape.x1}
                        y1={shape.y1}
                        x2={shape.x2}
                        y2={shape.y2}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={shape.isPointer ? "3,3" : undefined}
                      />
                    );
                  case "rect":
                    return (
                      <rect
                        key={index}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                    );
                  case "circle":
                    return (
                      <circle
                        key={index}
                        cx={shape.cx}
                        cy={shape.cy}
                        r={shape.r}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                    );
                  case "path":
                    return (
                      <path
                        key={index}
                        d={shape.d}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                    );
                  case "text":
                    // If it is a coordinate label, style as clean technical sans or mono
                    const isNumericLabel = /^\d+$/.test(shape.text?.trim() || "");
                    return (
                      <g key={index}>
                        {isNumericLabel && (
                          <rect
                            x={(shape.x || 0) - 2}
                            y={(shape.y || 0) - 9}
                            width={(shape.text?.length || 1) * 7.5 + 4}
                            height="12"
                            fill="#FFFFFF"
                            stroke="#000000"
                            strokeWidth="0.5"
                            rx="2"
                            className="text-rect-label"
                          />
                        )}
                        <text
                          x={shape.x}
                          y={shape.y}
                          fill="#000000"
                          fontSize={isNumericLabel ? "9px" : "11px"}
                          fontFamily={isNumericLabel ? "Courier, monospace" : "inherit"}
                          fontWeight={isNumericLabel ? "bold" : "normal"}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {shape.text}
                        </text>
                      </g>
                    );
                  default:
                    return null;
                }
              })}
            </svg>
          </div>

          {/* Centered Caption at Bottom */}
          <div className="w-full text-center mt-3 pt-3 border-t border-slate-100 flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-wider text-slate-800 uppercase font-mono">
              {activeDrawing.figureId}
            </span>
            <span className="text-[10px] text-slate-500 italic max-w-sm mx-auto text-center line-clamp-1">
              {activeDrawing.title}
            </span>
          </div>
        </div>
      </div>

      {/* Guide Note Box */}
      <div className="bg-amber-50/50 border-t border-slate-200 px-4 py-3 text-xs text-slate-600 flex items-start gap-2">
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-amber-800 uppercase shrink-0">
          Indian Standard
        </span>
        <p className="leading-relaxed">
          Drawings are modeled in high-contrast line-art on standard white sheets.
          The reference numerals matching bracketed highlights in your specification draft (e.g., 
          <strong>10</strong>, <strong>12</strong>) are called out via dashed leader arrays for optimal examiner legibility.
        </p>
      </div>
    </div>
  );
}
