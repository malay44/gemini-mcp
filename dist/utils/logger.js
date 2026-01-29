/**
 * Logger Utility - Provides logging capabilities with different verbosity levels
 */
/**
 * Current logging level
 */
let currentLogLevel = "normal";
/**
 * Sets up the logger with the specified verbosity level
 */
export function setupLogger(level) {
    currentLogLevel = level;
}
/**
 * Returns whether full prompts and responses should be logged
 */
export function shouldLogFullMessages() {
    return currentLogLevel === "verbose";
}
/**
 * Returns whether info messages should be logged
 */
export function shouldLogInfo() {
    return currentLogLevel !== "quiet";
}
/**
 * Returns whether debug messages should be logged
 */
export function shouldLogDebug() {
    return currentLogLevel === "verbose";
}
/**
 * The logger instance
 */
export const logger = {
    error: (message, ...args) => {
        // Errors are always logged
        console.error(`ERROR: ${message}`, ...args);
    },
    warn: (message, ...args) => {
        // Warnings are always logged
        console.warn(`WARN: ${message}`, ...args);
    },
    info: (message, ...args) => {
        // Info messages are logged in normal and verbose modes
        if (shouldLogInfo()) {
            console.info(`INFO: ${message}`, ...args);
        }
    },
    debug: (message, ...args) => {
        // Debug messages are only logged in verbose mode
        if (shouldLogDebug()) {
            console.debug(`DEBUG: ${message}`, ...args);
        }
    },
    prompt: (prompt) => {
        // Prompts are only fully logged in verbose mode
        if (shouldLogFullMessages()) {
            console.info(`\n===== PROMPT =====\n${prompt}\n==================\n`);
        }
        else if (shouldLogInfo()) {
            // In normal mode, just log a summary
            const summary = prompt.length > 100
                ? `${prompt.substring(0, 100)}...`
                : prompt;
            console.info(`PROMPT: ${summary}`);
        }
    },
    response: (response) => {
        // Responses are only fully logged in verbose mode
        if (shouldLogFullMessages()) {
            console.info(`\n===== RESPONSE =====\n${response}\n====================\n`);
        }
        else if (shouldLogInfo()) {
            // In normal mode, just log a summary
            const summary = response.length > 100
                ? `${response.substring(0, 100)}...`
                : response;
            console.info(`RESPONSE: ${summary}`);
        }
    }
};
