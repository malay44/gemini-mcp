/**
 * Video Upload Tool - Analyze local video files and inline video data
 *
 * Complements the YouTube analysis tool by supporting:
 * 1. Local video files - Upload and analyze video files from disk
 * 2. Inline video data - Process base64-encoded video content
 *
 * Features:
 * - Video summarization
 * - Q&A about video content
 * - Timestamp-based analysis (clipping)
 * - Audio and visual understanding
 * - Automatic file size handling (inline vs Files API)
 *
 * Supported formats: MP4, MOV, AVI, MKV, WebM, FLV, WMV, M4V, MPG, MPEG, 3GP
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register video upload tools with the MCP server
 */
export declare function registerVideoUploadTool(server: McpServer): void;
