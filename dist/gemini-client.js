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
import { GoogleGenAI, Modality } from '@google/genai';
import { logger } from './utils/logger.js';
import { ensureOutputDir } from './utils/output-dir.js';
import * as fs from 'fs';
import * as path from 'path';
// Global clients (exported for use by other modules)
export let genAI;
let proModelName;
let flashModelName;
let imageModelName;
let videoModelName;
// Output directory for generated files
let outputDir;
/**
 * Initialize the Gemini client with configured models
 */
export async function initGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
    }
    try {
        // Initialize the API client
        genAI = new GoogleGenAI({ apiKey });
        // Set up models - Gemini 3 defaults (latest preview)
        proModelName = process.env.GEMINI_PRO_MODEL || 'gemini-3-pro-preview';
        flashModelName = process.env.GEMINI_FLASH_MODEL || 'gemini-3-flash-preview';
        imageModelName = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
        videoModelName = process.env.GEMINI_VIDEO_MODEL || 'veo-2.0-generate-001';
        // Set up output directory for generated files (platform-appropriate location)
        outputDir = ensureOutputDir();
        logger.info(`Output directory: ${outputDir}`);
        // Use the user's preferred model for init test, fallback to flash (higher free tier limits)
        // This fixes issue #7 - init test was always using pro model causing 429 errors on free tier
        const initModel = process.env.GEMINI_MODEL || flashModelName;
        // Test connection with timeout and retry
        let connected = false;
        let attempts = 0;
        const maxAttempts = 3;
        while (!connected && attempts < maxAttempts) {
            try {
                attempts++;
                logger.info(`Connecting to Gemini API (attempt ${attempts}/${maxAttempts}) using ${initModel}...`);
                // Set up a timeout for the connection test
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Connection timeout')), 10000);
                });
                // Test connection with user's preferred model or flash (better free tier limits)
                const connectionPromise = genAI.models.generateContent({
                    model: initModel,
                    contents: 'Test connection',
                });
                const result = await Promise.race([connectionPromise, timeoutPromise]);
                if (!result) {
                    throw new Error('Failed to connect to Gemini API: empty response');
                }
                connected = true;
                logger.info(`Successfully connected to Gemini API`);
                logger.info(`Pro model: ${proModelName}`);
                logger.info(`Flash model: ${flashModelName}`);
                logger.info(`Image model: ${imageModelName}`);
                logger.info(`Video model: ${videoModelName}`);
                logger.info(`Output directory: ${outputDir}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                logger.warn(`Connection attempt ${attempts} failed: ${errorMessage}`);
                if (attempts >= maxAttempts) {
                    throw new Error(`Failed to connect to Gemini API after ${maxAttempts} attempts: ${errorMessage}`);
                }
                // Wait before retry
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }
    catch (error) {
        logger.error('Failed to initialize Gemini client:', error);
        throw error;
    }
}
/**
 * Generate content using the Gemini Pro model
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options including thinking level
 * @returns The generated text response
 *
 * Gemini 3 Pro supports thinking levels: low, high (default)
 */
export async function generateWithGeminiPro(prompt, options = {}) {
    try {
        logger.prompt(prompt);
        const { thinkingLevel } = options;
        // Build config with optional thinking level
        // Note: Gemini 3 Pro only supports 'low' and 'high' thinking levels
        const config = {};
        if (thinkingLevel) {
            // For Pro, only 'low' and 'high' are valid - map 'minimal' and 'medium' appropriately
            const proThinkingLevel = thinkingLevel === 'minimal' || thinkingLevel === 'low' ? 'low' : 'high';
            config.thinkingConfig = { thinkingLevel: proThinkingLevel };
            logger.debug(`Using thinking level: ${proThinkingLevel} (requested: ${thinkingLevel})`);
        }
        const response = await genAI.models.generateContent({
            model: proModelName,
            contents: prompt,
            config: Object.keys(config).length > 0 ? config : undefined,
        });
        const responseText = response.text || '';
        logger.response(responseText);
        return responseText;
    }
    catch (error) {
        logger.error('Error generating content with Gemini Pro:', error);
        throw error;
    }
}
/**
 * Generate content using the Gemini Flash model
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options including thinking level
 * @returns The generated text response
 *
 * Gemini 3 Flash supports ALL thinking levels: minimal, low, medium, high (default)
 */
export async function generateWithGeminiFlash(prompt, options = {}) {
    try {
        logger.prompt(prompt);
        const { thinkingLevel } = options;
        // Build config with optional thinking level
        // Note: Gemini 3 Flash supports all thinking levels
        const config = {};
        if (thinkingLevel) {
            config.thinkingConfig = { thinkingLevel };
            logger.debug(`Using thinking level: ${thinkingLevel}`);
        }
        const response = await genAI.models.generateContent({
            model: flashModelName,
            contents: prompt,
            config: Object.keys(config).length > 0 ? config : undefined,
        });
        const responseText = response.text || '';
        logger.response(responseText);
        return responseText;
    }
    catch (error) {
        logger.error('Error generating content with Gemini Flash:', error);
        throw error;
    }
}
/**
 * Generate content with a structured chat history
 */
export async function generateWithChat(messages, useProModel = true) {
    try {
        const model = useProModel ? proModelName : flashModelName;
        // Format messages for the Gemini API
        const formattedContents = messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));
        logger.debug('Starting chat with messages:', JSON.stringify(messages, null, 2));
        // Handle the conversation based on the last message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
            logger.prompt(lastMessage.content);
            // Generate content with the conversation history
            const response = await genAI.models.generateContent({
                model: model,
                contents: formattedContents,
            });
            const responseText = response.text || '';
            logger.response(responseText);
            return responseText;
        }
        else {
            // If the last message is from the model, we don't need to send anything
            return lastMessage.content;
        }
    }
    catch (error) {
        logger.error('Error generating content with chat:', error);
        throw error;
    }
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
export async function generateImage(prompt, options = {}) {
    try {
        const { aspectRatio = '1:1', imageSize = '2K', // Default to 2K for good balance of quality and speed
        style, saveToFile = true, useGoogleSearch = false, } = options;
        // Build the full prompt with style if provided
        const fullPrompt = style ? `${prompt}, in ${style} style` : prompt;
        logger.prompt(`Image generation: ${fullPrompt}`);
        logger.debug(`Image config: ${aspectRatio}, ${imageSize}, search: ${useGoogleSearch}`);
        // Build the config for Nano Banana Pro
        const config = {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
            imageConfig: {
                aspectRatio,
                imageSize,
            },
        };
        // Add Google Search grounding if requested
        if (useGoogleSearch) {
            config.tools = [{ googleSearch: {} }];
        }
        const response = await genAI.models.generateContent({
            model: imageModelName,
            contents: fullPrompt,
            config,
        });
        // Extract image from response
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error('No candidates in image generation response');
        }
        const parts = candidates[0].content?.parts;
        if (!parts) {
            throw new Error('No parts in image generation response');
        }
        let imageData;
        let mimeType = 'image/png';
        let description;
        for (const part of parts) {
            if (part.inlineData) {
                imageData = part.inlineData.data;
                mimeType = part.inlineData.mimeType || 'image/png';
            }
            else if (part.text) {
                description = part.text;
            }
        }
        if (!imageData) {
            throw new Error('No image data in response');
        }
        // Save to file if requested
        let filePath = '';
        if (saveToFile) {
            const timestamp = Date.now();
            const extension = mimeType.split('/')[1] || 'png';
            const filename = `image-${timestamp}.${extension}`;
            filePath = path.join(outputDir, filename);
            const buffer = Buffer.from(imageData, 'base64');
            fs.writeFileSync(filePath, buffer);
            logger.info(`Image saved to: ${filePath}`);
        }
        logger.response(`Image generated successfully (${mimeType})`);
        return {
            base64: imageData,
            mimeType,
            filePath,
            description,
        };
    }
    catch (error) {
        logger.error('Error generating image:', error);
        throw error;
    }
}
// Store active video operations for polling
const activeVideoOperations = new Map();
/**
 * Start video generation using Gemini's Veo model
 * Returns an operation that can be polled for completion
 */
export async function startVideoGeneration(prompt, options = {}) {
    try {
        const { aspectRatio = '16:9', negativePrompt } = options;
        logger.prompt(`Video generation: ${prompt}`);
        const config = {
            aspectRatio,
        };
        if (negativePrompt) {
            config.negativePrompt = negativePrompt;
        }
        const operation = await genAI.models.generateVideos({
            model: videoModelName,
            prompt,
            config,
        });
        const operationName = operation.name || `video-${Date.now()}`;
        // Store the full operation object for later polling
        activeVideoOperations.set(operationName, operation);
        logger.info(`Video generation started: ${operationName}`);
        return {
            operationName,
            status: 'pending',
        };
    }
    catch (error) {
        logger.error('Error starting video generation:', error);
        throw error;
    }
}
/**
 * Check the status of a video generation operation
 */
export async function checkVideoStatus(operationName) {
    try {
        logger.debug(`Checking video status: ${operationName}`);
        // Get the stored operation object
        let operation = activeVideoOperations.get(operationName);
        if (!operation) {
            return {
                operationName,
                status: 'failed',
                error: 'Operation not found. It may have expired or the server was restarted.',
            };
        }
        // Poll for updated status
        const status = await genAI.operations.getVideosOperation({
            operation: operation,
        });
        // Update stored operation
        activeVideoOperations.set(operationName, status);
        if (status.done) {
            // Clean up stored operation
            activeVideoOperations.delete(operationName);
            if (status.error) {
                return {
                    operationName,
                    status: 'failed',
                    error: String(status.error) || 'Unknown error',
                };
            }
            // Video is ready - get the URI
            const videoUri = status.response?.generatedVideos?.[0]?.video?.uri;
            let filePath;
            if (videoUri) {
                // Download and save the video
                const timestamp = Date.now();
                const filename = `video-${timestamp}.mp4`;
                filePath = path.join(outputDir, filename);
                try {
                    // Fetch the video with API key in header
                    const response = await fetch(videoUri, {
                        headers: {
                            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
                        },
                    });
                    if (response.ok) {
                        const buffer = Buffer.from(await response.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);
                        logger.info(`Video saved to: ${filePath}`);
                    }
                    else {
                        logger.warn(`Failed to download video: ${response.status}`);
                        filePath = undefined;
                    }
                }
                catch (downloadError) {
                    logger.warn('Failed to download video:', downloadError);
                    filePath = undefined;
                }
            }
            return {
                operationName,
                status: 'completed',
                videoUri,
                filePath,
            };
        }
        return {
            operationName,
            status: 'processing',
        };
    }
    catch (error) {
        logger.error('Error checking video status:', error);
        throw error;
    }
}
/**
 * Get the output directory path
 */
export function getOutputDir() {
    return outputDir;
}
/**
 * Count tokens for content using specified model
 */
export async function countTokens(content, model = 'flash') {
    const modelName = model === 'pro' ? proModelName : flashModelName;
    const result = await genAI.models.countTokens({
        model: modelName,
        contents: content,
    });
    return {
        totalTokens: result.totalTokens || 0,
        modelName,
    };
}
// Deep Research agent model
const DEEP_RESEARCH_AGENT = 'deep-research-pro-preview-12-2025';
/**
 * Start a deep research task
 */
export async function startDeepResearch(prompt) {
    try {
        // The Interactions API is properly typed in @google/genai v1.34.0+
        const interaction = await genAI.interactions.create({
            input: prompt,
            agent: DEEP_RESEARCH_AGENT,
            background: true,
            agent_config: {
                type: 'deep-research',
                thinking_summaries: 'auto',
            },
        });
        return {
            id: interaction.id || `research-${Date.now()}`,
            status: 'pending',
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Deep research not available: ${message}`);
    }
}
/**
 * Check deep research status
 */
