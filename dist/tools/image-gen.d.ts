/**
 * Image Generation Tool - Generate images using Gemini's Nano Banana Pro model
 *
 * This tool generates actual images from text descriptions and returns them
 * both as base64 (for Claude to view) and saves them to disk (for user access).
 *
 * Nano Banana Pro Features:
 * - Up to 4K resolution
 * - 10 aspect ratios
 * - Google Search grounding for real-world accuracy
 * - High-fidelity text rendering
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register image generation tools with the MCP server
 */
export declare function registerImageGenTool(server: McpServer): void;
