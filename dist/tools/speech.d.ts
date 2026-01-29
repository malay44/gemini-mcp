/**
 * Speech Generation Tool - Text-to-Speech with Gemini
 *
 * Generate high-quality speech from text using Gemini's native TTS.
 * Features:
 * - 30 voice options with different tones and styles
 * - Multi-speaker support (up to 2 speakers)
 * - Controllable style, accent, pace via natural language
 * - 24 language support
 *
 * Output: WAV files saved to the output directory
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register speech generation tools with the MCP server
 */
export declare function registerSpeechTool(server: McpServer): void;
