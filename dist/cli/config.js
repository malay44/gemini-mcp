/**
 * CLI Configuration
 *
 * Loads and manages CLI configuration using Bun's native file APIs.
 * Config file: ~/.config/gemini-cli/config.json
 */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { setTheme } from './ui/index.js';
const DEFAULT_CONFIG = {
    theme: 'terminal',
    outputDir: '~/Downloads',
    defaultVoice: 'Kore',
    defaultImageSize: '2K',
    defaultImageRatio: '1:1',
    defaultVideoRatio: '16:9',
};
// Expand ~ to home directory
function expandPath(path) {
    if (path.startsWith('~/')) {
        return join(homedir(), path.slice(2));
    }
    return path;
}
// Get config directory path
export function getConfigDir() {
    return join(homedir(), '.config', 'gemini-cli');
}
// Get config file path
export function getConfigPath() {
    return join(getConfigDir(), 'config.json');
}
// Load configuration using Bun
export async function loadConfig() {
    const configPath = getConfigPath();
    try {
        const file = Bun.file(configPath);
        const exists = await file.exists();
        if (!exists) {
            // Return defaults if no config file
            return { ...DEFAULT_CONFIG };
        }
        const content = await file.json();
        const config = { ...DEFAULT_CONFIG, ...content };
        // Apply theme immediately
        if (config.theme) {
            setTheme(config.theme);
        }
        return config;
    }
    catch {
        // Return defaults on any error
        return { ...DEFAULT_CONFIG };
    }
}
// Save configuration using Bun
export async function saveConfig(config) {
    const configPath = getConfigPath();
    const configDir = getConfigDir();
    // Ensure config directory exists
    await Bun.write(join(configDir, '.keep'), ''); // Creates dir as side effect
    // Load existing config and merge
    const existing = await loadConfig();
    const merged = { ...existing, ...config };
    // Write config file
    await Bun.write(configPath, JSON.stringify(merged, null, 2));
}
// Get resolved output directory
export function getOutputDir(config) {
    // First check env var, then config
    const dir = process.env.GEMINI_OUTPUT_DIR || config.outputDir;
    return expandPath(dir);
}
// Get API key from env or config
export function getApiKey(config) {
    return process.env.GEMINI_API_KEY || config.apiKey;
}
// Sync version for quick access (uses cache after first load)
let cachedConfig = null;
export function getConfig() {
    if (!cachedConfig) {
        // Return defaults - actual loading should be done with loadConfig()
        return { ...DEFAULT_CONFIG };
    }
    return cachedConfig;
}
export function setCachedConfig(config) {
    cachedConfig = config;
}
