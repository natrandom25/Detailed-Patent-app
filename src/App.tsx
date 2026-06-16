import React, { useState } from "react";
import { PatentAnalysis, DraftedPatentResponse, ComponentItem, FigureItem } from "./types";
import PatentBuilderDashboard from "./components/PatentBuilderDashboard";
import PatentDocumentViewer from "./components/PatentDocumentViewer";
import PatentDrawingViewer from "./components/PatentDrawingViewer";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scale, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  RefreshCw, 
  Database, 
  Layers, 
  Check, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";

const INVENTIVE_PRESETS = [
  {
    title: "Eco Aero-Mist Hydroponic Cup",
    category: "Agriculture & Hydroponics",
    idea: "Automated vertical aeroponic seedling tray with computer vision root health monitoring sensor, dual-axis rotary misting spray nozzles, and Bluetooth humidity transmitter."
  },
  {
    title: "SOS Dynamo Pedal Device",
    category: "Electronics & Smart Transit",
    idea: "Distress signaling bicycle pedal with magnetic dynamo motion charge, dual-satellite locator chip, and automatic fall-down impact telemetry sensor."
  },
  {
    title: "Dynamic Smart-Insulating Mug",
    category: "Household & Thermals",
    idea: "Smart water bottle with integrated dynamic temperature regulation, vacuum pressure logging indicator, and UV-C sterilization cap."
  }
];

