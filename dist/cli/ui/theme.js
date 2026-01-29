/**
 * Theme System for Gemini CLI
 *
 * Provides beautiful, consistent styling across all CLI output.
 * Default theme adapts to terminal colors.
 */
import { cyan, magenta, green, red, yellow, blue, brightBlack, white, brightCyan, hex, dim, bold, } from './colors.js';
// Terminal theme - adapts to user's terminal colors
export const terminalTheme = {
    name: 'terminal',
    colors: {
        primary: cyan,
        secondary: magenta,
        success: green,
        error: red,
        warning: yellow,
        info: blue,
        muted: brightBlack,
        text: white,
        highlight: brightCyan,
    },
    symbols: {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ',
        spinner: ['◐', '◓', '◑', '◒'],
        arrow: '→',
        bullet: '•',
        pointer: '❯',
        star: '★',
    },
    box: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
    },
};
// Neon theme - cyberpunk vibes
export const neonTheme = {
    name: 'neon',
    colors: {
        primary: hex('#ff00ff'), // Hot pink
        secondary: hex('#00ffff'), // Cyan
        success: hex('#39ff14'), // Neon green
        error: hex('#ff3131'), // Neon red
        warning: hex('#ffff00'), // Neon yellow
        info: hex('#00bfff'), // Deep sky blue
        muted: hex('#666666'),
        text: hex('#ffffff'),
        highlight: hex('#ff6ec7'), // Pink
    },
    symbols: {
        success: '◆',
        error: '◆',
        warning: '◆',
        info: '◆',
        spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        arrow: '▸',
        bullet: '▪',
        pointer: '▶',
        star: '✦',
    },
    box: {
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        horizontal: '═',
        vertical: '║',
    },
};
// Minimal theme - subtle, mostly monochrome
export const minimalTheme = {
    name: 'minimal',
    colors: {
        primary: white,
        secondary: brightBlack,
        success: green,
        error: red,
        warning: yellow,
        info: brightBlack,
        muted: dim,
        text: white,
        highlight: bold,
    },
    symbols: {
        success: '+',
        error: 'x',
        warning: '!',
        info: '-',
        spinner: ['-', '\\', '|', '/'],
        arrow: '>',
        bullet: '-',
        pointer: '>',
        star: '*',
    },
    box: {
        topLeft: '+',
        topRight: '+',
        bottomLeft: '+',
        bottomRight: '+',
        horizontal: '-',
        vertical: '|',
    },
};
// Ocean theme - blues and teals
export const oceanTheme = {
    name: 'ocean',
    colors: {
        primary: hex('#00ced1'), // Dark turquoise
        secondary: hex('#4682b4'), // Steel blue
        success: hex('#20b2aa'), // Light sea green
        error: hex('#ff6347'), // Tomato
        warning: hex('#ffa500'), // Orange
        info: hex('#87ceeb'), // Sky blue
        muted: hex('#708090'), // Slate gray
        text: hex('#e0ffff'), // Light cyan
        highlight: hex('#00ffff'), // Aqua
    },
    symbols: {
        success: '●',
        error: '●',
        warning: '●',
        info: '●',
        spinner: ['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙●∙', '●∙∙'],
        arrow: '➜',
        bullet: '○',
        pointer: '➤',
        star: '✧',
    },
    box: {
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        horizontal: '─',
        vertical: '│',
    },
};
// Forest theme - greens and earth tones
export const forestTheme = {
    name: 'forest',
    colors: {
        primary: hex('#228b22'), // Forest green
        secondary: hex('#8b4513'), // Saddle brown
        success: hex('#32cd32'), // Lime green
        error: hex('#dc143c'), // Crimson
        warning: hex('#daa520'), // Goldenrod
        info: hex('#6b8e23'), // Olive drab
        muted: hex('#696969'), // Dim gray
        text: hex('#f5f5dc'), // Beige
        highlight: hex('#98fb98'), // Pale green
    },
    symbols: {
        success: '✓',
        error: '✗',
        warning: '⚡',
        info: '❧',
        spinner: ['🌱', '🌿', '🌳', '🌲'],
        arrow: '➔',
        bullet: '❀',
        pointer: '➣',
        star: '❁',
    },
    box: {
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        horizontal: '━',
        vertical: '┃',
    },
};
// All available themes
export const themes = {
    terminal: terminalTheme,
    neon: neonTheme,
    minimal: minimalTheme,
    ocean: oceanTheme,
    forest: forestTheme,
};
// Current active theme (default to terminal)
let currentTheme = terminalTheme;
export function setTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
        currentTheme = theme;
    }
}
export function getTheme() {
    return currentTheme;
}
// Convenience function to get themed colors
export function t() {
    return currentTheme;
}
