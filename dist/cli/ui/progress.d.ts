/**
 * Progress Bar for CLI
 *
 * Animated progress indicators for long-running operations.
 */
export interface ProgressOptions {
    total?: number;
    width?: number;
    complete?: string;
    incomplete?: string;
    head?: string;
    showPercent?: boolean;
    showEta?: boolean;
    showValue?: boolean;
}
export declare class Progress {
    private current;
    private total;
    private width;
    private complete;
    private incomplete;
    private head;
    private showPercent;
    private showEta;
    private showValue;
    private startTime;
    private stream;
    private label;
    constructor(options?: ProgressOptions);
    start(label?: string): this;
    update(value: number, label?: string): this;
    increment(amount?: number): this;
    private render;
    done(message?: string): void;
    fail(message?: string): void;
}
export declare function progress(options?: ProgressOptions): Progress;