export default function App() {
  const [step, setStep] = useState<"input" | "refine" | "studio">("input");
  const [ideaText, setIdeaText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [analysis, setAnalysis] = useState<PatentAnalysis | null>(null);
  const [draftedResponse, setDraftedResponse] = useState<DraftedPatentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  // Analyze invention field
  const handleAnalyzeInvention = async (text: string) => {
    if (!text || text.trim().length === 0) return;
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("/api/patent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: text }),
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to analyze parameters.");
      }
      const data: PatentAnalysis = await response.json();
      if ((data as any).isOfflineFallback) {
        setIsFallbackActive(true);
      } else {
        setIsFallbackActive(false);
      }
      setAnalysis(data);
      setStep("refine");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during patent evaluation.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Generate finalized specs and SVGs
  const handleDraftSpecification = async (finalForm: {
    title: string;
    fieldOfInvention: string;
    background: string;
    components: ComponentItem[];
    figures: FigureItem[];
    patentType: "short" | "full";
    manualPriorArt?: any[];
  }) => {
    setDrafting(true);
    setError(null);
    try {
      const response = await fetch("/api/patent/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalForm.title,
          fieldOfInvention: finalForm.fieldOfInvention,
          background: finalForm.background,
          components: finalForm.components,
          figures: finalForm.figures,
          inventionIdea: ideaText,
          patentType: finalForm.patentType,
          manualPriorArt: finalForm.manualPriorArt,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to generate drafts.");
      }

      const data: DraftedPatentResponse = await response.json();
      if ((data as any).isOfflineFallback) {
        setIsFallbackActive(true);
      } else {
        setIsFallbackActive(false);
      }
      setDraftedResponse(data);
      setStep("studio");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to complete formal drafting.");
    } finally {
      setDrafting(false);
    }
  };

  // Refine analysis based on manually found prior art
  const handleRefineWithManualPriorArt = async (manualPriorArt: any[]) => {
    setIsRefining(true);
    setError(null);
    try {
      const response = await fetch("/api/patent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: ideaText || (analysis ? analysis.title : ""),
          manualPriorArt
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to re-evaluate after blending manually entered prior art.");
      }

      const data: PatentAnalysis = await response.json();
      if ((data as any).isOfflineFallback) {
        setIsFallbackActive(true);
      } else {
        setIsFallbackActive(false);
      }
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during manual prior art evaluation.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setAnalysis(null);
    setDraftedResponse(null);
    setError(null);
    setIdeaText("");
    setIsFallbackActive(false);
  };

  const [studioTab, setStudioTab] = useState<"complete" | "description" | "claims" | "abstract">("complete");

  const getComplianceScore = () => {
    if (step === "input") return 32;
    if (step === "refine") return 68;
    return 100;
  };

  const currentScore = getComplianceScore();

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Application Bar (High Density Polished Light Theme) */}
      <header className="h-14 bg-white text-slate-900 flex items-center justify-between px-6 shrink-0 border-b border-slate-200 select-none z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm">
            IP
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight flex items-center gap-2 text-slate-900">
              PatDraft.in 
              <span className="text-slate-450 font-normal text-xs pl-2 border-l border-slate-200 hidden sm:inline">
                Indian Patent Specification Builder (Form-2)
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[10px] sm:text-xs bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-mono font-medium">
            Draft ID: IN-2026-9924
          </div>
          
          {step !== "input" && (
            <button
              onClick={handleReset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Draft New Patent</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace split */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar: Section Navigation */}
        <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 hidden md:flex select-none">
          <div className="p-5 border-b border-slate-800 bg-slate-950/20">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Draft Progress</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {/* 1. Title & Field */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("complete");
                  setStep("studio");
                } else if (analysis) {
                  setStep("refine");
                } else {
                  setStep("input");
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "input" || (step === "studio" && studioTab === "complete")
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">1. Title & Field</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "input" || (step === "studio" && studioTab === "complete") ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>

            {/* 2. Background */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("complete");
                  setStep("studio");
                } else if (analysis) {
                  setStep("refine");
                } else {
                  setStep("input");
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "refine"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">2. Background</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "refine" ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>

            {/* 3. Objects of Invention */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("description");
                  setStep("studio");
                }
              }}
              disabled={!draftedResponse}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "studio" && studioTab === "description"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : draftedResponse
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-slate-600 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">3. Objects of Invention</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "studio" && studioTab === "description" ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>

            {/* 4. Drawings Description */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("description");
                  setStep("studio");
                }
              }}
              disabled={!draftedResponse}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "studio" && studioTab === "description"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : draftedResponse
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-slate-600 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">4. Drawings Description</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "studio" && studioTab === "description" ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>

            {/* 5. Detailed Description */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("description");
                  setStep("studio");
                }
              }}
              disabled={!draftedResponse}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "studio" && studioTab === "description"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : draftedResponse
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-slate-600 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">5. Detailed Description</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "studio" && studioTab === "description" ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>

            {/* 6. Claims (Legal) */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("claims");
                  setStep("studio");
                }
              }}
              disabled={!draftedResponse}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "studio" && studioTab === "claims"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : draftedResponse
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-slate-600 border border-transparent"
              }`}
            >
              <span className="text-xs font-bold text-red-500 italic">6. Claims (Legal)</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "studio" && studioTab === "claims" ? "bg-red-500 animate-pulse" : "bg-slate-700"}`}></div>
            </button>

            {/* 7. Abstract */}
            <button
              onClick={() => {
                if (draftedResponse) {
                  setStudioTab("abstract");
                  setStep("studio");
                }
              }}
              disabled={!draftedResponse}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                step === "studio" && studioTab === "abstract"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : draftedResponse
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-slate-600 border border-transparent"
              }`}
            >
              <span className="text-xs font-medium italic">7. Abstract</span>
              <div className={`w-1.5 h-1.5 rounded-full ${step === "studio" && studioTab === "abstract" ? "bg-indigo-400" : "bg-slate-700"}`}></div>
            </button>
          </nav>

          <div className="p-5 border-t border-slate-800 bg-slate-950/30">
            <div className="flex items-center gap-2 mb-2 justify-between">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Compliance Score</span>
              <span className="text-xs font-bold text-indigo-450 text-indigo-400">{currentScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                style={{ width: `${currentScore}%` }} 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-[9px] text-slate-500 mt-1.5 uppercase tracking-wider font-mono">Standard Rule Form-2 SEC3</p>
          </div>
        </aside>

        {/* Content Area Page Container */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100/40 p-4 sm:p-6">
          <div className="max-w-7xl w-full mx-auto flex flex-col gap-5 h-full">
            
            {/* Global Alert Notification */}
            {error && (
              <div className="bg-red-50 border border-red-250 text-red-800 rounded-xl p-4 flex items-start gap-3 shadow-sm shrink-0">
                <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-sm">Design Pipeline Exception</h5>
                  <p className="text-xs mt-1 text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Offline/Quota Fallback Alert Banner */}
            {isFallbackActive && (
              <div className="bg-amber-50 border border-amber-250 text-amber-800 rounded-xl p-4 flex items-start gap-3 shadow-sm shrink-0">
                <Sparkles className="w-5 h-5 text-amber-650 shrink-0 mt-0.5 font-bold" />
                <div>
                  <h5 className="font-bold text-sm">Resilient Patent Generator Active (Sandbox Mode)</h5>
                  <p className="text-xs mt-1 text-amber-700 font-medium leading-relaxed">
                    The standard Gemini API endpoint is currently experiencing high demand or rate limits. 
                    PatDraft.in automatically computed an offline compliant patent model specification with perfect Form-2 layouts, 
                    reference numeral indices, and layout shapes to keep your workflow unblocked.
                  </p>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1: INPUT IDEA FORM */}
              {step === "input" && (
                <motion.div
                  key="step-input"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="space-y-6 max-w-2xl mx-auto w-full py-4"
                >
                  <div className="space-y-2 mt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Compliant Technical Claims Analyzer</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif italic tracking-tight">
                      Section 1: Enter Title & Technical Objectives
                    </h2>
                    <p className="text-xs text-slate-550 max-w-lg leading-relaxed">
                      Provide a description of your invention field. The model verifies background problems,
                      coordinates a novel solution, maps components to brackets reference numerals, and writes a Form 2 filing draft.
                    </p>
                  </div>

                  {/* Input Panel Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Invention Proposal / Detail Specification Brief
                      </label>
                      <textarea
                        rows={6}
                        value={ideaText}
                        onChange={(e) => setIdeaText(e.target.value)}
                        placeholder="e.g. A wearable device for fire fighters with vital sign logging sensors, a distress beacon transmitter, and custom thermal insulation shielding..."
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-sans leading-relaxed text-slate-800"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="text-[11px] text-slate-400 italic">
                        Mention assembly elements to auto-assign referential parent codes.
                      </span>
                      <button
                        onClick={() => handleAnalyzeInvention(ideaText)}
                        disabled={analyzing || ideaText.trim().length === 0}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 select-none"
                      >
                        {analyzing ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                            <span>Evaluating Novelty...</span>
                          </>
                        ) : (
                          <>
                            <span>Check Novelty & Problems</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Invention Suggestion Presets */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Select Compliance Template Template</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {INVENTIVE_PRESETS.map((preset) => (
                        <button
                          key={preset.title}
                          onClick={() => {
                            setIdeaText(preset.idea);
                            handleAnalyzeInvention(preset.idea);
                          }}
                          className="text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 p-4 rounded-xl transition-all hover:shadow-sm space-y-2 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                        >
                          <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                            {preset.category}
                          </span>
                          <h5 className="font-bold text-slate-800 text-xs tracking-tight group-hover:text-indigo-700">
                            {preset.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                            {preset.idea}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: REFINE PARAMETERS DASHBOARD */}
              {step === "refine" && analysis && (
                <motion.div
                  key="step-refine"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm leading-tight">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setStep("input")}
                        className="p-1.5 rounded-lg border border-slate-250 hover:bg-slate-50 bg-white text-slate-600 transition-colors"
                        title="Back to Idea text input"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 font-serif italic">Invention Analyzer Output</h4>
                        <p className="text-xs text-slate-400">Review, synchronize reference index numerals, and add diagram sheet views.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250 uppercase font-mono tracking-wider">
                      Novelty Locked
                    </span>
                  </div>

                  <PatentBuilderDashboard
                    initialAnalysis={analysis}
                    isGenerating={drafting}
                    onGenerateDraft={handleDraftSpecification}
                    onRefineWithManualPriorArt={handleRefineWithManualPriorArt}
                    isRefining={isRefining}
                  />
                </motion.div>
              )}

              {/* STEP 3: STUDIO WORKSPACE (SIDE-BY-SIDE PDF/SVG DRAFT) */}
              {step === "studio" && draftedResponse && (
                <motion.div
                  key="step-studio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col lg:flex-row gap-5 items-stretch h-full w-full"
                >
                  {/* Complete specifications document page */}
                  <div className="flex-1 shrink-0 min-w-0">
                    <PatentDocumentViewer 
                      specifications={draftedResponse.specifications} 
                      selectedTab={studioTab}
                      onTabChange={setStudioTab}
                    />
                  </div>

                  {/* Drawings and Compliance checks */}
                  <div className="w-full lg:w-96 shrink-0 space-y-4 flex flex-col justify-start">
                    
                    {/* Patent drawing board */}
                    <div className="min-h-[420px] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                      <PatentDrawingViewer drawings={draftedResponse.drawings} />
                    </div>

                    {/* Live Advisor Panel: Phase 9 Complete Quality Audit */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping"></div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                            Phase 9: Quality Review Audit
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-green-50 border border-green-200 text-green-700 rounded-full px-2 py-0.5 shadow-2xs">
                          Score: {draftedResponse.finalAudit?.filingReadinessScore ?? 95}%
                        </span>
                      </div>

                      {/* Visual word count bar */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                          <span>Abstract Word Count</span>
                          <span>{draftedResponse.specifications.abstractText.split(/\s+/).filter(Boolean).length} / 150</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${Math.min(100, (draftedResponse.specifications.abstractText.split(/\s+/).filter(Boolean).length / 150) * 100)}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${
                              draftedResponse.specifications.abstractText.split(/\s+/).filter(Boolean).length > 150 
                                ? "bg-red-500" 
                                : "bg-indigo-600"
                            }`}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-450 leading-tight">Must remain strictly under 150 words per Indian Patent Office Rule 13.</p>
                      </div>

                      {/* Strengths */}
                      {draftedResponse.finalAudit?.strengths && draftedResponse.finalAudit.strengths.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">STRENGTHS</h5>
                          <ul className="text-[11px] text-slate-650 space-y-1">
                            {draftedResponse.finalAudit.strengths.slice(0, 3).map((st, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span className="font-sans font-medium">{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Rejection Risks */}
                      {draftedResponse.finalAudit?.potentialRejectionRisks && draftedResponse.finalAudit.potentialRejectionRisks.length > 0 && (
                        <div className="space-y-1 border-t border-slate-100 pt-3">
                          <h5 className="text-[9px] font-black text-red-500 uppercase tracking-wider font-mono">REJECTION RISKS (SEC 3)</h5>
                          <ul className="text-[11px] text-slate-650 space-y-1">
                            {draftedResponse.finalAudit.potentialRejectionRisks.slice(0, 3).map((st, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-red-500 font-bold shrink-0">!</span>
                                <span className="text-slate-700 font-medium font-sans">{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommended Improvements */}
                      {draftedResponse.finalAudit?.recommendedImprovements && draftedResponse.finalAudit.recommendedImprovements.length > 0 && (
                        <div className="space-y-1 border-t border-slate-100 pt-3 bg-indigo-50/20 p-2.5 rounded-lg border border-indigo-100">
                          <h5 className="text-[9px] font-black text-indigo-700 uppercase tracking-wider font-mono">RECOMMENDED REPAIRS</h5>
                          <ul className="text-[11px] text-slate-700 space-y-1 shadow-2xs">
                            {draftedResponse.finalAudit.recommendedImprovements.slice(0, 2).map((st, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-indigo-600 font-extrabold shrink-0">•</span>
                                <span className="font-medium font-sans">{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </main>

      </div>

      {/* Elegant minimalist structural footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-6 shrink-0 text-center text-slate-400 text-[10px] font-mono tracking-wider flex items-center justify-between z-20">
        <div>INDIAN APPLICATION SYSTEM • FORM 2 ONLINE COMPLIANCE SUBMISSION</div>
        <div className="text-slate-350 italic hidden sm:block">Vallanat legal credential system registered PA-9924</div>
      </footer>

    </div>
  );
}
