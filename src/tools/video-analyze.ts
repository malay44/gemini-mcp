/**
 * Video Analysis Tool - Analyze local video files
 *
 * This tool provides support for analyzing local video files using Gemini's
 * video understanding capabilities, complementing the existing YouTube analysis tools.
 *
 * Features:
 * - Upload video files via Files API
 * - Pass video data inline (for smaller files)
 * - Video summarization
 * - Q&A about video content
 * - Timestamp-based analysis
 * - Audio and visual understanding
 *
 * Supported formats: MP4, MPEG, MOV, AVI, FLV, MPG, WebM, WMV, 3GP
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { GoogleGenAI } from '@google/genai'
import { logger } from '../utils/logger.js'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Get MIME type from file extension for video files
 */
function getVideoMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.mpg': 'video/mpeg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
    '.wmv': 'video/x-ms-wmv',
    '.3gp': 'video/3gpp',
  }
  return mimeTypes[ext] || 'video/mp4'
}

/**
 * Parse time string to seconds (supports formats like "1m30s", "90s", "1:30", "90")
 */
function parseTimeToSeconds(time: string): string {
  // Handle MM:SS format
  if (time.includes(':')) {
    const [mins, secs] = time.split(':').map(Number)
    return `${mins * 60 + secs}s`
  }

  // Handle XmYs format
  const minMatch = time.match(/(\d+)m/)
  const secMatch = time.match(/(\d+)s/)
  const mins = minMatch ? parseInt(minMatch[1]) : 0
  const secs = secMatch ? parseInt(secMatch[1]) : 0

  if (mins > 0 || secMatch) {
    return `${mins * 60 + secs}s`
  }

  // Handle plain number (assume seconds)
  const num = parseInt(time)
  if (!isNaN(num)) {
    return `${num}s`
  }

  return time
}

/**
 * Wait for uploaded file to be processed and ready (ACTIVE state)
 */
async function waitForFileProcessing(
  genAI: GoogleGenAI,
  fileName: string,
  maxWaitMs: number = 300000 // 5 minutes default
): Promise<void> {
  const startTime = Date.now()
  const pollIntervalMs = 5000 // Poll every 5 seconds

  while (Date.now() - startTime < maxWaitMs) {
    const fileStatus = await genAI.files.get({ name: fileName })

    if (fileStatus.state === 'ACTIVE') {
      logger.info('Video file processing complete, ready for analysis')
      return
    }

    if (fileStatus.state === 'FAILED') {
      throw new Error('Video file processing failed')
    }

    logger.debug(`Video file state: ${fileStatus.state}, waiting...`)
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
  }

  throw new Error('Timeout waiting for video file to be processed')
}

/**
 * Register video analysis tools with the MCP server
 */
