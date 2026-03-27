import { type NormalizedAnchorPositioningPolyfillOptions } from './polyfill.js';
import { type StyleData } from './utils.js';
export declare function isStyleLink(link: HTMLLinkElement): link is HTMLLinkElement;
export declare function fetchCSS(options: NormalizedAnchorPositioningPolyfillOptions): Promise<StyleData[]>;
