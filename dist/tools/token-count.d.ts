/**
 * Token Counting Tool - Count tokens before making API calls
 *
 * Helps users estimate costs and manage context windows.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register token counting tool with the MCP server
 */
export declare function registerTokenCountTool(server: McpServer): void;
