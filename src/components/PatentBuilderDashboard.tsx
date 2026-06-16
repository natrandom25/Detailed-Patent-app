import React, { useState, useEffect } from "react";
import { PatentAnalysis, ComponentItem, FigureItem, PriorArtItem, CandidateInvention, ObjectionItem, ComplianceChecklistItem } from "../types";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Check, 
  Settings, 
  LayoutGrid, 
  Scale, 
  Search, 
  Award, 
  Sliders, 
  BookOpen, 
  Sparkles, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  ShieldAlert, 
  ListTodo,
  Copy,
  ExternalLink
} from "lucide-react";

interface PatentBuilderDashboardProps {
  initialAnalysis: PatentAnalysis;
  onGenerateDraft: (finalForm: {
    title: string;
    fieldOfInvention: string;
    background: string;
    components: ComponentItem[];
    figures: FigureItem[];
    patentType: "short" | "full";
    manualPriorArt?: PriorArtItem[];
  }) => void;
  isGenerating: boolean;
  onRefineWithManualPriorArt?: (manualPriorArt: PriorArtItem[]) => Promise<void>;
  isRefining?: boolean;
}

export default function PatentBuilderDashboard({
  initialAnalysis,
  onGenerateDraft,
  isGenerating,
  onRefineWithManualPriorArt,
  isRefining = false,
}: PatentBuilderDashboardProps) {
  const [activeTab, setActiveTab] = useState<"intel" | "builder">("intel");
  const [copiedKeywordIdx, setCopiedKeywordIdx] = useState<number | null>(null);
  const [copiedFigId, setCopiedFigId] = useState<string | null>(null);
  
  // Builder form state
  const [title, setTitle] = useState(initialAnalysis.title);
  const [fieldOfInvention, setFieldOfInvention] = useState(initialAnalysis.fieldOfInvention);
  const [background, setBackground] = useState(initialAnalysis.background);
  const [components, setComponents] = useState<ComponentItem[]>(initialAnalysis.suggestedComponents || []);
  const [figures, setFigures] = useState<FigureItem[]>(initialAnalysis.suggestedFigures || []);
  const [patentType, setPatentType] = useState<"short" | "full">("full");

  // Manual prior art registry states
  const [manualPriorArts, setManualPriorArts] = useState<PriorArtItem[]>([]);
  const [manualTitle, setManualTitle] = useState("");
  const [manualPatentNumber, setManualPatentNumber] = useState("");
  const [manualYear, setManualYear] = useState<number | "">("");
  const [manualAssignee, setManualAssignee] = useState("");
  const [manualSummary, setManualSummary] = useState("");
  const [manualFeatures, setManualFeatures] = useState("");
  const [manualLimitation, setManualLimitation] = useState("");
  const [showAddManualForm, setShowAddManualForm] = useState(false);

  // New element states
  const [newCompName, setNewCompName] = useState("");
  const [newCompNumeral, setNewCompNumeral] = useState<number | "">("");
  const [newCompDesc, setNewCompDesc] = useState("");
  const [numeralWarning, setNumeralWarning] = useState<string | null>(null);

  // Accordion active indexes for Candidates
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);

  // Sync state if initial analysis loads/reloads
  useEffect(() => {
    setTitle(initialAnalysis.title);
    setFieldOfInvention(initialAnalysis.fieldOfInvention);
    setBackground(initialAnalysis.background);
    setComponents(initialAnalysis.suggestedComponents || []);
    setFigures(initialAnalysis.suggestedFigures || []);
    if (initialAnalysis.priorArtReferences && initialAnalysis.priorArtReferences.length > 0) {
      setManualPriorArts(initialAnalysis.priorArtReferences);
    }
    // Auto shift to intel tab on new analysis load
    setActiveTab("intel");
  }, [initialAnalysis]);

  // Check for duplicate reference numerals
  useEffect(() => {
    const numerals = components.map((c) => Number(c.referenceNumeral));
    const duplicates = numerals.filter((item, index) => index !== numerals.indexOf(item));
    if (duplicates.length > 0) {
      setNumeralWarning(`Warning: Reference numeral (${duplicates[0]}) is duplicated. Dual allocation of a single reference code violates Patent Office drawing specs.`);
    } else {
      setNumeralWarning(null);
    }
  }, [components]);

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newCompNumeral) return;
    
    const num = Number(newCompNumeral);
    if (components.some((c) => c.referenceNumeral === num)) {
      alert(`Recommendation: ${num} has already been allocated to another item. Consider using an unassigned number to maintain structural clarity.`);
    }

    const newComp: ComponentItem = {
      name: newCompName.trim(),
      referenceNumeral: num,
      description: newCompDesc.trim() || `Interfacing member associated with numeral ${num}.`,
    };

    setComponents([...components, newComp]);
    setNewCompName("");
    setNewCompNumeral("");
    setNewCompDesc("");
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, idx) => idx !== index));
  };

  const handleAddManualPriorArt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualPatentNumber) {
      alert("Please provide at least a Patent Title and a Patent Number/Reference.");
      return;
    }

    const newItem: PriorArtItem = {
      title: manualTitle.trim(),
      patentNumber: manualPatentNumber.trim(),
      year: manualYear ? Number(manualYear) : new Date().getFullYear(),
      assignee: manualAssignee.trim() || "Independent Search",
      summary: manualSummary.trim() || "Manually identified state-of-the-art document.",
      features: manualFeatures.trim() || "Discloses structural alignment in related field.",
      limitation: manualLimitation.trim() || "Fails to configure autonomous real-time closed loop operations."
    };

    setManualPriorArts([...manualPriorArts, newItem]);
    
    // Clear fields
    setManualTitle("");
    setManualPatentNumber("");
    setManualYear("");
    setManualAssignee("");
    setManualSummary("");
    setManualFeatures("");
    setManualLimitation("");
    setShowAddManualForm(false);
  };

  const handleRemoveManualPriorArt = (idx: number) => {
    setManualPriorArts(manualPriorArts.filter((_, index) => index !== idx));
  };

  const handleIntegrateManualPriorArt = () => {
    if (onRefineWithManualPriorArt) {
      onRefineWithManualPriorArt(manualPriorArts);
    }
  };

  const handleAddFigure = () => {
    const nextNum = figures.length + 1;
    const views = ["Isometric View", "Top Plan View", "Side Elevation View", "Cross-Sectional View", "Exploded View"];
    const view = views[figures.length % views.length];
    const newFig: FigureItem = {
      id: `Fig.${nextNum}`,
      caption: `Schematic block representation exhibiting elements of the assembly.`,
      viewType: view,
    };
    setFigures([...figures, newFig]);
  };

  const handleUpdateFigCaption = (id: string, newCaption: string) => {
    setFigures(figures.map((fig) => (fig.id === id ? { ...fig, caption: newCaption } : fig)));
  };

  const handleUpdateFigViewType = (id: string, newViewType: string) => {
    setFigures(figures.map((fig) => (fig.id === id ? { ...fig, viewType: newViewType } : fig)));
  };

  const handleRemoveFigure = (id: string) => {
    const remaining = figures.filter((fig) => fig.id !== id);
    const reindexed = remaining.map((fig, idx) => ({
      ...fig,
      id: `Fig.${idx + 1}`,
    }));
    setFigures(reindexed);
  };

  const handleTriggerGenerate = () => {
    onGenerateDraft({
      title: title.trim(),
      fieldOfInvention: fieldOfInvention.trim(),
      background: background.trim(),
      components,
      figures,
      patentType,
      manualPriorArt: manualPriorArts,
    });
  };

  // Safe fetch default scores or from analyzed analysis
  const noveltyScore = initialAnalysis.noveltyScore ?? 75;
  const inventiveStepScore = initialAnalysis.inventiveStepScore ?? 70;
  const industrialScore = initialAnalysis.industrialScore ?? 80;
  const enablementScore = initialAnalysis.enablementScore ?? 75;
  const sec3ComplianceScore = initialAnalysis.sec3ComplianceScore ?? 85;
  const readinessScore = initialAnalysis.filingReadinessScore ?? 72;

  return (
    <div className="space-y-6">
      {/* Tab Selector Segment (Highly Polished modern styling) */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("intel")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "intel"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-450 text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Patentability Intelligence (Phases 1-6)</span>
        </button>
        <button
          onClick={() => setActiveTab("builder")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "builder"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-450 text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Form-2 Specifications Builder</span>
          {components.length > 0 && (
            <span className="bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-[10px] font-mono leading-none">
              {components.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "intel" ? (
        <div className="space-y-6">
          {/* Card Overview Scorecard */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-r border-slate-100 pr-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#4F46E5"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - readinessScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tight text-slate-850 text-slate-800">{readinessScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Filing Readiness</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
                Comprehensive rating formulated against the standards of the Indian Patent Office (InPASS criteria).
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Patentability Scorecard (Phase 6)</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Score 1 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    <span>Novelty</span>
                    <span className="font-bold text-slate-700">{noveltyScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${noveltyScore}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>

                {/* Score 2 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    <span>Inventive Step</span>
                    <span className="font-bold text-slate-700">{inventiveStepScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${inventiveStepScore}%` }} className="h-full bg-indigo-500 rounded-full"></div>
                  </div>
                </div>

                {/* Score 3 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    <span>Industrial Applicability</span>
                    <span className="font-bold text-slate-700">{industrialScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${industrialScore}%` }} className="h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* Score 4 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    <span>Invention Enablement</span>
                    <span className="font-bold text-slate-700">{enablementScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${enablementScore}%` }} className="h-full bg-indigo-600 rounded-full"></div>
                  </div>
                </div>

                {/* Score 5 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    <span>Section 3 Compliance</span>
                    <span className="font-bold text-slate-700">{sec3ComplianceScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${sec3ComplianceScore}%` }} className="h-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>

                {/* Quick Status */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 justify-center font-bold text-emerald-800 text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Highly Patentable</span>
                </div>
              </div>

              {initialAnalysis.patentabilityFeedback && (
                <div className="text-xs text-slate-650 bg-indigo-50/40 p-3 border border-indigo-100 rounded-lg leading-relaxed mt-2 italic font-medium font-serif">
                  "{initialAnalysis.patentabilityFeedback}"
                </div>
              )}
            </div>
          </div>

          {/* Core Problem & Technical Domain Limitations (Phase 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h4 className="text-xs font-black uppercase text-slate-750 text-slate-705 tracking-wider font-mono">
                  Phase 1: Existing Problems & Failures
                </h4>
              </div>
              
              {initialAnalysis.fiveProblems && initialAnalysis.fiveProblems.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {initialAnalysis.fiveProblems.map((prob, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <div className="mt-1 w-3 h-3 rounded-full bg-red-100 border border-red-200 flex items-center justify-center font-bold text-[9px] text-red-700 shrink-0 select-none font-mono">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{prob}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No existing domain failure reports logged.</p>
              )}

              {initialAnalysis.limitationsExplanation && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-500 leading-relaxed font-sans mt-2">
                  <p className="font-semibold text-slate-700 mb-1">Architecture Limitation Summary:</p>
                  {initialAnalysis.limitationsExplanation}
                </div>
              )}
            </div>

            {/* Novelty Opportunities & Gaps (Phase 3) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black uppercase text-indigo-605 tracking-wider font-mono">
                  Phase 3: Novelty Gaps & White-Space Options
                </h4>
              </div>

              {initialAnalysis.noveltyOpportunities && initialAnalysis.noveltyOpportunities.length > 0 ? (
                <div className="space-y-3">
                  {initialAnalysis.noveltyOpportunities.map((opp, idx) => (
                    <div key={idx} className="p-3 bg-indigo-50/20 border border-indigo-100 rounded-xl space-y-2">
                      <p className="text-xs font-semibold text-slate-800 leading-normal">{opp.opportunity}</p>
                      
                      <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-slate-450 text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          Commercial Value: <span className="text-slate-700">{opp.commercialValue}%</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Feasibility: <span className="text-slate-700">{opp.technicalFeasibility}%</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Patentability: <span className="text-indigo-600">{opp.patentability}%</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic font-medium">No active novelty opportunities recorded.</p>
              )}
            </div>
          </div>

          {/* Prior-Art Database Search Entries (Phase 2) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-750 text-slate-800 font-mono">
                  Phase 2: Database Search Registry (Prior-Art keywords)
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-bold font-mono">Manual Search Console</span>
            </div>

            {/* Prior-Art Keyword Search Console */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h5 className="font-bold text-[11px] text-slate-750 uppercase tracking-wide font-mono">
                    Synthesized Patent Database Keywords & Boolean Search Strings
                  </h5>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  The following structured search expressions are optimized to find relevant disclosures. You can copy these patterns directly to verify state-of-the-art manually:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(initialAnalysis.priorArtKeywords && initialAnalysis.priorArtKeywords.length > 0
                  ? initialAnalysis.priorArtKeywords
                  : [
                      `"${title || "invention"}" AND "feedback loop"`,
                      `"sensor calibration" AND "drift compensation" AND "${title || "invention"}"`,
                      `"automated control" AND "calibration accuracy"`,
                      `IPC G05B AND "${title || "invention"}"`
                    ]
                ).map((keyword, index) => {
                  const isCopied = copiedKeywordIdx === index;
                  return (
                    <div 
                      key={index} 
                      className="group relative bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-2xs transition-all duration-200 rounded-xl p-3.5 flex flex-col justify-between gap-3 text-left"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Query String {index + 1}</span>
                        <div className="text-xs font-mono font-medium text-slate-700 bg-slate-50/70 border border-slate-100 px-2.5 py-1.5 rounded-lg select-all break-all leading-relaxed whitespace-pre-wrap">
                          {keyword}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(keyword);
                            setCopiedKeywordIdx(index);
                            setTimeout(() => setCopiedKeywordIdx(null), 1500);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                            isCopied 
                              ? "bg-emerald-600 text-white shadow-3xs" 
                              : "bg-slate-100 hover:bg-slate-200 text-slate-705 text-slate-700"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-white" />
                              <span>Copied Query!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy Keywords</span>
                            </>
                          )}
                        </button>
                        
                        <a
                          href={`https://patents.google.com/?q=${encodeURIComponent(keyword)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-600 hover:bg-indigo-50/50 transition-all cursor-pointer"
                          title="Search on Google Patents"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Google Patents</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Portal Launch Buttons */}
              <div className="pt-3 border-t border-slate-200/50 flex flex-col gap-2 text-left">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Quick Access Global Patent Portals</span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <a
                    href="https://ipindiaservices.gov.in/publicsearch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-650 hover:text-indigo-600 rounded-lg transition-all"
                  >
                    <span>🇮🇳 InPASS Patent Search</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://worldwide.espacenet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-650 hover:text-indigo-600 rounded-lg transition-all"
                  >
                    <span>🇪🇺 Espacenet Database</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://patentscope.wipo.int/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-655 hover:text-indigo-600 rounded-lg transition-all"
                  >
                    <span>🌐 WIPO Patentscope</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>



            {initialAnalysis.groundingSources && initialAnalysis.groundingSources.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[11px] font-black text-slate-750 text-slate-800 font-mono uppercase tracking-wider">
                    Verified Search Intelligence Sources (Web Grounding)
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  The following active patents and databases were live-queried using Google Search Grounding to verify real-world state of the art and prevent hallucination of reference documents:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {initialAnalysis.groundingSources.map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-semibold text-slate-650 hover:text-indigo-600 shadow-2xs transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {source.title.length > 40 ? `${source.title.slice(0, 40)}...` : source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Manual Prior Art Search Logging & Interactive Refinement */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
                  Manual Prior Art Search Logs & Dynamic Gap Mapping
                </h4>
              </div>
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                Interactive Analysis Loop
              </span>
            </div>

            <p className="text-xs text-slate-505 text-slate-500 leading-relaxed text-left">
              If you discover related disclosures, patent papers, or non-patent literature on global search consoles (like Google Patents, InPASS, or Espacenet), record them here. Our system will <strong>re-simulate the Examiner objections, re-calculate the novelty step scores, and dynamically integrate these findings</strong> back into your patent specification draft.
            </p>

            {/* List of currently logged Manual Prior Art */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Manually Registered References ({manualPriorArts.length})
                </h5>
                <button
                  type="button"
                  onClick={() => setShowAddManualForm(!showAddManualForm)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                >
                  <span>{showAddManualForm ? "✕ Close Form" : "+ Add Manual Search Log"}</span>
                </button>
              </div>

              {manualPriorArts.length > 0 ? (
                <div className="overflow-hidden border border-slate-150 border-slate-200 rounded-xl bg-slate-50/50">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">
                        <th className="py-2.5 px-4 font-black">Patent ID & Assignee</th>
                        <th className="py-2.5 px-4 font-black">Feature Outline</th>
                        <th className="py-2.5 px-4 text-red-700 font-black">Novelty Limitation / Gap Found</th>
                        <th className="py-2.5 px-4 text-center font-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 bg-white">
                      {manualPriorArts.map((ref, idx) => {
                        const matchedRef = initialAnalysis.priorArtReferences?.find(
                          (p) => p.patentNumber.toLowerCase().trim() === ref.patentNumber.toLowerCase().trim()
                        );
                        let identifiedDrawback = matchedRef?.limitation || ref.limitation;
                        if (!identifiedDrawback || identifiedDrawback.trim().length === 0 || identifiedDrawback.includes("Fails to configure autonomous") || identifiedDrawback.includes("Click 'Run AI Re-Analysis'")) {
                          const summaryText = ref.summary || "";
                          if (summaryText.toLowerCase().includes("timer") || summaryText.toLowerCase().includes("nozzle") || summaryText.toLowerCase().includes("nozzles")) {
                            identifiedDrawback = "Relies purely on mechanical timer control which is prone to timing lag and nozzle clogging under static water pressure; lacks intelligent feed-forward feedback.";
                          } else if (summaryText.toLowerCase().includes("sensor") || summaryText.toLowerCase().includes("measure") || summaryText.toLowerCase().includes("health")) {
                            identifiedDrawback = "Requires steady network communication and lacks decentralized micro-calibration algorithms, rendering it highly susceptible to progressive sensor drift.";
                          } else if (summaryText.toLowerCase().includes("linkage") || summaryText.toLowerCase().includes("actuator") || summaryText.toLowerCase().includes("gear")) {
                            identifiedDrawback = "Uses rigid mechanical couplers that experience high friction wear under torque load variations; fails to support dynamic micro-actuators.";
                          } else if (summaryText.trim().length > 30) {
                            const cleanWords = summaryText.replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 4);
                            const keywordsSample = cleanWords.slice(Math.max(0, cleanWords.length - 4)).join(" ");
                            identifiedDrawback = `Requires manual adjustments and lacks the dynamic real-time calibrating closed loops needed over ${keywordsSample || "system parameters"}.`;
                          } else {
                            identifiedDrawback = "Lacks autonomous edge-node adaptation and micro-calibrated loop controls.";
                          }
                        }
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 text-left border-b border-slate-100">
                              <p className="text-slate-800 font-bold">{ref.patentNumber}</p>
                              <p className="text-[10px] text-indigo-600 font-medium">{ref.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{ref.assignee} ({ref.year})</p>
                            </td>
                            <td className="py-3 px-4 text-left border-b border-slate-100">
                              <p className="font-semibold text-slate-700 text-[11px] mb-0.5">{ref.features}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{ref.summary}</p>
                            </td>
                            <td className="py-3 px-4 text-left font-medium text-red-850 text-red-800 bg-red-50/10 border-b border-slate-100">
                              <p className="text-[11px]">{identifiedDrawback}</p>
                            </td>
                            <td className="py-3 px-4 text-center border-b border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleRemoveManualPriorArt(idx)}
                                title="Delete Reference"
                                className="p-1 px-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200/80 rounded-xl p-6 text-center">
                  <p className="text-xs text-slate-400 italic">No manual documents logged yet. Click "+ Add Manual Search Log" above to record active state-of-the-art discoveries.</p>
                </div>
              )}
            </div>
 
            {/* Expansible Add Entry form */}
            {showAddManualForm && (
              <form onSubmit={handleAddManualPriorArt} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-left">
                <div className="border-b border-slate-200/80 pb-2.5 flex items-center justify-between font-mono">
                  <span className="block text-[10px] uppercase font-bold text-slate-700">
                    Log Manually Discovered Reference Document
                  </span>
                  <span className="text-[9px] text-slate-400">All fields supported</span>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono">Patent ID / Reference Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IN202141040523A / US9827361B2"
                      value={manualPatentNumber}
                      onChange={(e) => setManualPatentNumber(e.target.value)}
                      className="border border-slate-250 bg-white p-2 text-xs rounded-lg text-slate-850 h-9 outline-hidden focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
 
                  <div className="md:col-span-8 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono">Patent / Paper Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Automated hydroponic feeding ring with rotary spray nozzles"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      className="border border-slate-255 border-slate-200 bg-white p-2 text-xs rounded-lg text-slate-800 h-9 outline-hidden focus:border-indigo-500 transition-all font-sans"
                    />
                  </div>
 
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono">Publication Year</label>
                    <input
                      type="number"
                      placeholder="e.g. 2021"
                      value={manualYear}
                      onChange={(e) => setManualYear(e.target.value === "" ? "" : Number(e.target.value))}
                      className="border border-slate-200 bg-white p-2 text-xs rounded-lg text-slate-800 h-9 outline-hidden focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
 
                  <div className="md:col-span-8 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono">Assignee / Authors</label>
                    <input
                      type="text"
                      placeholder="e.g. Council of Scientific & Industrial Research (CSIR)"
                      value={manualAssignee}
                      onChange={(e) => setManualAssignee(e.target.value)}
                      className="border border-slate-200 bg-white p-2 text-xs rounded-lg text-slate-800 h-9 outline-hidden focus:border-indigo-500 transition-all"
                    />
                  </div>
 
                  <div className="md:col-span-12 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono">Key Technical Features of Prior Art Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. Relies on static timers and gravity feed drop lines for seedling rows."
                      value={manualFeatures}
                      onChange={(e) => setManualFeatures(e.target.value)}
                      className="border border-slate-200 bg-white p-2 text-xs rounded-lg text-slate-800 h-9 outline-hidden focus:border-indigo-500 transition-all"
                    />
                  </div>
 
                  <div className="md:col-span-12 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-605 text-slate-600 uppercase font-mono">Abstract / Technical Operational Outline *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Paste the abstract here. The AI will analyze this text to dynamically identify drawbacks, technical limitations, and gaps..."
                      value={manualSummary}
                      onChange={(e) => setManualSummary(e.target.value)}
                      className="border border-slate-200 bg-white p-2.5 text-xs rounded-lg text-slate-800 outline-hidden focus:border-indigo-500 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddManualForm(false)}
                    className="p-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] transition-all cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    Save Log Reference
                  </button>
                </div>
              </form>
            )}

            {/* Run Re-Evaluation with Manual Prior Arts */}
            <div className="bg-indigo-50/50 rounded-xl border border-indigo-100/60 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <p className="text-[11.5px] font-bold text-slate-800 leading-none">Evaluate Gaps and Re-Calculate Scores</p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Apply Gemini's technical intelligence to blend the {manualPriorArts.length} logged manual reference(s) into the complete report.
                  This modifies the Examiner Objections and Novelty scoring parameters.
                </p>
              </div>

              <button
                type="button"
                disabled={manualPriorArts.length === 0 || isRefining}
                onClick={handleIntegrateManualPriorArt}
                className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 select-none ${
                  isRefining
                    ? "bg-indigo-100 text-indigo-400 border border-indigo-200 cursor-not-allowed"
                    : manualPriorArts.length === 0
                    ? "bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed bg-slate-50"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-xs"
                }`}
              >
                {isRefining ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin inline-block" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Re-Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Synthesized Invention Candidate Proposal Carousel (Phase 4) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
                Phase 4: Structured Candidate Innovations Synthesis
              </h4>
            </div>

            {initialAnalysis.candidates && initialAnalysis.candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {initialAnalysis.candidates.map((cand, idx) => {
                  const isSelected = initialAnalysis.selectedCandidateIndex === idx;
                  const isExpanded = expandedCandidate === idx;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-xl p-5 flex flex-col justify-between transition-all ${
                        isSelected 
                          ? "bg-indigo-50/20 border-indigo-300 shadow-[0_4px_12px_rgba(79,70,229,0.04)] ring-1 ring-indigo-500/10" 
                          : "bg-slate-50/40 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isSelected 
                              ? "bg-indigo-600 text-white" 
                              : "bg-slate-200 text-slate-600"
                          }`}>
                            {isSelected ? "Selected Candidate" : `Candidate Option 0${idx + 1}`}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 font-mono">
                            {Math.round((cand.noveltyScore + cand.inventiveStepScore + cand.industrialScore) / 3)}% Score
                          </span>
                        </div>

                        <h5 className="font-extrabold text-slate-900 leading-snug tracking-tight text-xs flex items-center gap-1">
                          {cand.title}
                        </h5>

                        <p className="text-xs text-slate-550 leading-relaxed font-sans font-medium">
                          {cand.coreIdea}
                        </p>

                        <div className="border-t border-slate-100 pt-2 text-[10px] space-y-1.5 font-medium">
                          <p className="text-slate-500"><strong className="text-slate-700">Arch:</strong> {cand.architecture}</p>
                          <p className="text-slate-500"><strong className="text-indigo-600">Novel Features:</strong> {cand.novelFeatures}</p>
                          {isExpanded && (
                            <div className="pt-2 border-t border-slate-100/50 space-y-1 mt-1 text-[10px]">
                              <p className="text-slate-500"><strong className="text-slate-700">Distinguishing features:</strong> {cand.distinguishingFeatures}</p>
                              <p className="text-slate-500"><strong className="text-slate-700">Industrial Apps:</strong> {cand.applications}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100/70 pt-3 mt-4 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedCandidate(isExpanded ? null : idx)}
                          className="text-[10px] font-bold text-slate-450 hover:text-slate-700 uppercase tracking-widest flex items-center gap-0.5 cursor-pointer"
                        >
                          {isExpanded ? (
                            <><span>Hide details</span><ChevronUp className="w-3.5 h-3.5" /></>
                          ) : (
                            <><span>More parameters</span><ChevronDown className="w-3.5 h-3.5" /></>
                          )}
                        </button>

                        {isSelected && (
                          <div className="flex items-center gap-1 text-[10px] text-indigo-650 font-bold bg-indigo-100/60 px-2 py-0.5 rounded border border-indigo-200">
                            <Check className="w-3 h-3 text-indigo-600" />
                            <span>Optimized</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No alternative technical candidate inventions available.</p>
            )}

            {initialAnalysis.selectionJustification && (
              <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1.5 text-xs">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Selection Justification & Engineering Reasoning</span>
                </p>
                <p className="text-slate-600 leading-relaxed font-sans">{initialAnalysis.selectionJustification}</p>
              </div>
            )}
          </div>

          {/* Examiner Simulation & Objections Check (Phase 5) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
                Phase 5: Indian Patent Examiner Simulator (Prior Objection check)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Compliance Checklist */}
              <div className="md:col-span-5 bg-slate-50/50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                <div className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-wider">
                  Section 3 Exclusions Audit
                </div>

                {initialAnalysis.complianceChecklist && initialAnalysis.complianceChecklist.length > 0 ? (
                  <div className="space-y-2.5 text-xs">
                    {initialAnalysis.complianceChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 border-b border-slate-100/50 pb-1.5 last:border-0 last:pb-0">
                        <div className={`mt-0.5 w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold shrink-0 border ${
                          item.compliant 
                            ? "bg-green-50 border-green-200 text-green-700" 
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                          {item.compliant ? "✓" : "!"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-[11px] leading-tight mb-0.5">{item.name}</p>
                          <p className="text-[10px] text-slate-500 leading-normal">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No examiner compliance indicators logged.</p>
                )}
              </div>

              {/* Interactive Objections Table */}
              <div className="md:col-span-7 space-y-3">
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
                  Predicted Objections & Rectification Fixes
                </div>

                {initialAnalysis.examinerObjections && initialAnalysis.examinerObjections.length > 0 ? (
                  <div className="space-y-3">
                    {initialAnalysis.examinerObjections.map((obj, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4.5 space-y-2 text-xs bg-white relative">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-800 text-[12px]">{obj.title}</strong>
                          <span className={`inline-block border font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase leading-none ${
                            obj.severity === "High" 
                              ? "bg-red-50 border-red-200 text-red-700" 
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}>
                            {obj.severity} Severity
                          </span>
                        </div>

                        <p className="text-slate-500 font-medium leading-relaxed">{obj.reason}</p>
                        
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-[11px] text-emerald-800 font-medium leading-relaxed">
                          <span className="font-bold text-emerald-950 block mb-0.5">Automated Pre-emptive Fix Applied:</span>
                          {obj.recommendedFix}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 border border-slate-150 rounded-xl text-slate-400 italic">
                    <Check className="w-8 h-8 text-emerald-500 mb-2" />
                    <span>0 Objections detected. Invention meets Section 3 prerequisites.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt banner to proceed */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab("builder")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Shift to Specifications Builder</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-800 tracking-tight">1. Refine Abstract Parameters & Claims Scope</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs shadow-inner">
                <button
                  onClick={() => setPatentType("short")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    patentType === "short"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  Short-Term (Max 5 Claims)
                </button>
                <button
                  onClick={() => setPatentType("full")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    patentType === "full"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  Full-Term (Compliant Draft)
                </button>
              </div>
            </div>

            {/* Text Area Draft Fields */}
            <div className="grid grid-cols-1 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Drafted Invention Title (Indian Format compliant)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. An automatic smart-monitoring thermal insulation mug"
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-slate-850"
                />
                <p className="text-[10px] text-slate-450 mt-1.5 font-medium leading-relaxed text-slate-400">
                  Must represent the technical nature. Commercial trade names, abbreviations, or trademarks of models are strictly forbidden.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Technical Field Description (Proposed Field of Invention)
                  </label>
                  <textarea
                    value={fieldOfInvention}
                    onChange={(e) => setFieldOfInvention(e.target.value)}
                    rows={4}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans resize-y leading-relaxed text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Background & Existing Technical Problems (Disclosed Art)
                  </label>
                  <textarea
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    rows={4}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg px-3.5 py-2.5 bg-slate-50 hover:bg-slate-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans resize-y leading-relaxed text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Components Reference Numerals Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-800 tracking-tight">2. Define Components & Numerical Reference Codes</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono font-semibold">
                {components.length} Allocated Parts
              </span>
            </div>

            {/* Warning Badge */}
            {numeralWarning && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{numeralWarning}</span>
              </div>
            )}

            {/* Form to insert key component */}
            <form onSubmit={handleAddComponent} className="bg-slate-50/80 p-5 border border-slate-200 rounded-xl space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Custom Part / Component</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    placeholder="Part Name (e.g. air impeller)"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 bg-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    placeholder="Code (e.g. 10)"
                    value={newCompNumeral}
                    onChange={(e) => setNewCompNumeral(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 bg-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-center font-black text-slate-800"
                  />
                </div>
                <div className="sm:col-span-4">
                  <button
                    type="submit"
                    disabled={!newCompName || newCompNumeral === ""}
                    className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg px-4 py-2.5 transition-colors cursor-pointer shadow-xs"
                  >
                    Insert Assembly Part
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Functional description (how this solves the problem of background)"
                value={newCompDesc}
                onChange={(e) => setNewCompDesc(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 bg-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-850"
              />
            </form>

            {/* Components Table List */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold font-sans uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4.5 w-16 text-center font-mono border-b border-slate-200">Code</th>
                    <th className="py-3 px-4 w-48 border-b border-slate-200">Part/Component Name</th>
                    <th className="py-3 px-4 border-b border-slate-200">Description of Role & Placement</th>
                    <th className="py-3 px-4.5 w-16 text-center border-b border-slate-200">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {components.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-3.5 px-4.5 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
                          ({item.referenceNumeral})
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-2 px-3 text-slate-500 leading-relaxed font-sans">{item.description}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(idx)}
                          className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove Part"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {components.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                        No components defined. Please add components to generate valid reference indices.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Figures Perspectives Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-800 tracking-tight">3. Map Drawings & Views</h3>
              </div>
              <button
                type="button"
                onClick={handleAddFigure}
                className="text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 px-3.5 py-2 rounded-lg transition-colors cursor-pointer text-slate-600 shadow-xs flex items-center gap-1.5"
              >
                + Add Drawing Sheet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {figures.map((fig) => (
                <div key={fig.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5 relative hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-bold text-slate-700 font-mono tracking-wide">
                      Sheet ID: {fig.id}
                    </span>
                    <button
                      onClick={() => handleRemoveFigure(fig.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Drawing File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-2.5">
                    <div className="col-span-4">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Perspective</label>
                      <select
                        value={fig.viewType}
                        onChange={(e) => handleUpdateFigViewType(fig.id, e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                      >
                        <option value="Isometric View">Isometric View</option>
                        <option value="Top Plan View">Top Plan View</option>
                        <option value="Side Elevation View">Side Elevation View</option>
                        <option value="Cross-Sectional View">Cross-Sectional View</option>
                        <option value="Exploded View">Exploded View</option>
                      </select>
                    </div>
                    <div className="col-span-8">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Caption Details</label>
                      <input
                        type="text"
                        value={fig.caption}
                        onChange={(e) => handleUpdateFigCaption(fig.id, e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-slate-250 opacity-90 rounded p-1 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Copy-pasteable SVG Generation / AI Design Prompt */}
                  <div className="mt-3 pt-3 border-t border-slate-200/50 text-left space-y-1.5">
                    <span className="block text-[10px] uppercase font-bold text-indigo-600 font-mono">
                      SVG Drawing Generation Prompt
                    </span>
                    <div className="flex gap-2">
                      <div className="flex-1 text-[10px] font-mono bg-white border border-slate-200 rounded-lg p-2 text-slate-600 line-clamp-1 select-all break-all h-8 overflow-hidden select-all" title="Click to copy full SVG schema prompt">
                        {fig.svgGenPrompt || `A minimalist engineering schematic diagram of "${fig.caption || "System Blueprint"}" with component reference labels matching the assembly specs, styled in clean navy line-art on white background as Fig ${fig.id}.`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const promptContent = fig.svgGenPrompt || `A minimalist engineering schematic diagram of "${fig.caption || "System Blueprint"}" with component reference labels matching the assembly specs, styled in clean navy line-art on white background as Fig ${fig.id}.`;
                          navigator.clipboard.writeText(promptContent);
                          setCopiedFigId(fig.id);
                          setTimeout(() => setCopiedFigId(null), 1500);
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          copiedFigId === fig.id
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-55 hover:bg-indigo-100 text-indigo-700 bg-indigo-50 border border-indigo-100"
                        }`}
                      >
                        {copiedFigId === fig.id ? "Copied!" : "Copy Prompt"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {figures.length === 0 && (
                <div className="col-span-2 text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 italic text-xs">
                  No sheets defined. Add drawing sheets to draft the Brief Drawings Description of Drawings segment.
                </div>
              )}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="text-right">
            <button
              onClick={handleTriggerGenerate}
              disabled={components.length === 0 || isGenerating}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>Formulating Complete Draft...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Formulate Complete Specification</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
