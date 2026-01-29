/**
 * Gemini Client - Provides access to Google's Generative AI models
 *
 * This module initializes and manages the connection to Google's Gemini API.
 * Supports Gemini 3 Pro, Flash, image generation (Nano Banana Pro), and video generation (Veo).
 *
 * Key Gemini 3 Features:
 * - Thinking Levels: Control reasoning depth (minimal, low, medium, high)
 * - 4K Image Generation: Up to 4K resolution with Google Search grounding
 * - Multi-turn Image Editing: Conversational image refinement
 */
import { GoogleGenAI } from '@google/genai';
/**
 * Thinking levels for Gemini 3 models
 * - minimal: Fastest, minimal reasoning (Flash only)
 * - low: Fast responses, basic reasoning
 * - medium: Balanced reasoning (Flash only)
 * - high: Deep reasoning, best for complex tasks (default)
 */
export type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high';
/**
 * Options for text generation
 */
export interface GenerateOptions {
    thinkingLevel?: ThinkingLevel;
}
/**
 * All supported aspect ratios for Nano Banana Pro
 */
export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';
/**
 * Image sizes for Nano Banana Pro (Gemini 3 Pro Image)
 */
export type ImageSize = '1K' | '2K' | '4K';
export declare let genAI: GoogleGenAI;
/**
 * Initialize the Gemini client with configured models
 */
export declare function initGeminiClient(): Promise<void>;
/**
 * Generate content using the Gemini Pro model
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options including thinking level
 * @returns The generated text response
 *
 * Gemini 3 Pro supports thinking levels: low, high (default)
 */
export declare function generateWithGeminiPro(prompt: string, options?: GenerateOptions): Promise<string>;
/**
 * Generate content using the Gemini Flash model
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options including thinking level
 * @returns The generated text response
 *
 * Gemini 3 Flash supports ALL thinking levels: minimal, low, medium, high (default)
 */
export declare function generateWithGeminiFlash(prompt: string, options?: GenerateOptions): Promise<string>;
/**
 * Generate content with a structured chat history
 */
export declare function generateWithChat(messages: {
    role: 'user' | 'model';
    content: string;
}[], useProModel?: boolean): Promise<string>;
/**
 * Image generation result
 */
export interface ImageGenerationResult {
    base64: string;
    mimeType: string;
    filePath: string;
    description?: string;
}
/**
 * Options for image generation with Nano Banana Pro
 */
export interface ImageGenerationOptions {
    aspectRatio?: AspectRatio;
    imageSize?: ImageSize;
    style?: string;
    saveToFile?: boolean;
    useGoogleSearch?: boolean;
}
/**
 * Generate an image using Gemini's Nano Banana Pro model (gemini-3-pro-image-preview)
 *
 * Features:
 * - 4K resolution support (1K, 2K, 4K)
 * - 10 aspect ratios (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9)
 * - Google Search grounding for real-world accuracy
 * - High-fidelity text rendering
 */
export declare function generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
/**
 * Video generation operation result
 */
export interface VideoGenerationResult {
    operationName: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    videoUri?: string;
    filePath?: string;
    error?: string;
}
/**
 * Start video generation using Gemini's Veo model
 * Returns an operation that can be polled for completion
 */
export declare function startVideoGeneration(prompt: string, options?: {
    aspectRatio?: '16:9' | '9:16';
    durationSeconds?: number;
    negativePrompt?: string;
}): Promise<VideoGenerationResult>;
/**
 * Check the status of a video generation operation
 */
export declare function checkVideoStatus(operationName: string): Promise<VideoGenerationResult>;
/**
 * Get the output directory path
 */
export declare function getOutputDir(): string;
/**
 * Token count result
 */
export interface TokenCountResult {
    totalTokens: number;
    modelName: string;
}
/**
 * Count tokens for content using specified model
 */
export declare function countTokens(content: string, model?: 'pro' | 'flash'): Promise<TokenCountResult>;
/**
 * Deep Research interaction result
 */
export interface DeepResearchResult {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    outputs?: {
        text?: string;
    }[];
    error?: string;
    savedPath?: string;
}
/**
 * Start a deep research task
 */
export declare function startDeepResearch(prompt: string): Promise<DeepResearchResult>;
/**
 * Check deep research status
 */
export declare function checkDeepResearch(researchId: string): Promise<DeepResearchResult>;
/**
 * Follow up on completed research
 */
export declare function followUpResearch(researchId: string, question: string): Promise<string>;
