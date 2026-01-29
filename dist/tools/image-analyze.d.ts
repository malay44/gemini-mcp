/**
 * Image Analysis Tool - Analyze images with object detection and bounding boxes
 *
 * This tool uses Gemini's vision capabilities to analyze images and detect objects
 * with bounding box coordinates. Returns both normalized box_2d format and pixel coordinates.
 *
 * Bounding Box Format:
 * - box_2d: [y_min, x_min, y_max, x_max] in 0-1000 normalized coordinates
 * - bbox_pixels: {x, y, width, height} in pixel coordinates (when dimensions available)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Register image analysis tools with the MCP server
 */
export declare function registerImageAnalyzeTool(server: McpServer): void;
