/**
 * URL Context Tool - Analyze web pages by URL
 *
 * The URL context tool lets you provide URLs for Gemini to analyze.
 * Useful for:
 * - Extract data from web pages (prices, names, key findings)
 * - Compare documents from multiple URLs
 * - Synthesize content from several sources
 * - Analyze code from GitHub or documentation sites
 *
 * Can be combined with Google Search for powerful workflows.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register URL context tools with the MCP server
 */
export declare function registerUrlContextTool(server: McpServer): void;
