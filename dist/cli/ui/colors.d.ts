/**
 * Terminal Color Utilities
 *
 * Uses ANSI escape codes directly for zero dependencies.
 * Respects NO_COLOR and FORCE_COLOR environment variables.
 * Bun handles these natively in TTY detection.
 */
export declare const black: (text: string) => string;
export declare const red: (text: string) => string;
export declare const green: (text: string) => string;
export declare const yellow: (text: string) => string;
export declare const blue: (text: string) => string;
export declare const magenta: (text: string) => string;
export declare const cyan: (text: string) => string;
export declare const white: (text: string) => string;
export declare const brightBlack: (text: string) => string;
export declare const brightRed: (text: string) => string;
export declare const brightGreen: (text: string) => string;
export declare const brightYellow: (text: string) => string;
export declare const brightBlue: (text: string) => string;
export declare const brightMagenta: (text: string) => string;
export declare const brightCyan: (text: string) => string;
export declare const brightWhite: (text: string) => string;
export declare const bgBlack: (text: string) => string;
export declare const bgRed: (text: string) => string;
export declare const bgGreen: (text: string) => string;
export declare const bgYellow: (text: string) => string;
export declare const bgBlue: (text: string) => string;
export declare const bgMagenta: (text: string) => string;
export declare const bgCyan: (text: string) => string;
export declare const bgWhite: (text: string) => string;
export declare const bold: (text: string) => string;
export declare const dim: (text: string) => string;
export declare const italic: (text: string) => string;
export declare const underline: (text: string) => string;
export declare const inverse: (text: string) => string;
export declare const strikethrough: (text: string) => string;
export declare function rgb(r: number, g: number, b: number): (text: string) => string;
export declare function bgRgb(r: number, g: number, b: number): (text: string) => string;
export declare function color256(code: number): (text: string) => string;
export declare function hex(hexColor: string): (text: string) => string;
export declare const colors: {
    enabled: boolean;
    reset: string;
};
export declare function style(...styles: Array<(text: string) => string>): (text: string) => string;
