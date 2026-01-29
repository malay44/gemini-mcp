/**
 * Image Editing Tool - Multi-turn conversational image editing with Nano Banana Pro
 *
 * This tool enables iterative image refinement through conversation.
 * Uses Gemini 3's chat sessions to maintain context and thought signatures.
 *
 * Workflow:
 * 1. Start an edit session with an initial image generation
 * 2. Continue refining with follow-up prompts ("make it warmer", "add more clouds")
 * 3. Each response returns the updated image
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register image editing tools with the MCP server
 */
export declare function registerImageEditTool(server: McpServer): void;
