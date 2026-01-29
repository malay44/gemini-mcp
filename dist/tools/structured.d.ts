/**
 * Structured Output Tool - Get JSON responses with schema validation
 *
 * This tool enables Gemini to generate responses that adhere to a provided JSON Schema.
 * Useful for:
 * - Data extraction from unstructured text
 * - Structured classification
 * - Generating data for APIs or databases
 *
 * Supports combining with Google Search for grounded structured data.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register structured output tools with the MCP server
 */
export declare function registerStructuredTool(server: McpServer): void;
