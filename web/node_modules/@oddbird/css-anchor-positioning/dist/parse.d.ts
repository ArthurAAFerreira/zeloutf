import type { CssNode, Identifier } from 'css-tree';
import { type PseudoElement, type Selector } from './dom.js';
import { type PositionTryOrder } from './fallback.js';
import type { NormalizedAnchorPositioningPolyfillOptions } from './polyfill.js';
import { type PositionAreaTargetData } from './position-area.js';
import { type AcceptedAnchorSizeProperty, type AcceptedPositionTryProperty, type AnchorSide, type AnchorSize } from './syntax.js';
import { type StyleData } from './utils.js';
type AnchorSelectors = Record<string, Selector[]>;
export interface AnchorFunction {
    targetEl?: HTMLElement | null;
    anchorEl?: HTMLElement | PseudoElement | null;
    anchorName?: string;
    anchorSide?: AnchorSide;
    anchorSize?: AnchorSize;
    fallbackValue: string;
    customPropName?: string;
    uuid: string;
}
export type AnchorFunctionDeclaration = Partial<Record<AcceptedAnchorSizeProperty | 'position-area', (AnchorFunction | PositionAreaTargetData)[]>>;
export interface AnchorPosition {
    declarations?: AnchorFunctionDeclaration;
    fallbacks?: TryBlock[];
    order?: PositionTryOrder;
}
export type AnchorPositions = Record<string, AnchorPosition>;
export interface TryBlock {
    uuid: string;
    declarations: Partial<Record<AcceptedPositionTryProperty, string>>;
}
export declare function isIdentifier(node: CssNode): node is Identifier;
export declare function parseCSS(styleData: StyleData[], options: NormalizedAnchorPositioningPolyfillOptions): Promise<{
    rules: AnchorPositions;
    inlineStyles: Map<HTMLElement, Record<string, string>>;
    anchorScopes: AnchorSelectors;
}>;
export {};
