/**
 * Box Component for CLI
 *
 * Creates beautiful bordered boxes for headers, results, and highlights.
 */
export interface BoxOptions {
    title?: string;
    padding?: number;
    margin?: number;
    borderColor?: (text: string) => string;
    titleColor?: (text: string) => string;
    width?: number | 'auto';
    align?: 'left' | 'center' | 'right';
}
export declare function box(content: string | string[], options?: BoxOptions): string;
export declare function header(title: string, subtitle?: string): string;
export declare function success(message: string): string;
export declare function error(message: string): string;
export declare function warning(message: string): string;
export declare function info(message: string): string;
