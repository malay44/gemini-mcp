/**
 * Animated Spinner for CLI
 *
 * Beautiful loading indicators that work in any terminal.
 */
export interface SpinnerOptions {
    text?: string;
    color?: (text: string) => string;
    frames?: string[];
    interval?: number;
}
export declare class Spinner {
    private text;
    private color;
    private frames;
    private interval;
    private currentFrame;
    private timer;
    private stream;
    constructor(options?: SpinnerOptions);
    start(text?: string): this;
    private render;
    update(text: string): this;
    stop(): this;
    success(text?: string): void;
    error(text?: string): void;
    warn(text?: string): void;
    info(text?: string): void;
    private stopWithSymbol;
}
export declare function spinner(options?: SpinnerOptions | string): Spinner;
export declare const spinners: {
    dots: string[];
    line: string[];
    circle: string[];
    arc: string[];
    pulse: string[];
    bounce: string[];
    arrows: string[];
    moon: string[];
    clock: string[];
};
