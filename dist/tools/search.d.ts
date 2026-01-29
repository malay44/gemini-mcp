/**
 * Google Search Grounding Tool - Real-time web information with citations
 *
 * This tool connects Gemini to Google Search for:
 * - Accurate answers grounded in real-world information
 * - Access to recent events and current topics
 * - Verifiable sources with citations
 *
 * Returns responses with inline citations linked to source URLs.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register Google Search grounding tools with the MCP server
 */
export declare function registerSearchTool(server: McpServer): void;
