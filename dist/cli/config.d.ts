/**
 * CLI Configuration
 *
 * Loads and manages CLI configuration using Bun's native file APIs.
 * Config file: ~/.config/gemini-cli/config.json
 */
export interface CLIConfig {
    theme: string;
    outputDir: string;
    defaultVoice: string;
    defaultImageSize: '1K' | '2K' | '4K';
    defaultImageRatio: string;
    defaultVideoRatio: '16:9' | '9:16';
    apiKey?: string;
}
export declare function getConfigDir(): string;
export declare function getConfigPath(): string;
export declare function loadConfig(): Promise<CLIConfig>;
export declare function saveConfig(config: Partial<CLIConfig>): Promise<void>;
export declare function getOutputDir(config: CLIConfig): string;
export declare function getApiKey(config: CLIConfig): string | undefined;
export declare function getConfig(): CLIConfig;
export declare function setCachedConfig(config: CLIConfig): void;
