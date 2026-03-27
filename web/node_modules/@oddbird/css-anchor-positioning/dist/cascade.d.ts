import { type StyleData } from './utils.js';
/**
 * Map of CSS property to CSS custom property that the property's value is
 * shifted into. This is used to subject properties that are not yet natively
 * supported to the CSS cascade and inheritance rules. It is also used by the
 * fallback algorithm to find initial, non-computed values.
 */
export declare const SHIFTED_PROPERTIES: Record<string, string>;
/**
 * Update the given style data to enable cascading and inheritance of properties
 * that are not yet natively supported, or are needed in a different format for
 * the polyfill to work as expected.
 */
export declare function cascadeCSS(styleData: StyleData[]): boolean;
