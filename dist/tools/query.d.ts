/**
 * Query Tool - Send direct queries to Gemini models
 *
 * This tool allows sending prompts directly to Gemini and receiving responses.
 * Supports Gemini 3's thinking levels for controlling reasoning depth.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register query tools with the MCP server
 */
export declare function registerQueryTool(server: McpServer): void;