export async function checkDeepResearch(researchId) {
    try {
        const interaction = await genAI.interactions.get(researchId);
        const status = interaction.status || 'unknown';
        if (status === 'completed') {
            // Save the FULL raw response to the output directory
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = path.join(getOutputDir(), `deep-research-${timestamp}.json`);
            const fullResponse = {
                id: researchId,
                status: interaction.status,
                created: interaction.created,
                agent: interaction.agent,
                model: interaction.model,
                outputs: interaction.outputs,
                rawInteraction: interaction,
            };
            fs.writeFileSync(outputPath, JSON.stringify(fullResponse, null, 2));
            logger.info(`Full deep research response saved to: ${outputPath}`);
            // Extract text for the summary (but full data is saved)
            const textOutputs = (interaction.outputs || [])
                .filter((output) => 'type' in output && output.type === 'text')
                .map(output => ({ text: output.text }));
            return {
                id: researchId,
                status: 'completed',
                outputs: textOutputs,
                savedPath: outputPath,
            };
        }
        else if (status === 'failed' || status === 'cancelled') {
            return {
                id: researchId,
                status: 'failed',
                error: 'Research task failed or was cancelled',
            };
        }
        return {
            id: researchId,
            status: 'processing',
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to check research status: ${message}`);
    }
}
/**
 * Follow up on completed research
 */
export async function followUpResearch(researchId, question) {
    try {
        const interaction = await genAI.interactions.create({
            input: question,
            model: proModelName,
            previous_interaction_id: researchId,
        });
        // Extract text from TextContent outputs
        const outputs = interaction.outputs || [];
        const textOutputs = outputs
            .filter((output) => 'type' in output && output.type === 'text')
            .map(output => output.text)
            .filter((text) => !!text);
        if (textOutputs.length > 0) {
            return textOutputs[textOutputs.length - 1];
        }
        return 'No text response received';
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Research follow-up failed: ${message}`);
    }
}
