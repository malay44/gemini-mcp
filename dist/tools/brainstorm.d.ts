/**
 * Brainstorm Tool - Enables automatic collaborative brainstorming between Claude and Gemini
 *
 * This tool facilitates multi-round collaborative planning until consensus is reached.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Register brainstorm tool with the MCP server
 */
export declare function registerBrainstormTool(server: McpServer): void;