export function registerVideoAnalyzeTool(server: McpServer): void {
  server.tool(
    'gemini-analyze-video',
    {
      filePath: z
        .string()
        .describe(
          'Path to local video file. Supports MP4, MPEG, MOV, AVI, FLV, MPG, WebM, WMV, 3GP'
        ),
      question: z
        .string()
        .describe(
          'Question about the video or task to perform (e.g., "Summarize this video", "What happens at 1:30?", "Describe the main events")'
        ),
      startTime: z
        .string()
        .optional()
        .describe(
          'Start time for analysis (e.g., "1m30s", "90", "1:30"). Optional - analyzes specific portion.'
        ),
      endTime: z
        .string()
        .optional()
        .describe(
          'End time for analysis (e.g., "5m00s", "300", "5:00"). Optional - analyzes specific portion.'
        ),
      model: z
        .enum(['pro', 'flash'])
        .default('flash')
        .describe(
          'Model to use: pro (more accurate) or flash (faster). Default: flash'
        ),
    },
    async ({ filePath, question, startTime, endTime, model }) => {
      logger.info(`Video analysis: ${filePath}`)

      try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY not set')
        }

        // Check file exists
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`)
        }

        const genAI = new GoogleGenAI({ apiKey })
        const modelName =
          model === 'pro'
            ? process.env.GEMINI_PRO_MODEL || 'gemini-3-pro-preview'
            : process.env.GEMINI_FLASH_MODEL || 'gemini-3-flash-preview'

        // Read file
        const fileBuffer = fs.readFileSync(filePath)
        const mimeType = getVideoMimeType(filePath)
        const fileSize = fileBuffer.length

        logger.debug(`Video size: ${fileSize} bytes, MIME type: ${mimeType}`)

        // For video files, we should typically use the Files API for better reliability
        // Videos are often large and benefit from server-side processing
        // Use inline data only for very small files (<10MB)
        const useFilesApi = fileSize > 10 * 1024 * 1024

        let videoPart: Record<string, unknown>

        if (useFilesApi) {
          // Upload using Files API
          logger.info('Uploading video via Files API...')

          const uploadedFile = await genAI.files.upload({
            file: new Blob([new Uint8Array(fileBuffer)], { type: mimeType }),
            config: { mimeType },
          })

          logger.info(`Video uploaded: ${uploadedFile.name}`)

          // Wait for the file to be processed (video processing can take time)
          if (uploadedFile.name) {
            await waitForFileProcessing(genAI, uploadedFile.name)
          }

          videoPart = {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType,
            },
          }
        } else {
          // Use inline data for smaller files
          logger.debug('Using inline data for video')
          const base64Data = fileBuffer.toString('base64')
          videoPart = {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          }
        }

        // Add video metadata for clipping if provided
        if (startTime || endTime) {
          const videoMetadata: Record<string, string> = {}
          if (startTime) {
            videoMetadata.startOffset = parseTimeToSeconds(startTime)
          }
          if (endTime) {
            videoMetadata.endOffset = parseTimeToSeconds(endTime)
          }
          videoPart.videoMetadata = videoMetadata
        }

        // Build contents
        const contents = [
          {
            role: 'user',
            parts: [videoPart, { text: question }],
          },
        ]

        // Execute
        const response = await genAI.models.generateContent({
          model: modelName,
          contents,
        })

        const responseText = response.text || ''

        // Build response with context
        let resultText = responseText
        if (startTime || endTime) {
          const clipInfo = []
          if (startTime) clipInfo.push(`from ${startTime}`)
          if (endTime) clipInfo.push(`to ${endTime}`)
          resultText = `*Analyzed video clip ${clipInfo.join(' ')}*\n\n${responseText}`
        }

        logger.info('Video analysis completed successfully')

        return {
          content: [
            {
              type: 'text' as const,
              text: resultText,
            },
          ],
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`Error in video analysis: ${errorMessage}`)

        return {
          content: [
            {
              type: 'text' as const,
              text: `Error analyzing video: ${errorMessage}`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Convenience tool for video summarization
  server.tool(
    'gemini-summarize-video',
    {
      filePath: z
        .string()
        .describe(
          'Path to local video file. Supports MP4, MPEG, MOV, AVI, FLV, MPG, WebM, WMV, 3GP'
        ),
      style: z
        .enum(['brief', 'detailed', 'bullet-points', 'chapters'])
        .default('brief')
        .describe('Summary style'),
    },
    async ({ filePath, style }) => {
      logger.info(`Video summary: ${filePath}`)

      try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY not set')
        }

        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`)
        }

        const genAI = new GoogleGenAI({ apiKey })
        const modelName =
          process.env.GEMINI_FLASH_MODEL || 'gemini-3-flash-preview'

        // Build prompt based on style
        let prompt: string
        switch (style) {
          case 'brief':
            prompt = 'Summarize this video in 2-3 sentences.'
            break
          case 'detailed':
            prompt =
              'Provide a detailed summary of this video, covering all main points and key moments. Include relevant timestamps for important events.'
            break
          case 'bullet-points':
            prompt =
              'Summarize this video as a bullet-point list of key points and events.'
            break
          case 'chapters':
            prompt =
              'Create a chapter breakdown of this video with timestamps and descriptions for each section.'
            break
          default:
            prompt = 'Summarize this video.'
        }

        // Read file
        const fileBuffer = fs.readFileSync(filePath)
        const mimeType = getVideoMimeType(filePath)
        const fileSize = fileBuffer.length

        logger.debug(`Video size: ${fileSize} bytes, MIME type: ${mimeType}`)

        // Use Files API for larger videos
        const useFilesApi = fileSize > 10 * 1024 * 1024
        let videoPart: Record<string, unknown>

        if (useFilesApi) {
          logger.info('Uploading video via Files API...')

          const uploadedFile = await genAI.files.upload({
            file: new Blob([new Uint8Array(fileBuffer)], { type: mimeType }),
            config: { mimeType },
          })

          logger.info(`Video uploaded: ${uploadedFile.name}`)

          if (uploadedFile.name) {
            await waitForFileProcessing(genAI, uploadedFile.name)
          }

          videoPart = {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType,
            },
          }
        } else {
          const base64Data = fileBuffer.toString('base64')
          videoPart = {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          }
        }

        const contents = [
          {
            role: 'user',
            parts: [videoPart, { text: prompt }],
          },
        ]

        const response = await genAI.models.generateContent({
          model: modelName,
          contents,
        })

        logger.info('Video summary completed successfully')

        return {
          content: [
            {
              type: 'text' as const,
              text: response.text || 'Unable to generate summary.',
            },
          ],
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`Error in video summary: ${errorMessage}`)

        return {
          content: [
            {
              type: 'text' as const,
              text: `Error summarizing video: ${errorMessage}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
