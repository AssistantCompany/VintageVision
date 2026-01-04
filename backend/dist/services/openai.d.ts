import { z } from 'zod';
export type ProductCategory = 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';
export type DomainExpert = 'furniture' | 'ceramics' | 'glass' | 'silver' | 'jewelry' | 'watches' | 'art' | 'textiles' | 'toys' | 'books' | 'tools' | 'lighting' | 'electronics' | 'vehicles' | 'general';
export type DealRating = 'exceptional' | 'good' | 'fair' | 'overpriced';
export type FlipDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type AuthenticityRisk = 'low' | 'medium' | 'high' | 'very_high';
export type AuthCheckCategory = 'visual' | 'physical' | 'documentation' | 'provenance';
export type AuthCheckPriority = 'critical' | 'important' | 'helpful';
export type PhotoRequestPriority = 'required' | 'recommended' | 'optional';
declare const AuthenticationCheckSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodEnum<["visual", "physical", "documentation", "provenance"]>;
    priority: z.ZodEnum<["critical", "important", "helpful"]>;
    check: z.ZodString;
    howTo: z.ZodString;
    whatToLookFor: z.ZodString;
    redFlagSigns: z.ZodArray<z.ZodString, "many">;
    requiresExpert: z.ZodBoolean;
    photoHelpful: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: "visual" | "physical" | "documentation" | "provenance";
    priority: "critical" | "important" | "helpful";
    check: string;
    howTo: string;
    whatToLookFor: string;
    redFlagSigns: string[];
    requiresExpert: boolean;
    photoHelpful: boolean;
}, {
    id: string;
    category: "visual" | "physical" | "documentation" | "provenance";
    priority: "critical" | "important" | "helpful";
    check: string;
    howTo: string;
    whatToLookFor: string;
    redFlagSigns: string[];
    requiresExpert: boolean;
    photoHelpful: boolean;
}>;
declare const PhotoRequestSchema: z.ZodObject<{
    id: z.ZodString;
    area: z.ZodString;
    reason: z.ZodString;
    whatToCapture: z.ZodString;
    priority: z.ZodEnum<["required", "recommended", "optional"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    priority: "required" | "recommended" | "optional";
    area: string;
    reason: string;
    whatToCapture: string;
}, {
    id: string;
    priority: "required" | "recommended" | "optional";
    area: string;
    reason: string;
    whatToCapture: string;
}>;
declare const AuthenticationAnalysisSchema: z.ZodObject<{
    authenticationConfidence: z.ZodNumber;
    authenticityRisk: z.ZodEnum<["low", "medium", "high", "very_high"]>;
    checklist: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodEnum<["visual", "physical", "documentation", "provenance"]>;
        priority: z.ZodEnum<["critical", "important", "helpful"]>;
        check: z.ZodString;
        howTo: z.ZodString;
        whatToLookFor: z.ZodString;
        redFlagSigns: z.ZodArray<z.ZodString, "many">;
        requiresExpert: z.ZodBoolean;
        photoHelpful: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        category: "visual" | "physical" | "documentation" | "provenance";
        priority: "critical" | "important" | "helpful";
        check: string;
        howTo: string;
        whatToLookFor: string;
        redFlagSigns: string[];
        requiresExpert: boolean;
        photoHelpful: boolean;
    }, {
        id: string;
        category: "visual" | "physical" | "documentation" | "provenance";
        priority: "critical" | "important" | "helpful";
        check: string;
        howTo: string;
        whatToLookFor: string;
        redFlagSigns: string[];
        requiresExpert: boolean;
        photoHelpful: boolean;
    }>, "many">;
    knownFakeIndicators: z.ZodArray<z.ZodString, "many">;
    photosRequested: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        area: z.ZodString;
        reason: z.ZodString;
        whatToCapture: z.ZodString;
        priority: z.ZodEnum<["required", "recommended", "optional"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        priority: "required" | "recommended" | "optional";
        area: string;
        reason: string;
        whatToCapture: string;
    }, {
        id: string;
        priority: "required" | "recommended" | "optional";
        area: string;
        reason: string;
        whatToCapture: string;
    }>, "many">;
    expertReferralRecommended: z.ZodBoolean;
    expertReferralReason: z.ZodNullable<z.ZodString>;
    overallAssessment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    authenticationConfidence: number;
    authenticityRisk: "low" | "medium" | "high" | "very_high";
    knownFakeIndicators: string[];
    expertReferralRecommended: boolean;
    expertReferralReason: string | null;
    checklist: {
        id: string;
        category: "visual" | "physical" | "documentation" | "provenance";
        priority: "critical" | "important" | "helpful";
        check: string;
        howTo: string;
        whatToLookFor: string;
        redFlagSigns: string[];
        requiresExpert: boolean;
        photoHelpful: boolean;
    }[];
    photosRequested: {
        id: string;
        priority: "required" | "recommended" | "optional";
        area: string;
        reason: string;
        whatToCapture: string;
    }[];
    overallAssessment: string;
}, {
    authenticationConfidence: number;
    authenticityRisk: "low" | "medium" | "high" | "very_high";
    knownFakeIndicators: string[];
    expertReferralRecommended: boolean;
    expertReferralReason: string | null;
    checklist: {
        id: string;
        category: "visual" | "physical" | "documentation" | "provenance";
        priority: "critical" | "important" | "helpful";
        check: string;
        howTo: string;
        whatToLookFor: string;
        redFlagSigns: string[];
        requiresExpert: boolean;
        photoHelpful: boolean;
    }[];
    photosRequested: {
        id: string;
        priority: "required" | "recommended" | "optional";
        area: string;
        reason: string;
        whatToCapture: string;
    }[];
    overallAssessment: string;
}>;
export type AuthenticationCheck = z.infer<typeof AuthenticationCheckSchema>;
export type PhotoRequest = z.infer<typeof PhotoRequestSchema>;
export type AuthenticationAnalysis = z.infer<typeof AuthenticationAnalysisSchema>;
declare const WorldClassAnalysisSchema: z.ZodObject<{
    name: z.ZodString;
    maker: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modelNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    brand: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    productCategory: z.ZodEnum<["antique", "vintage", "modern_branded", "modern_generic"]>;
    domainExpert: z.ZodString;
    itemSubcategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    era: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    style: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    periodStart: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    periodEnd: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    originRegion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodString;
    historicalContext: z.ZodString;
    attributionNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    estimatedValueMin: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number | null | undefined, number | null | undefined>;
    estimatedValueMax: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number | null | undefined, number | null | undefined>;
    currentRetailPrice: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number | null | undefined, number | null | undefined>;
    comparableSales: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        venue: z.ZodString;
        price: z.ZodNumber;
        date: z.ZodString;
        relevance: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: string;
        description: string;
        venue: string;
        price: number;
        relevance: string;
    }, {
        date: string;
        description: string;
        venue: string;
        price: number;
        relevance: string;
    }>, "many">>>;
    confidence: z.ZodNumber;
    identificationConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    makerConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    evidenceFor: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    evidenceAgainst: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    alternativeCandidates: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        confidence: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        confidence: number;
        reason: string;
    }, {
        name: string;
        confidence: number;
        reason: string;
    }>, "many">>>;
    verificationTips: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    redFlags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    flipDifficulty: z.ZodOptional<z.ZodNullable<z.ZodEnum<["easy", "moderate", "hard", "very_hard"]>>>;
    flipTimeEstimate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resaleChannels: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    productUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    stylingSuggestions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        roomType: z.ZodString;
        placement: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        complementaryItems: z.ZodArray<z.ZodString, "many">;
        colorPalette: z.ZodArray<z.ZodString, "many">;
        designTips: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | null | undefined;
        designTips?: string | null | undefined;
    }, {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | null | undefined;
        designTips?: string | null | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    historicalContext: string;
    confidence: number;
    productCategory: "antique" | "vintage" | "modern_branded" | "modern_generic";
    domainExpert: string;
    brand?: string | null | undefined;
    era?: string | null | undefined;
    style?: string | null | undefined;
    estimatedValueMin?: number | null | undefined;
    estimatedValueMax?: number | null | undefined;
    stylingSuggestions?: {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | null | undefined;
        designTips?: string | null | undefined;
    }[] | null | undefined;
    modelNumber?: string | null | undefined;
    productUrl?: string | null | undefined;
    currentRetailPrice?: number | null | undefined;
    flipDifficulty?: "easy" | "moderate" | "hard" | "very_hard" | null | undefined;
    flipTimeEstimate?: string | null | undefined;
    resaleChannels?: string[] | null | undefined;
    identificationConfidence?: number | null | undefined;
    evidenceFor?: string[] | null | undefined;
    evidenceAgainst?: string[] | null | undefined;
    alternativeCandidates?: {
        name: string;
        confidence: number;
        reason: string;
    }[] | null | undefined;
    verificationTips?: string[] | null | undefined;
    redFlags?: string[] | null | undefined;
    itemSubcategory?: string | null | undefined;
    comparableSales?: {
        date: string;
        description: string;
        venue: string;
        price: number;
        relevance: string;
    }[] | null | undefined;
    maker?: string | null | undefined;
    makerConfidence?: number | null | undefined;
    attributionNotes?: string | null | undefined;
    periodStart?: number | null | undefined;
    periodEnd?: number | null | undefined;
    originRegion?: string | null | undefined;
}, {
    name: string;
    description: string;
    historicalContext: string;
    confidence: number;
    productCategory: "antique" | "vintage" | "modern_branded" | "modern_generic";
    domainExpert: string;
    brand?: string | null | undefined;
    era?: string | null | undefined;
    style?: string | null | undefined;
    estimatedValueMin?: number | null | undefined;
    estimatedValueMax?: number | null | undefined;
    stylingSuggestions?: {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | null | undefined;
        designTips?: string | null | undefined;
    }[] | null | undefined;
    modelNumber?: string | null | undefined;
    productUrl?: string | null | undefined;
    currentRetailPrice?: number | null | undefined;
    flipDifficulty?: "easy" | "moderate" | "hard" | "very_hard" | null | undefined;
    flipTimeEstimate?: string | null | undefined;
    resaleChannels?: string[] | null | undefined;
    identificationConfidence?: number | null | undefined;
    evidenceFor?: string[] | null | undefined;
    evidenceAgainst?: string[] | null | undefined;
    alternativeCandidates?: {
        name: string;
        confidence: number;
        reason: string;
    }[] | null | undefined;
    verificationTips?: string[] | null | undefined;
    redFlags?: string[] | null | undefined;
    itemSubcategory?: string | null | undefined;
    comparableSales?: {
        date: string;
        description: string;
        venue: string;
        price: number;
        relevance: string;
    }[] | null | undefined;
    maker?: string | null | undefined;
    makerConfidence?: number | null | undefined;
    attributionNotes?: string | null | undefined;
    periodStart?: number | null | undefined;
    periodEnd?: number | null | undefined;
    originRegion?: string | null | undefined;
}>;
export type AnalysisResult = z.infer<typeof WorldClassAnalysisSchema>;
export interface WorldClassResult extends AnalysisResult {
    askingPrice?: number | null;
    dealRating?: DealRating | null;
    dealExplanation?: string | null;
    profitPotentialMin?: number | null;
    profitPotentialMax?: number | null;
    authenticationConfidence?: number | null;
    authenticityRisk?: AuthenticityRisk | null;
    authenticationChecklist?: AuthenticationCheck[] | null;
    knownFakeIndicators?: string[] | null;
    additionalPhotosRequested?: PhotoRequest[] | null;
    expertReferralRecommended?: boolean | null;
    expertReferralReason?: string | null;
    authenticationAssessment?: string | null;
}
export declare function analyzeAntiqueImage(imageBase64: string, askingPrice?: number): Promise<WorldClassResult>;
export declare function generateMarketplaceLinks(itemName: string, era?: string, estimatedValueMin?: number, productCategory?: ProductCategory, brand?: string, modelNumber?: string, domainExpert?: string): {
    marketplaceName: string;
    linkUrl: string;
}[];
export declare function checkOpenAIHealth(): Promise<boolean>;
export {};
//# sourceMappingURL=openai.d.ts.map