// OpenAI Service - GPT-4o Vision for Antique Analysis
// October 2025

import OpenAI from 'openai';
import { env } from '../config/env.js';
import { ExternalServiceError, ValidationError } from '../middleware/error.js';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Analysis result schema
const AnalysisResultSchema = z.object({
  name: z.string().min(1),
  era: z.string().optional(),
  style: z.string().optional(),
  description: z.string().min(10),
  historicalContext: z.string().min(10),
  estimatedValueMin: z.number().int().nonnegative().optional(),
  estimatedValueMax: z.number().int().nonnegative().optional(),
  confidence: z.number().min(0).max(1),
  stylingSuggestions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      roomType: z.string(),
      placement: z.string().optional(),
      complementaryItems: z.array(z.string()),
      colorPalette: z.array(z.string()),
      designTips: z.string().optional(),
    })
  ).optional(),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Analyze antique image with GPT-4o Vision
export async function analyzeAntiqueImage(imageBase64: string): Promise<AnalysisResult> {
  try {
    // Validate image format
    if (!imageBase64.startsWith('data:image/')) {
      throw new ValidationError('Invalid image format. Must be a data URL.');
    }

    console.log('🔍 Analyzing antique image with GPT-4o Vision...');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are VintageVision, an expert antique and vintage item identifier with expertise in interior design. Analyze the provided image and identify the item with these details:

1. NAME: What is this item? Be specific (e.g., "Victorian Mahogany Side Table" not just "table")
2. ERA: When was it made? (e.g., "1890s", "Mid-Century Modern 1950s-1960s")
3. STYLE: What style/movement? (e.g., "Art Deco", "Victorian", "Mid-Century Modern")
4. DESCRIPTION: Brief 2-3 sentence physical description of the item
5. HISTORICAL_CONTEXT: 2-3 paragraphs about the historical background, cultural significance, or story behind this type of item. Make this rich and engaging.
6. VALUE_RANGE: Estimated market value range in USD (min and max)
7. CONFIDENCE: Your confidence level from 0.0 to 1.0
8. STYLING_SUGGESTIONS: 3-4 specific styling ideas for incorporating this item into modern home decor

Respond in JSON format:
{
  "name": "string",
  "era": "string",
  "style": "string",
  "description": "string",
  "historicalContext": "string (2-3 rich paragraphs)",
  "estimatedValueMin": number,
  "estimatedValueMax": number,
  "confidence": number,
  "stylingSuggestions": [
    {
      "title": "Catchy styling idea title",
      "description": "Detailed styling description with specific placement and design tips",
      "roomType": "Room name (e.g., Living Room, Home Office, Bedroom)",
      "complementaryItems": ["Specific item 1", "Specific item 2", "Specific item 3"],
      "colorPalette": ["#HEX1", "#HEX2", "#HEX3"]
    }
  ]
}

Focus on antiques and vintage items (pre-1990s generally). If it's modern/contemporary, note that but still provide interesting context. For styling, be specific, creative, and practical. Make the historical context engaging and informative with multiple paragraphs.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this vintage/antique item and provide styling suggestions:',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 2500,
      temperature: 0.3, // Lower temperature for more consistent results
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new ExternalServiceError('No response from OpenAI', 'OpenAI');
    }

    // Parse and validate response
    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
    } catch (error) {
      console.error('❌ Failed to parse OpenAI response:', content);
      throw new ExternalServiceError('Invalid response format from OpenAI', 'OpenAI');
    }

    // Validate against schema
    const validatedResult = AnalysisResultSchema.parse(parsedResult);

    console.log(`✅ Analysis complete: ${validatedResult.name} (confidence: ${validatedResult.confidence})`);

    return validatedResult;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      throw new ValidationError('Analysis result validation failed');
    }

    if (error instanceof OpenAI.APIError) {
      console.error('❌ OpenAI API error:', error.message);
      throw new ExternalServiceError(
        `OpenAI API error: ${error.message}`,
        'OpenAI'
      );
    }

    throw error;
  }
}

// Generate marketplace search links
export function generateMarketplaceLinks(itemName: string, era?: string, estimatedValueMin?: number) {
  const searchTerm = encodeURIComponent(`${itemName} ${era || 'antique'}`);
  const priceFilter = estimatedValueMin ? `&_udlo=${estimatedValueMin * 0.7}` : '';

  return [
    {
      marketplace: 'eBay',
      url: `https://www.ebay.com/sch/i.html?_nkw=${searchTerm}${priceFilter}`,
    },
    {
      marketplace: 'Etsy',
      url: `https://www.etsy.com/search?q=${searchTerm}`,
    },
    {
      marketplace: 'Chairish',
      url: `https://www.chairish.com/search?q=${searchTerm}`,
    },
    {
      marketplace: '1stDibs',
      url: `https://www.1stdibs.com/search/?q=${searchTerm}`,
    },
  ];
}

// Health check for OpenAI API with 5 second timeout
export async function checkOpenAIHealth(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Health check timeout')), 5000)
    );

    const healthCheckPromise = openai.models.list();

    const response = await Promise.race([healthCheckPromise, timeoutPromise]);
    return response.data.length > 0;
  } catch (error) {
    console.error('❌ OpenAI health check failed:', error);
    return false;
  }
}

console.log('✅ OpenAI service initialized');
