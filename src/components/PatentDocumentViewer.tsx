import React, { useState } from "react";
import { PatentSpecification } from "../types";
import { FileText, Copy, Check, Download, Landmark, ArrowRight } from "lucide-react";

interface PatentDocumentViewerProps {
  specifications: PatentSpecification;
  selectedTab?: "complete" | "description" | "claims" | "abstract";
  onTabChange?: (tab: "complete" | "description" | "claims" | "abstract") => void;
}

export default function PatentDocumentViewer({ 
  specifications,
  selectedTab: controlledTab,
  onTabChange
}: PatentDocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [internalTab, setInternalTab] = useState<"complete" | "description" | "claims" | "abstract">("complete");

  const selectedTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setSelectedTab = onTabChange !== undefined ? onTabChange : setInternalTab;

  const buildPlainDraftText = () => {
    const {
      title,
      fieldOfTheInvention,
      backgroundToTheInvention,
      objectivesOfInvention,
      briefDescriptionOfDrawings,
      detailedDescription,
      claims,
      abstractText,
      abstractFigureNumber,
    } = specifications;

    return `FORM 2
THE PATENTS ACT, 1970
(39 OF 1970)
&
THE PATENTS RULES, 2003

COMPLETE SPECIFICATION
(See section 10; rule 13)

1. TITLE OF THE INVENTION:
"${title.toUpperCase()}"

2. APPLICANT(S):
NAME: Vallanat, Vallanat
NATIONALITY: Indian
ADDRESS: India

3. PREAMBLE TO THE DESCRIPTION:
The following specification particularly describes the invention and the manner in which it is to be performed.

4. DESCRIPTION:

TITLE OF THE INVENTION
${title}

FIELD OF THE INVENTION
${fieldOfTheInvention}

BACKGROUND TO THE INVENTION
${backgroundToTheInvention}

OBJECTIVES OF THE INVENTION
${objectivesOfInvention.primary}
${objectivesOfInvention.secondary}
${objectivesOfInvention.terrestrial}
${objectivesOfInvention.further}
${objectivesOfInvention.closing}

BRIEF DESCRIPTION OF THE DRAWINGS
${briefDescriptionOfDrawings.join("\n\n")}

DETAILED DESCRIPTION
${detailedDescription.join("\n\n")}

5. CLAIMS
${claims.map((claim, idx) => `Claim ${idx + 1}: ${claim}`).join("\n\n")}

6. ABSTRACT
"${title}"
Abstract:
${abstractText}
${abstractFigureNumber}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPlainDraftText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = () => {
    const {
      title,
      fieldOfTheInvention,
      backgroundToTheInvention,
      objectivesOfInvention,
      briefDescriptionOfDrawings,
      detailedDescription,
      claims,
      abstractText,
      abstractFigureNumber,
    } = specifications;

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xml:lang="en"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 8.5in 11in;
            margin: 1.0in 1.0in 1.0in 1.0in;
            mso-header-margin: 0.5in;
            mso-footer-margin: 0.5in;
            mso-paper-source: 0;
          }
          body {
            font-family: "Calibri", "Arial", "sans-serif";
            font-size: 11pt;
            line-height: 1.5;
            color: #000000;
          }
          h1 {
            font-family: "Calibri", "Arial", sans-serif;
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-top: 24pt;
            margin-bottom: 12pt;
            text-transform: uppercase;
          }
          h2 {
            font-family: "Calibri", "Arial", sans-serif;
            font-size: 13pt;
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 6pt;
            border-bottom: 1px solid #777;
            padding-bottom: 3pt;
            text-transform: uppercase;
          }
          .form-header {
            text-align: center;
            margin-bottom: 24pt;
            border-bottom: 3px double #000;
            padding-bottom: 12pt;
          }
          .form-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 4pt;
          }
          .form-subtitle {
            font-size: 11pt;
            font-weight: bold;
            color: #444;
            margin-bottom: 12pt;
          }
          .meta-box {
            border: 1px solid #000;
            padding: 12pt;
            margin-bottom: 24pt;
            background-color: #fcfcfc;
          }
          .meta-title {
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 8pt;
            margin-bottom: 2pt;
            font-size: 10pt;
            color: #111;
          }
          p {
            margin-bottom: 10pt;
            text-align: justify;
            text-justify: inter-word;
          }
          .bullet-item {
            margin-left: 20pt;
            margin-bottom: 8pt;
            text-align: justify;
          }
          .claim-item {
            margin-left: 30pt;
            text-indent: -30pt;
            margin-bottom: 12pt;
            text-align: justify;
          }
          .abstract-container {
            border: 1px solid #bbb;
            padding: 12pt;
            background-color: #fafafa;
            margin-top: 12pt;
          }
          .signature-section {
            width: 100%;
            margin-top: 50pt;
            border-collapse: collapse;
          }
          .signature-section td {
            vertical-align: bottom;
            font-size: 10pt;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="form-header">
          <div class="form-title">FORM 2</div>
          <div class="form-subtitle">THE PATENTS ACT, 1970<br/>(39 of 1970)<br/>&<br/>THE PATENTS RULES, 2003</div>
          <div style="font-size: 10pt; font-style: italic;">COMPLETE SPECIFICATION<br/>(See section 10 and rule 13)</div>
        </div>

        <div class="meta-box">
          <div class="meta-title" style="margin-top: 0;">1. TITLE OF THE INVENTION</div>
          <div style="margin-left: 12pt; font-weight: bold; font-family: monospace;">"${title.toUpperCase()}"</div>
          
          <div class="meta-title">2. APPLICANT(S)</div>
          <div style="margin-left: 12pt;">
            <strong>Name:</strong> Vallanat, Vallanat<br/>
            <strong>Nationality:</strong> Indian<br/>
            <strong>Address:</strong> India
          </div>

          <div class="meta-title">3. PREAMBLE TO THE DESCRIPTION</div>
          <div style="margin-left: 12pt; font-style: italic;">
            The following specification particularly describes the invention and the manner in which it is to be performed.
          </div>
        </div>

        <h1>${title}</h1>

        <h2>FIELD OF THE INVENTION</h2>
        <p>${fieldOfTheInvention}</p>

        <h2>BACKGROUND TO THE INVENTION</h2>
        <p>${backgroundToTheInvention}</p>

        <h2>OBJECTIVES OF THE INVENTION</h2>
        <p><strong>Primary:</strong> ${objectivesOfInvention.primary}</p>
        <p><strong>Secondary:</strong> ${objectivesOfInvention.secondary}</p>
        ${objectivesOfInvention.terrestrial ? `<p><strong>Apparatus Objective:</strong> ${objectivesOfInvention.terrestrial}</p>` : ""}
        ${objectivesOfInvention.further ? `<p><strong>Operability Objective:</strong> ${objectivesOfInvention.further}</p>` : ""}
        <p style="color: #555; font-style: italic;">${objectivesOfInvention.closing}</p>

        <h2>BRIEF DESCRIPTION OF THE DRAWINGS</h2>
        ${briefDescriptionOfDrawings.map(d => `<div class="bullet-item">• ${d}</div>`).join("")}

        <h2>DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS</h2>
        ${detailedDescription.map(p => `<p>${p}</p>`).join("")}

        <h2 style="page-break-before: always;">CLAIMS</h2>
        <p><strong>WE CLAIM:</strong></p>
        <div style="margin-top: 12pt;">
          ${claims.map((claim, idx) => `
            <div class="claim-item">
              <strong>${idx + 1}.</strong> ${claim}
            </div>
          `).join("")}
        </div>

        <h2 style="page-break-before: always;">ABSTRACT OF THE INVENTION</h2>
        <div style="text-align: center; font-weight: bold; margin-bottom: 6pt; text-transform: uppercase;">${title}</div>
        <div style="text-align: center; font-weight: bold; font-size: 10.5pt; color: #444; margin-bottom: 12pt;">ABSTRACT</div>
        <div class="abstract-container">
          <p style="font-style: italic; margin-bottom: 0;">${abstractText}</p>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 10pt; margin-top: 12pt; text-transform: uppercase;">
          ${abstractFigureNumber}
        </div>

        <table class="signature-section">
          <tr>
            <td>
              <strong>DATED THIS 15th DAY OF JUNE, 2026.</strong><br/>
              <span style="font-size: 9pt; color: #555;">Electronic Submission via Indian Patent Gateway</span>
            </td>
            <td style="text-align: right; width: 50%;">
              <span style="font-family: serif; font-size: 12pt; text-decoration: line-through; color: #777;">V. Vallanat</span><br/>
              <strong>Vallanat & Co</strong><br/>
              <span style="font-size: 9pt; color: #555;">Patent Agent (IN/PA-9924)</span>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Write file as .doc - double-click opens seamlessly in Word/Pages/Google Docs with full style formatting!
    const blob = new Blob(["\ufeff" + htmlContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "_")}_form_2_patent_draft.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const textStr = buildPlainDraftText();
    const blob = new Blob([textStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${specifications.title.toLowerCase().replace(/\s+/g, "_")}_form_2_patent_draft.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sections Renderers
  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
      {/* Upper bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-indigo-600" />
          <h4 className="text-sm font-semibold text-slate-850 tracking-tight flex items-center gap-1.5">
            Form-2 Complete Specification
            <span className="text-[10px] font-normal text-slate-400 font-mono">(Indian Patent Rules, 2003)</span>
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy Form-2 Draft to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-650" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Download fully-styled Microsoft Word .doc Document"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={handleDownloadText}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title="Download formatted text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXT</span>
          </button>
        </div>
      </div>

      {/* Quick tab switcher and status row */}
      <div className="flex items-center justify-between bg-slate-100 border-b border-slate-200 px-4 py-1.5 overflow-x-auto text-xs font-semibold">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedTab("complete")}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedTab === "complete" ? "bg-white border-slate-300 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Form 2 Submission
          </button>
          <button
            onClick={() => setSelectedTab("description")}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedTab === "description" ? "bg-white border-slate-300 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Detailed Body
          </button>
          <button
            onClick={() => setSelectedTab("claims")}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedTab === "claims" ? "bg-white border-slate-300 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Claims ({specifications.claims.length})
          </button>
          <button
            onClick={() => setSelectedTab("abstract")}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedTab === "abstract" ? "bg-white border-slate-300 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Abstract
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-mono tracking-wider shrink-0">
          <span>COMPLIANCE STATUS:</span>
          <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-1.5 py-0.5 border border-green-200 rounded">
            VALID DRAFT
          </span>
        </div>
      </div>

      {/* Paper Stage Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-slate-50/50">
        <div className="relative w-full max-w-3xl bg-white border border-slate-200 patent-paper-shadow p-6 sm:p-10 text-slate-800 font-sans text-sm leading-relaxed select-text tracking-normal">
          
          {/* Form-2 Header only for complete tab or complete print */}
          {selectedTab === "complete" && (
            <div className="text-center font-serif text-xs mb-10 border-b-2 border-slate-900 pb-8 space-y-1">
              <span className="block font-bold tracking-widest text-[13px]">FORM 2</span>
              <span className="block font-bold tracking-widest uppercase text-slate-700">THE PATENTS ACT, 1970</span>
              <span className="block text-slate-500 font-medium">(39 of 1970)</span>
              <span className="block font-bold tracking-widest text-slate-700">&</span>
              <span className="block font-semibold uppercase tracking-wider text-slate-600">THE PATENTS RULES, 2003</span>
              <span className="block font-mono text-[10px] text-slate-400 style-italic pt-1">(See section 10 and rule 13)</span>
              
              <div className="border border-double border-slate-400 rounded p-4 mt-6 max-w-lg mx-auto bg-slate-50/50 text-left font-sans text-xs space-y-3 font-normal text-slate-600">
                <div>
                  <div className="font-bold text-slate-800 tracking-wide">1. TITLE OF THE INVENTION</div>
                  <div className="pl-3 mt-1 font-semibold uppercase text-slate-900 font-mono italic">"{specifications.title}"</div>
                </div>
                <div>
                  <div className="font-bold text-slate-800 tracking-wide">2. APPLICANT(s)</div>
                  <div className="pl-3 mt-0.5">Name: Vallanat, Vallanat</div>
                  <div className="pl-3 font-mono text-[10px]">Nationality: Indian | Address: India</div>
                </div>
                <div>
                  <div className="font-bold text-slate-800 tracking-wide">3. PREAMBLE TO THE DESCRIPTION</div>
                  <div className="pl-3 text-slate-700 mt-1 italic leading-normal">
                    The following specification particularly describes the invention and the manner in which it is to be performed.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paper Content Margins Simulation */}
          <div className="relative pl-6 md:pl-10">
            {/* Fine ruling page divider line on left boundary */}
            <div className="absolute left-0 top-0 bottom-0 border-l border-red-200/60 pointer-events-none select-none"></div>

            {/* Simulated Line numbers label for legal style */}
            <div className="absolute left-0 md:left-2 top-1 bottom-0 w-4 flex flex-col items-center text-[9px] font-mono text-slate-350 select-none pointer-events-none space-y-8 leading-none">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
              <span>45</span>
              <span>50</span>
              <span>55</span>
            </div>

            {/* Document body texts */}
            <div className="space-y-6">

              {/* SECTION: TITLE */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase">
                    Description Title
                  </h5>
                  <h1 className="text-base font-bold text-slate-900 tracking-tight leading-relaxed uppercase">
                    {specifications.title}
                  </h1>
                </div>
              )}

              {/* SECTION: FIELD OF THE INVENTION */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase border-b border-indigo-100 pb-1">
                    Field of the Invention
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify first-letter:text-xl first-letter:font-bold first-letter:mr-1">
                    {specifications.fieldOfTheInvention}
                  </p>
                </div>
              )}

              {/* SECTION: BACKGROUND OF THE INVENTION */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase border-b border-indigo-100 pb-1">
                    Background to the Invention
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {specifications.backgroundToTheInvention}
                  </p>
                </div>
              )}

              {/* SECTION: OBJECTS OF THE INVENTION */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-3 bg-indigo-50/50 p-4 border border-indigo-100/70 rounded-xl">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-750 uppercase">
                    OBJECTIVES OF THE INVENTION
                  </h5>
                  <div className="text-xs text-indigo-900 space-y-2.5 font-sans leading-relaxed">
                    <p className="italic font-medium">
                      "{specifications.objectivesOfInvention.primary}"
                    </p>
                    <p className="italic font-medium">
                      "{specifications.objectivesOfInvention.secondary}"
                    </p>
                    {specifications.objectivesOfInvention.terrestrial && (
                      <p className="italic font-medium">
                        "{specifications.objectivesOfInvention.terrestrial}"
                      </p>
                    )}
                    {specifications.objectivesOfInvention.further && (
                      <p className="italic font-medium">
                        "{specifications.objectivesOfInvention.further}"
                      </p>
                    )}
                    <p className="text-slate-500 font-mono mt-2">
                      {specifications.objectivesOfInvention.closing}
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION: BRIEF DESCRIPTION OF THE DRAWINGS */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase border-b border-indigo-100 pb-1">
                    Brief Description of the Drawings
                  </h5>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed text-left">
                    {specifications.briefDescriptionOfDrawings.map((text, idx) => (
                      <p key={idx} className="font-medium text-slate-800">
                        • {text}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: DETAILED DESCRIPTION */}
              {(selectedTab === "complete" || selectedTab === "description") && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase border-b border-indigo-100 pb-1">
                    Detailed Description of Preferred Embodiments
                  </h5>
                  <div className="space-y-4 text-xs text-slate-700 leading-relaxed text-justify">
                    {specifications.detailedDescription.map((p, idx) => {
                      // Custom formatter: highlight bracketed numbers like (10), (12) nicely in bold code format
                      const parts = p.split(/(\(\d+\))/g);
                      return (
                        <p key={idx}>
                          {parts.map((pPart, pIdx) => {
                            if (/^\(\d+\)$/.test(pPart)) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-block px-1 rounded text-slate-900 font-mono bg-indigo-50/80 font-bold border border-indigo-100/50"
                                >
                                  {pPart}
                                </span>
                              );
                            }
                            return pPart;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: CLAIMS LEGAL SHEETS */}
              {(selectedTab === "complete" || selectedTab === "claims") && (
                <div className="space-y-4 pt-4 border-t-2 border-slate-900">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-1">
                    <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase">
                      WE CLAIM
                    </h5>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-semibold">
                      SINGLE-SENTENCE LEGAL CONSTRAINT
                    </span>
                  </div>

                  <div className="space-y-5">
                    {specifications.claims.map((claim, idx) => {
                      // Check standard check: has exact single ending full stop
                      const periods = claim.match(/\./g);
                      const compliant = periods && periods.length === 1;

                      return (
                        <div key={idx} className="relative pl-6 flex flex-col gap-1 text-xs text-slate-800 leading-relaxed text-justify">
                          <span className="absolute left-0 top-0 font-bold font-mono text-indigo-700">
                            {idx + 1}.
                          </span>
                          <span className="font-serif italic text-[13px] leading-relaxed text-slate-900">
                            {claim}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[8px] font-mono uppercase px-1 rounded font-bold ${
                              compliant 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {compliant ? "Single Sentence Compliant" : "Notice: Verify Single Sentence Format"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: ABSTRACT */}
              {(selectedTab === "complete" || selectedTab === "abstract") && (
                <div className="space-y-3 pt-6 border-t-2 border-slate-900 mt-6">
                  <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase border-b border-indigo-100 pb-1">
                    Abstract of the Invention
                  </h5>
                  <div className="border border-slate-100/70 shadow-sm p-4 bg-slate-50 rounded-xl space-y-3">
                    <div className="text-center font-bold text-xs font-mono text-slate-900 uppercase">
                      {specifications.title}
                    </div>
                    <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500">
                      ABSTRACT
                    </div>
                    <p className="text-xs text-slate-755 text-justify leading-relaxed italic">
                      {specifications.abstractText}
                    </p>
                    <div className="text-center font-mono text-[10px] uppercase tracking-wide text-slate-400 font-bold border-t border-slate-200/50 pt-2 block">
                      {specifications.abstractFigureNumber}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer signature lines simulation */}
          {selectedTab === "complete" && (
            <div className="mt-16 pt-8 border-t border-slate-150 flex justify-between items-end text-xs font-medium text-slate-500">
              <div className="space-y-1">
                <span className="block font-mono text-[9px]">DATED THIS 15th DAY OF JUNE, 2026.</span>
                <span className="block italic text-slate-400">Electronic submission via IP GATEWAY</span>
              </div>
              
              <div className="text-right space-y-1">
                <span className="block font-serif text-[13px] line-through decoration-indigo-300 text-slate-600">V. Vallanat</span>
                <span className="block font-semibold text-slate-900">Vallanat & Co</span>
                <span className="block font-mono text-[10px] text-slate-400 uppercase">Patent Agent (IN/PA-9924)</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
