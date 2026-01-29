/**
 * Output Directory Utility
 *
 * Determines platform-appropriate output directories for generated files.
 * Uses user config directories with unique per-project subdirectories.
 *
 * Platform defaults:
 * - macOS/Linux: ~/.config/gemini-mcp/output/<project-hash>
 * - Windows: %APPDATA%/gemini-mcp/output/<project-hash>
 *
 * Environment variable GEMINI_OUTPUT_DIR overrides platform defaults.
 */
/**
 * Get unique identifier for current project
 * Uses git repository root if available, otherwise current working directory.
 * Resolves symlinks to ensure consistent identifiers.
 */
export declare function getProjectIdentifier(): string;
/**
 * Get platform-appropriate base configuration directory
 */
export declare function getConfigBaseDir(): string;
/**
 * Get output directory for generated files
 *
 * Returns project-specific output directory for images, videos, audio, etc.
 *
 * Priority:
 * 1. GEMINI_OUTPUT_DIR environment variable (if set)
 * 2. Platform config directory with project-specific subdirectory
 *
 * @returns Absolute path to output directory
 */
export declare function getOutputDir(): string;
/**
 * Ensure output directory exists
 * Creates the directory if it doesn't exist.
 *
 * @param dir Optional directory path, defaults to getOutputDir()
 */
export declare function ensureOutputDir(dir?: string): string;
