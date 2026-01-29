/**
 * Summarize Tool - Provides content summarization using Gemini models
 *
 * This tool allows summarizing long text content at different levels of detail.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Register summarization tools with the MCP server
 */
export declare function registerSummarizeTool(server: McpServer): void;
