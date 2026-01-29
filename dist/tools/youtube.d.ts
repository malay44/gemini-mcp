/**
 * YouTube Analysis Tool - Analyze YouTube videos directly by URL
 *
 * Gemini can process YouTube videos natively, enabling:
 * - Video summarization
 * - Q&A about video content
 * - Timestamp-based analysis
 * - Audio and visual understanding
 *
 * Supports clipping intervals to analyze specific portions of videos.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register YouTube analysis tools with the MCP server
 */
export declare function registerYouTubeTool(server: McpServer): void;
