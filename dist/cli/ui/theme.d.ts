/**
 * Theme System for Gemini CLI
 *
 * Provides beautiful, consistent styling across all CLI output.
 * Default theme adapts to terminal colors.
 */
export interface Theme {
    name: string;
    colors: {
        primary: (text: string) => string;
        secondary: (text: string) => string;
        success: (text: string) => string;
        error: (text: string) => string;
        warning: (text: string) => string;
        info: (text: string) => string;
        muted: (text: string) => string;
        text: (text: string) => string;
        highlight: (text: string) => string;
    };
    symbols: {
        success: string;
        error: string;
        warning: string;
        info: string;
        spinner: string[];
        arrow: string;
        bullet: string;
        pointer: string;
        star: string;
    };
    box: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        horizontal: string;
        vertical: string;
    };
}
export declare const terminalTheme: Theme;
export declare const neonTheme: Theme;
export declare const minimalTheme: Theme;
export declare const oceanTheme: Theme;
export declare const forestTheme: Theme;
export declare const themes: Record<string, Theme>;
export declare function setTheme(themeName: string): void;
export declare function getTheme(): Theme;
export declare function t(): Theme;
