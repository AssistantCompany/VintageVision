import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { 
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME
} from "@getmocha/users-service/backend";
import OpenAI from "openai";
import { z } from "zod";
import { 
  handleWorkerError, 
  DatabaseError,
  ExternalServiceError
} from "./error-handlers";

interface Env {
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_KEY: string;
  MOCHA_USERS_SERVICE_API_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Enhanced analyze endpoint with styling suggestions
const AnalyzeRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
});

app.post("/api/analyze", zValidator("json", AnalyzeRequestSchema), async (c) => {
  try {
    const { image: imageData } = c.req.valid("json");
    
    console.log("Analyze request received, image data length:", imageData.length);
    console.log("Image data format:", imageData.substring(0, 50) + "...");
    
    // Validate image data format
    if (!imageData.startsWith('data:image/')) {
      console.error("Invalid image format - doesn't start with data:image/");
      return c.json({ 
        success: false, 
        error: "Invalid image format. Expected data URL starting with 'data:image/'" 
      }, 400);
    }

    // More thorough validation of supported formats
    const supportedFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png', 'data:image/webp', 'data:image/gif'];
    const isValidFormat = supportedFormats.some(format => imageData.toLowerCase().startsWith(format));
    
    if (!isValidFormat) {
      console.error("Unsupported image format detected:", imageData.substring(0, 30));
      return c.json({ 
        success: false, 
        error: "Unsupported image format. Please use JPG, PNG, WebP, or GIF images only." 
      }, 400);
    }

    // Validate base64 data
    try {
      const base64Data = imageData.split(',')[1];
      if (!base64Data || base64Data.length < 20) {
        throw new Error('Invalid base64 data - too short');
      }
      // Test if it's valid base64 by decoding a small portion
      const testLength = Math.min(base64Data.length, 100);
      atob(base64Data.substring(0, testLength));
      console.log("Base64 validation passed, data length:", base64Data.length);
    } catch (base64Error) {
      console.error("Invalid base64 data:", base64Error, "Data preview:", imageData.substring(0, 100));
      return c.json({ 
        success: false, 
        error: "Invalid image data format. Please try uploading the image again." 
      }, 400);
    }

    // Size validation
    const estimatedSize = (imageData.length * 3) / 4;
    console.log("Estimated image size:", Math.round(estimatedSize / 1024), "KB");
    
    if (estimatedSize > 20 * 1024 * 1024) { // 20MB limit for OpenAI
      return c.json({ 
        success: false, 
        error: "Image too large. Please use an image under 20MB." 
      }, 400);
    }
    
    if (estimatedSize < 100) { // 100 bytes minimum
      console.log("Image rejected - too small:", estimatedSize, "bytes");
      return c.json({ 
        success: false, 
        error: "Image too small or corrupted. Please try a different image." 
      }, 400);
    }
    
    // Validate OpenAI API key
    if (!c.env.OPENAI_API_KEY) {
      return c.json({ 
        success: false, 
        error: "OpenAI API key not configured" 
      }, 500);
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    console.log("Calling OpenAI API with image...");
    console.log("Image format check:", {
      startsWith: imageData.substring(0, 50),
      length: imageData.length,
      hasComma: imageData.includes(','),
      base64Length: imageData.split(',')[1]?.length || 0
    });
    
    // Call OpenAI API with proper error handling
    let response;
    try {
      response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
        {
          role: "system",
          content: `You are VintageVision, an expert antique and vintage item identifier with expertise in interior design. Analyze the provided image and identify the item with these details:

1. NAME: What is this item? Be specific (e.g., "Victorian Mahogany Side Table" not just "table")
2. ERA: When was it made? (e.g., "1890s", "Mid-Century Modern 1950s-1960s")  
3. STYLE: What style/movement? (e.g., "Art Deco", "Victorian", "Mid-Century Modern")
4. DESCRIPTION: Brief 2-3 sentence description of the item
5. HISTORICAL_CONTEXT: 2-3 paragraphs about the historical background, cultural significance, or story behind this type of item
6. VALUE_RANGE: Estimated market value range in USD (min and max)
7. CONFIDENCE: Your confidence level from 0.0 to 1.0
8. STYLING_SUGGESTIONS: 3-4 specific styling ideas for incorporating this item into modern home decor, including room placement, complementary pieces, and design tips

Respond in JSON format:
{
  "name": "string",
  "era": "string",
  "style": "string", 
  "description": "string",
  "historicalContext": "string",
  "estimatedValueMin": number,
  "estimatedValueMax": number,
  "confidence": number,
  "stylingSuggestions": [
    {
      "title": "string",
      "description": "string", 
      "roomType": "string",
      "complementaryItems": ["string", "string"],
      "colorPalette": ["string", "string"]
    }
  ]
}

Focus on antiques and vintage items (pre-1990s generally). If it's modern/contemporary, note that but still provide interesting context. For styling, be specific and practical.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this vintage/antique item and provide styling suggestions:"
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });
    } catch (openaiError: any) {
      console.error("OpenAI API error details:", {
        message: openaiError?.message,
        code: openaiError?.code,
        type: openaiError?.type,
        status: openaiError?.status,
        error: openaiError?.error
      });
      
      // More specific error messages
      let userFriendlyMessage = 'AI analysis service temporarily unavailable';
      
      if (openaiError?.code === 'invalid_image_format' || openaiError?.code === 'image_parse_error') {
        userFriendlyMessage = 'The image format is not supported by our AI service. Please try uploading a different image (JPG, PNG, WebP, or GIF).';
      } else if (openaiError?.code === 'image_url_invalid') {
        userFriendlyMessage = 'Unable to process the image data. Please try uploading the image again.';
      } else if (openaiError?.message?.includes('unsupported image') || openaiError?.message?.includes('image is valid')) {
        userFriendlyMessage = 'The image could not be processed by our AI service. Please try a different image or ensure it\'s a valid JPG, PNG, WebP, or GIF file.';
      } else if (openaiError?.message?.includes('rate_limit')) {
        userFriendlyMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (openaiError?.message?.includes('quota')) {
        userFriendlyMessage = 'Service temporarily unavailable due to high demand. Please try again later.';
      } else if (openaiError?.message?.includes('400')) {
        userFriendlyMessage = 'The image format or quality is not compatible with our AI analysis. Please try a different image.';
      }
      
      throw new ExternalServiceError('OpenAI', userFriendlyMessage, { 
        code: openaiError?.code, 
        type: openaiError?.type,
        originalMessage: openaiError?.message 
      });
    }

    const content = response.choices[0]?.message?.content;
    console.log("OpenAI response received, content length:", content?.length || 0);
    
    if (!content) {
      console.error("No content in OpenAI response:", response);
      throw new ExternalServiceError('OpenAI', 'No analysis content received from AI service');
    }

    // Parse the AI response with better error handling
    let analysisData;
    try {
      // Clean the content in case there are markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new ExternalServiceError('OpenAI', 'Invalid response format from AI service');
    }

    // Generate unique ID and create analysis record
    const analysisId = crypto.randomUUID();
    const analysis = {
      id: analysisId,
      name: analysisData.name || "Unknown Item",
      era: analysisData.era,
      style: analysisData.style,
      description: analysisData.description || "No description available",
      historical_context: analysisData.historicalContext || "No historical context available",
      estimated_value_min: analysisData.estimatedValueMin,
      estimated_value_max: analysisData.estimatedValueMax,
      confidence: Math.max(0, Math.min(1, analysisData.confidence || 0.5)),
      image_url: imageData,
      styling_suggestions: JSON.stringify(analysisData.stylingSuggestions || []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Computed properties for compatibility
      historicalContext: analysisData.historicalContext || "No historical context available",
      estimatedValueMin: analysisData.estimatedValueMin,
      estimatedValueMax: analysisData.estimatedValueMax,
      imageUrl: imageData,
      stylingSuggestions: analysisData.stylingSuggestions || [],
      marketplaceLinks: []
    };

    // Save to database with error handling
    try {
      await c.env.DB.prepare(`
        INSERT INTO item_analyses (
          id, name, era, style, description, historical_context, 
          estimated_value_min, estimated_value_max, confidence, image_url, 
          styling_suggestions, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        analysis.id,
        analysis.name,
        analysis.era || null,
        analysis.style || null,
        analysis.description,
        analysis.historical_context,
        analysis.estimated_value_min || null,
        analysis.estimated_value_max || null,
        analysis.confidence,
        analysis.image_url,
        analysis.styling_suggestions,
        analysis.created_at,
        analysis.updated_at
      ).run();
    } catch (dbError: any) {
      console.error("Database save error:", dbError);
      throw new DatabaseError('Failed to save analysis', { 
        originalError: dbError?.message 
      });
    }

    // Generate marketplace links (don't fail if this fails)
    try {
      await generateMarketplaceLinks(c.env.DB, analysisId, analysis.name, analysis.style, analysis.era);
    } catch (marketplaceError) {
      console.warn("Failed to generate marketplace links:", marketplaceError);
      // Don't fail the whole request for marketplace links
    }

    return c.json({ success: true, analysis });
  } catch (error) {
    return handleWorkerError(error);
  }
});

// Generate marketplace search links
async function generateMarketplaceLinks(db: D1Database, analysisId: string, name: string, style?: string, era?: string) {
  const marketplaces = [
    {
      name: 'eBay',
      baseUrl: 'https://www.ebay.com/sch/i.html?_nkw=',
      affiliateParams: '&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338722076&toolid=10001'
    },
    {
      name: 'Etsy',
      baseUrl: 'https://www.etsy.com/search?q=',
      affiliateParams: '&ref=vintage_vision'
    },
    {
      name: 'Chairish',
      baseUrl: 'https://www.chairish.com/search?query=',
      affiliateParams: ''
    }
  ];

  for (const marketplace of marketplaces) {
    const searchTerms = [name, style, era].filter(Boolean).join(' ');
    const encodedTerms = encodeURIComponent(searchTerms);
    const linkUrl = `${marketplace.baseUrl}${encodedTerms}${marketplace.affiliateParams}`;

    await db.prepare(`
      INSERT INTO marketplace_links (id, item_analysis_id, marketplace_name, link_url, confidence_score, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      analysisId,
      marketplace.name,
      linkUrl,
      0.8, // Base confidence for generated links
      new Date().toISOString()
    ).run();
  }
}

// Get analysis by ID with marketplace links
app.get("/api/analysis/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const result = await c.env.DB.prepare(`
      SELECT * FROM item_analyses WHERE id = ?
    `).bind(id).first();

    if (!result) {
      return c.json({ error: "Analysis not found" }, 404);
    }

    // Get marketplace links
    const linksResult = await c.env.DB.prepare(`
      SELECT * FROM marketplace_links WHERE item_analysis_id = ?
    `).bind(id).all();

    const analysis = {
      id: result.id,
      name: result.name,
      era: result.era,
      style: result.style,
      description: result.description,
      historical_context: result.historical_context,
      estimated_value_min: result.estimated_value_min,
      estimated_value_max: result.estimated_value_max,
      confidence: result.confidence,
      image_url: result.image_url,
      styling_suggestions: result.styling_suggestions,
      created_at: result.created_at,
      updated_at: result.updated_at,
      historicalContext: result.historical_context,
      estimatedValueMin: result.estimated_value_min,
      estimatedValueMax: result.estimated_value_max,
      imageUrl: result.image_url,
      stylingSuggestions: result.styling_suggestions ? JSON.parse(result.styling_suggestions as string) : [],
      marketplaceLinks: linksResult.results.map((link: any) => ({
        marketplace: link.marketplace_name,
        url: link.link_url,
        priceMin: link.price_min,
        priceMax: link.price_max
      })),
    };

    return c.json({ analysis });

  } catch (error) {
    console.error("Get analysis error:", error);
    return c.json({ error: "Failed to retrieve analysis" }, 500);
  }
});

// Save item to user collection (now with authentication)
const SaveToCollectionSchema = z.object({
  item_analysis_id: z.string(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

app.post("/api/collection", authMiddleware, zValidator("json", SaveToCollectionSchema), async (c) => {
  try {
    const user = c.get("user");
    const { item_analysis_id: itemAnalysisId, notes, location } = c.req.valid("json");
    
    console.log("Saving to collection:", { 
      userId: user?.id, 
      itemAnalysisId, 
      notes, 
      location 
    });
    
    if (!user) {
      console.error("No user found in request");
      return c.json({ error: "Authentication required" }, 401);
    }
    
    // Check if the item analysis exists
    const analysisExists = await c.env.DB.prepare(`
      SELECT id FROM item_analyses WHERE id = ?
    `).bind(itemAnalysisId).first();
    
    if (!analysisExists) {
      console.error("Item analysis not found:", itemAnalysisId);
      return c.json({ error: "Item analysis not found" }, 404);
    }
    
    // Check if already in collection
    const existingItem = await c.env.DB.prepare(`
      SELECT id FROM collection_items WHERE user_id = ? AND item_analysis_id = ?
    `).bind(user.id, itemAnalysisId).first();
    
    if (existingItem) {
      console.log("Item already in collection, updating:", existingItem.id);
      // Update existing item
      await c.env.DB.prepare(`
        UPDATE collection_items 
        SET notes = ?, location = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        notes || null,
        location || null,
        new Date().toISOString(),
        existingItem.id
      ).run();
      
      return c.json({ success: true, id: existingItem.id, updated: true });
    }
    
    const collectionItemId = crypto.randomUUID();
    
    const result = await c.env.DB.prepare(`
      INSERT INTO collection_items (id, user_id, item_analysis_id, notes, location, saved_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      collectionItemId,
      user.id,
      itemAnalysisId,
      notes || null,
      location || null,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();

    console.log("Collection item saved:", { 
      id: collectionItemId, 
      success: result.success,
      changes: result.meta?.changes 
    });

    return c.json({ success: true, id: collectionItemId });

  } catch (error: any) {
    console.error("Save to collection error:", error);
    return c.json({ 
      error: "Failed to save to collection",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, 500);
  }
});

// Get user collection (now with authentication)
app.get("/api/collection", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    
    console.log("Getting collection for user:", user?.id);
    
    if (!user) {
      console.error("No user found in collection request");
      return c.json({ error: "Authentication required" }, 401);
    }
    
    const results = await c.env.DB.prepare(`
      SELECT 
        ci.id as collection_id,
        ci.notes,
        ci.location,
        ci.saved_at,
        ci.updated_at as collection_updated_at,
        ia.id as analysis_id,
        ia.name,
        ia.era,
        ia.style,
        ia.description,
        ia.historical_context,
        ia.estimated_value_min,
        ia.estimated_value_max,
        ia.confidence,
        ia.image_url,
        ia.styling_suggestions,
        ia.created_at
      FROM collection_items ci
      JOIN item_analyses ia ON ci.item_analysis_id = ia.id
      WHERE ci.user_id = ?
      ORDER BY ci.saved_at DESC
    `).bind(user.id).all();

    console.log("Collection query results:", {
      count: results.results.length,
      userId: user.id
    });

    const items = results.results.map((row: any) => ({
      id: row.collection_id,
      item_analysis_id: row.analysis_id,
      name: row.name,
      era: row.era,
      style: row.style,
      description: row.description,
      estimated_value_min: row.estimated_value_min,
      estimated_value_max: row.estimated_value_max,
      image_url: row.image_url,
      notes: row.notes,
      location: row.location,
      saved_at: row.saved_at,
      confidence: row.confidence
    }));

    console.log("Returning collection items:", items.length);

    return c.json({ 
      success: true,
      items: items,
      // Legacy format for compatibility
      collection: results.results.map((row: any) => ({
        id: row.collection_id,
        notes: row.notes,
        location: row.location,
        savedAt: row.saved_at,
        analysis: {
          id: row.analysis_id,
          name: row.name,
          era: row.era,
          style: row.style,
          description: row.description,
          historical_context: row.historical_context,
          estimated_value_min: row.estimated_value_min,
          estimated_value_max: row.estimated_value_max,
          confidence: row.confidence,
          image_url: row.image_url,
          styling_suggestions: row.styling_suggestions,
          created_at: row.created_at,
          updated_at: row.created_at,
          historicalContext: row.historical_context,
          estimatedValueMin: row.estimated_value_min,
          estimatedValueMax: row.estimated_value_max,
          imageUrl: row.image_url,
          stylingSuggestions: row.styling_suggestions ? JSON.parse(row.styling_suggestions) : [],
          marketplaceLinks: [],
        }
      }))
    });

  } catch (error: any) {
    console.error("Get collection error:", error);
    return c.json({ 
      error: "Failed to retrieve collection",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, 500);
  }
});

// Submit feedback on AI analysis
const FeedbackSchema = z.object({
  item_analysis_id: z.string(),
  is_correct: z.boolean(),
  correction_text: z.string().optional(),
  feedback_type: z.enum(['accuracy', 'styling', 'value']).optional(),
});

app.post("/api/feedback", authMiddleware, zValidator("json", FeedbackSchema), async (c) => {
  try {
    const user = c.get("user");
    const { item_analysis_id: itemAnalysisId, is_correct: isCorrect, correction_text: correctionText, feedback_type: feedbackType } = c.req.valid("json");
    
    await c.env.DB.prepare(`
      INSERT INTO analysis_feedback (id, user_id, item_analysis_id, is_correct, correction_text, feedback_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      user!.id,
      itemAnalysisId,
      isCorrect,
      correctionText,
      feedbackType,
      new Date().toISOString()
    ).run();

    return c.json({ success: true });

  } catch (error) {
    console.error("Feedback error:", error);
    return c.json({ error: "Failed to submit feedback" }, 500);
  }
});

// User preferences endpoints
app.get("/api/preferences", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    
    const result = await c.env.DB.prepare(`
      SELECT * FROM user_preferences WHERE user_id = ?
    `).bind(user!.id).first();

    const preferences = result ? {
      preferredStyles: result.preferred_styles ? JSON.parse(result.preferred_styles as string) : [],
      roomTypes: result.room_types ? JSON.parse(result.room_types as string) : [],
      budgetRangeMin: result.budget_range_min,
      budgetRangeMax: result.budget_range_max
    } : {
      preferredStyles: [],
      roomTypes: [],
      budgetRangeMin: null,
      budgetRangeMax: null
    };

    return c.json({ preferences });

  } catch (error) {
    console.error("Get preferences error:", error);
    return c.json({ error: "Failed to retrieve preferences" }, 500);
  }
});

