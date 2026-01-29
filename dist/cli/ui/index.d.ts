/**
 * UI Components for Gemini CLI
 *
 * Beautiful, theme-aware terminal UI components.
 */
export * from './colors.js';
export { getTheme, setTheme, t, themes } from './theme.js';
export type { Theme } from './theme.js';
export { Spinner, spinner, spinners } from './spinner.js';
export type { SpinnerOptions } from './spinner.js';
export { Progress, progress } from './progress.js';
export type { ProgressOptions } from './progress.js';
export { box, header, success, error, warning, info } from './box.js';
export type { BoxOptions } from './box.js';
export declare function print(message: string): void;
export declare function printSuccess(message: string): void;
export declare function printError(message: string): void;
export declare function printWarning(message: string): void;
export declare function printInfo(message: string): void;
export declare function printMuted(message: string): void;
export declare function nl(count?: number): void;
