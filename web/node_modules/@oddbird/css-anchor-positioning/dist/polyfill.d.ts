import { type Rect } from '@floating-ui/dom';
import { type AnchorPositions } from './parse.js';
import { type AnchorSide, type AnchorSize, type InsetProperty, type SizingProperty } from './syntax.js';
export declare const resolveLogicalSideKeyword: (side: AnchorSide, rtl: boolean) => number | undefined;
export declare const resolveLogicalSizeKeyword: (size: AnchorSize, vertical: boolean) => "height" | "width" | undefined;
export declare const getAxis: (position?: string) => "x" | "y" | null;
export declare const getAxisProperty: (axis: "x" | "y" | null) => "width" | "height" | null;
export interface GetPixelValueOpts {
    targetEl?: HTMLElement;
    targetProperty: InsetProperty | SizingProperty | 'position-area';
    anchorRect?: Rect;
    anchorSide?: AnchorSide;
    anchorSize?: AnchorSize;
    fallback?: string | null;
}
export declare const getPixelValue: ({ targetEl, targetProperty, anchorRect, anchorSide, anchorSize, fallback, }: GetPixelValueOpts) => Promise<string | null>;
export type AnchorPositioningRoot = Document | HTMLElement;
export interface AnchorPositioningPolyfillOptions {
    useAnimationFrame?: boolean;
    elements?: HTMLElement[];
    /**
     * Set the root elements that are queried when looking for anchors and targets.
     * @default document
     */
    roots?: AnchorPositioningRoot[];
    excludeInlineStyles?: boolean;
}
/** @internal */
export interface NormalizedAnchorPositioningPolyfillOptions {
    elements?: HTMLElement[];
    excludeInlineStyles?: boolean;
    roots: AnchorPositioningRoot[];
    useAnimationFrame?: boolean;
}
export declare function polyfill(useAnimationFrameOrOption?: boolean | AnchorPositioningPolyfillOptions): Promise<AnchorPositions>;
