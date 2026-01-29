/**
 * Analyze Tool - Provides analysis capabilities using Gemini models
 *
 * This tool allows analyzing code, text, or specific content with Gemini.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Register analysis tools with the MCP server
 */
export declare function registerAnalyzeTool(server: McpServer): void;
