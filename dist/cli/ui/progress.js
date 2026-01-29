/**
 * Progress Bar for CLI
 *
 * Animated progress indicators for long-running operations.
 */
import { getTheme } from './theme.js';
export class Progress {
    current = 0;
    total;
    width;
    complete;
    incomplete;
    head;
    showPercent;
    showEta;
    showValue;
    startTime = Date.now();
    stream = process.stderr;
    label = '';
    constructor(options = {}) {
        const theme = getTheme();
        this.total = options.total ?? 100;
        this.width = options.width ?? 30;
        this.complete = options.complete ?? '█';
        this.incomplete = options.incomplete ?? '░';
        this.head = options.head ?? '█';
        this.showPercent = options.showPercent ?? true;
        this.showEta = options.showEta ?? true;
        this.showValue = options.showValue ?? false;
    }
    start(label) {
        if (label)
            this.label = label;
        this.startTime = Date.now();
        this.current = 0;
        // Hide cursor
        this.stream.write('\x1b[?25l');
        this.render();
        return this;
    }
    update(value, label) {
        this.current = Math.min(value, this.total);
        if (label)
            this.label = label;
        this.render();
        return this;
    }
    increment(amount = 1) {
        return this.update(this.current + amount);
    }
    render() {
        const theme = getTheme();
        const percent = this.current / this.total;
        const completed = Math.floor(this.width * percent);
        const remaining = this.width - completed;
        // Build bar
        let bar = '';
        if (completed > 0) {
            bar += theme.colors.primary(this.complete.repeat(completed - 1));
            bar += theme.colors.highlight(this.head);
        }
        bar += theme.colors.muted(this.incomplete.repeat(remaining));
        // Build status
        const parts = [];
        if (this.label) {
            parts.push(this.label);
        }
        parts.push(bar);
        if (this.showPercent) {
            parts.push(theme.colors.text(`${Math.floor(percent * 100)}%`));
        }
        if (this.showValue) {
            parts.push(theme.colors.muted(`(${this.current}/${this.total})`));
        }
        if (this.showEta && percent > 0 && percent < 1) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const estimatedTotal = elapsed / percent;
            const eta = Math.ceil(estimatedTotal - elapsed);
            parts.push(theme.colors.muted(`(${formatTime(eta)})`));
        }
        this.stream.write(`\r\x1b[K${parts.join(' ')}`);
    }
    done(message) {
        const theme = getTheme();
        this.current = this.total;
        // Clear and show final state
        this.stream.write('\r\x1b[K');
        if (message) {
            this.stream.write(`${theme.colors.success(theme.symbols.success)} ${message}\n`);
        }
        else {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.stream.write(`${theme.colors.success(theme.symbols.success)} ${this.label || 'Complete'} ` +
                `${theme.colors.muted(`(${formatTime(elapsed)})`)}\n`);
        }
        // Show cursor
        this.stream.write('\x1b[?25h');
    }
    fail(message) {
        const theme = getTheme();
        this.stream.write('\r\x1b[K');
        this.stream.write(`${theme.colors.error(theme.symbols.error)} ${message || 'Failed'}\n`);
        this.stream.write('\x1b[?25h');
    }
}
// Format seconds to human readable
function formatTime(seconds) {
    if (seconds < 60) {
        return `${Math.ceil(seconds)}s`;
    }
    else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.ceil(seconds % 60);
        return `${mins}m ${secs}s`;
    }
    else {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${mins}m`;
    }
}
// Convenience function
export function progress(options) {
    return new Progress(options);
}
