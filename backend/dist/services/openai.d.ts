import { z } from 'zod';
declare const AnalysisResultSchema: z.ZodObject<{
    name: z.ZodString;
    era: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    historicalContext: z.ZodString;
    estimatedValueMin: z.ZodOptional<z.ZodNumber>;
    estimatedValueMax: z.ZodOptional<z.ZodNumber>;
    confidence: z.ZodNumber;
    stylingSuggestions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        roomType: z.ZodString;
        placement: z.ZodOptional<z.ZodString>;
        complementaryItems: z.ZodArray<z.ZodString, "many">;
        colorPalette: z.ZodArray<z.ZodString, "many">;
        designTips: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | undefined;
        designTips?: string | undefined;
    }, {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | undefined;
        designTips?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    historicalContext: string;
    confidence: number;
    era?: string | undefined;
    style?: string | undefined;
    estimatedValueMin?: number | undefined;
    estimatedValueMax?: number | undefined;
    stylingSuggestions?: {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | undefined;
        designTips?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    description: string;
    historicalContext: string;
    confidence: number;
    era?: string | undefined;
    style?: string | undefined;
    estimatedValueMin?: number | undefined;
    estimatedValueMax?: number | undefined;
    stylingSuggestions?: {
        description: string;
        title: string;
        roomType: string;
        complementaryItems: string[];
        colorPalette: string[];
        placement?: string | undefined;
        designTips?: string | undefined;
    }[] | undefined;
}>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export declare function analyzeAntiqueImage(imageBase64: string): Promise<AnalysisResult>;
export declare function generateMarketplaceLinks(itemName: string, era?: string, estimatedValueMin?: number): {
    marketplace: string;
    url: string;
}[];
export declare function checkOpenAIHealth(): Promise<boolean>;
export {};
//# sourceMappingURL=openai.d.ts.map