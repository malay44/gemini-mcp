/**
 * Context Caching Tool - Cache large content for cost savings
 *
 * When working with large documents or videos repeatedly, caching saves costs
 * by storing the tokenized content and reusing it across requests.
 *
 * Useful for:
 * - Chatbots with extensive system instructions
 * - Repetitive analysis of large files
 * - Recurring queries against document sets
 * - Code repository analysis
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register caching tools with the MCP server
 */
export declare function registerCacheTool(server: McpServer): void;
