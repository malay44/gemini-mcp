/**
 * Logger Utility - Provides logging capabilities with different verbosity levels
 */
export type LogLevel = "quiet" | "normal" | "verbose";
interface Logger {
    error: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
    prompt: (prompt: string) => void;
    response: (response: string) => void;
}
/**
 * Sets up the logger with the specified verbosity level
 */
export declare function setupLogger(level: LogLevel): void;
/**
 * Returns whether full prompts and responses should be logged
 */
export declare function shouldLogFullMessages(): boolean;
/**
 * Returns whether info messages should be logged
 */
export declare function shouldLogInfo(): boolean;
/**
 * Returns whether debug messages should be logged
 */
export declare function shouldLogDebug(): boolean;
/**
 * The logger instance
 */
export declare const logger: Logger;
export {};