const PreferencesSchema = z.object({
  preferredStyles: z.array(z.string()),
  roomTypes: z.array(z.string()),
  budgetRangeMin: z.number().optional(),
  budgetRangeMax: z.number().optional(),
});

app.post("/api/preferences", authMiddleware, zValidator("json", PreferencesSchema), async (c) => {
  try {
    const user = c.get("user");
    const { preferredStyles, roomTypes, budgetRangeMin, budgetRangeMax } = c.req.valid("json");
    
    // Upsert preferences
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO user_preferences 
      (id, user_id, preferred_styles, room_types, budget_range_min, budget_range_max, updated_at)
      VALUES (COALESCE((SELECT id FROM user_preferences WHERE user_id = ?), ?), ?, ?, ?, ?, ?, ?)
    `).bind(
      user!.id,
      crypto.randomUUID(),
      user!.id,
      JSON.stringify(preferredStyles),
      JSON.stringify(roomTypes),
      budgetRangeMin || null,
      budgetRangeMax || null,
      new Date().toISOString()
    ).run();

    return c.json({ success: true });

  } catch (error) {
    console.error("Save preferences error:", error);
    return c.json({ error: "Failed to save preferences" }, 500);
  }
});

// Wishlist endpoints
app.get("/api/wishlist", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    
    const results = await c.env.DB.prepare(`
      SELECT 
        w.*,
        ia.name,
        ia.era,
        ia.style,
        ia.image_url,
        ia.estimated_value_min,
        ia.estimated_value_max
      FROM user_wishlists w
      LEFT JOIN item_analyses ia ON w.item_analysis_id = ia.id
      WHERE w.user_id = ? AND w.is_active = 1
      ORDER BY w.created_at DESC
    `).bind(user!.id).all();

    const wishlist = results.results.map((row: any) => ({
      id: row.id,
      notes: row.notes,
      searchCriteria: row.search_criteria ? JSON.parse(row.search_criteria) : null,
      createdAt: row.created_at,
      item: row.item_analysis_id ? {
        id: row.item_analysis_id,
        name: row.name,
        era: row.era,
        style: row.style,
        imageUrl: row.image_url,
        estimatedValueMin: row.estimated_value_min,
        estimatedValueMax: row.estimated_value_max
      } : null
    }));

    return c.json({ wishlist });

  } catch (error) {
    console.error("Get wishlist error:", error);
    return c.json({ error: "Failed to retrieve wishlist" }, 500);
  }
});

// Add item to wishlist
const AddWishlistItemSchema = z.object({
  itemAnalysisId: z.string().optional(),
  searchCriteria: z.object({
    style: z.string().optional(),
    era: z.string().optional(),
    category: z.string().optional(),
    maxPrice: z.number().optional(),
  }).optional(),
  notes: z.string().optional(),
});

app.post("/api/wishlist", authMiddleware, zValidator("json", AddWishlistItemSchema), async (c) => {
  try {
    const user = c.get("user");
    const { itemAnalysisId, searchCriteria, notes } = c.req.valid("json");
    
    const wishlistItemId = crypto.randomUUID();
    
    await c.env.DB.prepare(`
      INSERT INTO user_wishlists (id, user_id, item_analysis_id, search_criteria, notes, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      wishlistItemId,
      user!.id,
      itemAnalysisId || null,
      searchCriteria ? JSON.stringify(searchCriteria) : null,
      notes || null,
      1,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();

    return c.json({ success: true, id: wishlistItemId });

  } catch (error) {
    console.error("Add wishlist error:", error);
    return c.json({ error: "Failed to add to wishlist" }, 500);
  }
});

// Analytics endpoint
app.post("/api/analytics", async (c) => {
  try {
    const data = await c.req.json();
    
    // Store analytics data
    await c.env.DB.prepare(`
      INSERT INTO analytics_events (id, action, category, label, value, user_agent, url, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      data.action,
      data.category,
      data.label || null,
      data.value || null,
      data.userAgent || null,
      data.url || null,
      data.timestamp
    ).run();

    return c.json({ success: true });

  } catch (error) {
    console.error("Analytics error:", error);
    return c.json({ success: true }); // Don't fail the request for analytics
  }
});

// Error logging endpoint
app.post("/api/errors", async (c) => {
  try {
    const errorData = await c.req.json();
    
    console.error("Frontend error logged:", errorData);
    
    // Store error in database
    await c.env.DB.prepare(`
      INSERT INTO error_logs (id, error_message, stack_trace, component_stack, context, user_agent, url, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      errorData.error || 'Unknown error',
      errorData.stack || null,
      errorData.componentStack || null,
      errorData.context || null,
      errorData.userAgent || null,
      errorData.url || null,
      errorData.timestamp || new Date().toISOString()
    ).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Error logging failed:", error);
    return c.json({ success: true }); // Don't fail the request for error logging
  }
});

// Test endpoint for analyze with sample image
app.post("/api/test-analyze", async (c) => {
  try {
    // Create a larger test image (16x16 red square PNG)
    const testImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFVSURBVDiNpZM9SwNBEIafgwQLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sLwcJCG1sL";
    
    console.log("Testing analyze endpoint with sample image");
    
    const response = await fetch(`${c.req.url.replace('/test-analyze', '/analyze')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: testImageData }),
    });

    const data = await response.json();
    
    return c.json({ 
      success: response.ok,
      status: response.status,
      data: data
    });
  } catch (error: any) {
    console.error("Test analyze error:", error);
    return c.json({ 
      success: false,
      error: error.message 
    });
  }
});

// Test endpoint for debugging
app.post("/api/test-openai", async (c) => {
  try {
    if (!c.env.OPENAI_API_KEY) {
      return c.json({ 
        success: false, 
        error: "OpenAI API key not configured" 
      }, 500);
    }

    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    // Simple test to verify OpenAI connection
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "Say 'Hello, VintageVision is working!' in JSON format like {\"message\": \"your response\"}"
        }
      ],
      max_tokens: 50
    });

    const content = response.choices[0]?.message?.content;
    
    return c.json({ 
      success: true, 
      openaiWorking: true,
      response: content 
    });
  } catch (error: any) {
    console.error("OpenAI test error:", error);
    return c.json({ 
      success: false, 
      openaiWorking: false,
      error: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", async (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default app;
