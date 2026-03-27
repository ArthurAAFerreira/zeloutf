import { type Block, type CssNode } from 'css-tree';
import { type PseudoElement } from './dom.js';
export declare const POSITION_AREA_CASCADE_PROPERTY = "--pa-cascade-property";
export declare const POSITION_AREA_WRAPPER_ATTRIBUTE = "data-anchor-position-wrapper";
type PositionAreaGridValue = 0 | 1 | 2 | 3;
declare enum WritingMode {
    Logical = "Logical",
    LogicalSelf = "LogicalSelf",
    Physical = "Physical",
    PhysicalSelf = "PhysicalSelf",
    Irrelevant = "Irrelevant"
}
export declare const POSITION_AREA_PROPS: readonly ["left", "center", "right", "span-left", "span-right", "x-start", "x-end", "span-x-start", "span-x-end", "self-x-start", "self-x-end", "span-self-x-start", "span-self-x-end", "span-all", "top", "bottom", "span-top", "span-bottom", "y-start", "y-end", "span-y-start", "span-y-end", "self-y-start", "self-y-end", "span-self-y-start", "span-self-y-end", "block-start", "block-end", "span-block-start", "span-block-end", "inline-start", "inline-end", "span-inline-start", "span-inline-end", "self-block-start", "self-block-end", "span-self-block-start", "span-self-block-end", "self-inline-start", "self-inline-end", "span-self-inline-start", "span-self-inline-end", "start", "end", "span-start", "span-end", "self-start", "self-end", "span-self-start", "span-self-end"];
export type PositionAreaProperty = (typeof POSITION_AREA_PROPS)[number];
export declare function isPositionAreaProp(property: string | PositionAreaProperty): property is PositionAreaProperty;
declare const POSITION_AREA_X: PositionAreaProperty[];
declare const POSITION_AREA_Y: PositionAreaProperty[];
declare const POSITION_AREA_BLOCK: PositionAreaProperty[];
declare const POSITION_AREA_INLINE: PositionAreaProperty[];
declare const POSITION_AREA_SELF_BLOCK: PositionAreaProperty[];
declare const POSITION_AREA_SELF_INLINE: PositionAreaProperty[];
declare const POSITION_AREA_SHORTHAND: PositionAreaProperty[];
declare const POSITION_AREA_SELF_SHORTHAND: PositionAreaProperty[];
export type PositionAreaX = (typeof POSITION_AREA_X)[number];
export type PositionAreaY = (typeof POSITION_AREA_Y)[number];
export type PositionAreaBlock = (typeof POSITION_AREA_BLOCK)[number];
export type PositionAreaInline = (typeof POSITION_AREA_INLINE)[number];
export type PositionAreaSelfBlock = (typeof POSITION_AREA_SELF_BLOCK)[number];
export type PositionAreaSelfInline = (typeof POSITION_AREA_SELF_INLINE)[number];
export type PositionAreaShorthand = (typeof POSITION_AREA_SHORTHAND)[number];
export type PositionAreaSelfShorthand = (typeof POSITION_AREA_SELF_SHORTHAND)[number];
export declare function axisForPositionAreaValue(value: string): 'block' | 'inline' | 'ambiguous';
export type InsetValue = 0 | 'top' | 'bottom' | 'left' | 'right';
interface AxisInfo<T> {
    block: T;
    inline: T;
}
export interface PositionAreaDeclaration {
    values: AxisInfo<string>;
    grid: AxisInfo<[PositionAreaGridValue, PositionAreaGridValue, WritingMode]>;
    selectorUUID: string;
}
export interface PositionAreaData {
    values: AxisInfo<string>;
    grid: AxisInfo<[PositionAreaGridValue, PositionAreaGridValue]>;
    insets: AxisInfo<[InsetValue, InsetValue]>;
    alignments: AxisInfo<'start' | 'end' | 'center'>;
    changed: boolean;
    selectorUUID: string;
}
export interface PositionAreaTargetData {
    values: AxisInfo<string>;
    grid: AxisInfo<[PositionAreaGridValue, PositionAreaGridValue, WritingMode]>;
    insets: AxisInfo<[InsetValue, InsetValue]>;
    alignments: AxisInfo<'start' | 'end' | 'center'>;
    selectorUUID: string;
    targetUUID: string;
    anchorEl: HTMLElement | PseudoElement | null;
    wrapperEl: HTMLElement;
    targetEl: HTMLElement;
}
export declare function getPositionAreaDeclaration(node: CssNode): PositionAreaDeclaration | undefined;
export declare function addPositionAreaDeclarationBlockStyles(declaration: PositionAreaDeclaration, block: Block): void;
export declare function wrapperForPositionedElement(targetEl: HTMLElement, targetUUID: string): HTMLElement;
export declare function dataForPositionAreaTarget(targetEl: HTMLElement, positionAreaData: PositionAreaDeclaration, anchorEl: HTMLElement | PseudoElement | null): Promise<PositionAreaTargetData>;
export declare function activeWrapperStyles(targetUUID: string, selectorUUID: string): string;
export {};
