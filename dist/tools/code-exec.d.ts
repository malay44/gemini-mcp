/**
 * Code Execution Tool - Let Gemini write and run Python code
 *
 * This tool enables Gemini to generate and execute Python code in a sandboxed environment.
 * Useful for:
 * - Data analysis with pandas
 * - Math computations
 * - Chart generation with matplotlib
 * - File processing
 *
 * Supported libraries include: numpy, pandas, matplotlib, scipy, scikit-learn, tensorflow, and more.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register code execution tools with the MCP server
 */
export declare function registerCodeExecTool(server: McpServer): void;
