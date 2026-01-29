/**
 * Video Generation Tool - Generate videos using Gemini's Veo model
 *
 * This tool generates videos from text descriptions. Video generation is async,
 * so we provide tools to start generation and check status.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register video generation tools with the MCP server
 */
export declare function registerVideoGenTool(server: McpServer): void;
