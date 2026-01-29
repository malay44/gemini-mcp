/**
 * Document Analysis Tool - Analyze PDFs and documents
 *
 * Gemini can process documents including PDFs, enabling:
 * - Document summarization
 * - Information extraction
 * - Q&A about document content
 * - Table and chart understanding
 *
 * Uses the Files API for larger documents.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register document analysis tools with the MCP server
 */
export declare function registerDocumentTool(server: McpServer): void;
