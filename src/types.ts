/**
 * Shareable TypeScript interfaces and types for the Indian Patent Draft Designer.
 */

export interface ComponentItem {
  name: string;
  referenceNumeral: number;
  description: string;
}

export interface FigureItem {
  id: string; // e.g. "Fig.1"
  caption: string; // e.g. "isometric side view of the smart helmet"
  viewType: string; // e.g. "Isometric View", "Side View"
}

export interface PriorArtItem {
  title: string;
  patentNumber: string;
  year: number;
  assignee: string;
  summary: string;
  features: string;
  limitation: string;
}

export interface CandidateInvention {
  title: string;
  coreIdea: string;
  architecture: string;
  novelFeatures: string;
  distinguishingFeatures: string;
  applications: string;
  noveltyScore: number;
  inventiveStepScore: number;
  industrialScore: number;
  commercialScore: number;
}

export interface ObjectionItem {
  title: string;
  reason: string;
  severity: string;
  recommendedFix: string;
}

export interface ComplianceChecklistItem {
  name: string;
  compliant: boolean;
  notes: string;
}

export interface PatentAnalysis {
  title: string;
  fieldOfInvention: string;
  background: string;
  suggestedComponents: ComponentItem[];
  suggestedFigures: FigureItem[];
  
  // Phase 1 to 6 Analysis results
  keyChallenges?: string[];
  fiveProblems?: string[];
  limitationsExplanation?: string;
  priorArtReferences?: PriorArtItem[];
  priorArtKeywords?: string[];
  noveltyGaps?: string[];
  noveltyOpportunities?: Array<{
    opportunity: string;
    commercialValue: number;
    technicalFeasibility: number;
    patentability: number;
  }>;
  candidates?: CandidateInvention[];
  selectedCandidateIndex?: number;
  selectionJustification?: string;
  examinerObjections?: ObjectionItem[];
  complianceChecklist?: ComplianceChecklistItem[];
  noveltyScore?: number;
  inventiveStepScore?: number;
  industrialScore?: number;
  enablementScore?: number;
  sec3ComplianceScore?: number;
  filingReadinessScore?: number;
  patentabilityFeedback?: string;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export interface ObjectivesOfInvention {
  primary: string;
  secondary: string;
  terrestrial: string;
  further: string;
  closing: string;
}

export interface PatentDrawingShape {
  type: "line" | "rect" | "circle" | "text" | "path" | string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  r?: number;
  width?: number;
  height?: number;
  d?: string;
  text?: string;
  isPointer?: boolean;
}

export interface PatentDrawing {
  figureId: string; // e.g. "Fig.1"
  title: string; // e.g. "Isometric Elevation view"
  shapes: PatentDrawingShape[];
}

export interface PatentSpecification {
  title: string;
  fieldOfTheInvention: string;
  backgroundToTheInvention: string;
  objectivesOfInvention: ObjectivesOfInvention;
  briefDescriptionOfDrawings: string[];
  detailedDescription: string[];
  claims: string[];
  abstractText: string;
  abstractFigureNumber: string;
}

export interface FinalAuditInfo {
  filingReadinessScore: number;
  strengths: string[];
  weaknesses: string[];
  potentialRejectionRisks: string[];
  recommendedImprovements: string[];
}

export interface DraftedPatentResponse {
  specifications: PatentSpecification;
  drawings: PatentDrawing[];
  finalAudit?: FinalAuditInfo;
}
