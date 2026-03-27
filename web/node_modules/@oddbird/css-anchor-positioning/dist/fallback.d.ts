import type { Atrule, Declaration, Identifier } from 'css-tree';
import { type AnchorPositions, type TryBlock } from './parse.js';
import { type PositionAreaProperty } from './position-area.js';
import { type AcceptedPositionTryProperty } from './syntax.js';
import { type StyleData } from './utils.js';
type FallbackTargets = Record<string, string[]>;
declare const POSITION_TRY_ORDERS: readonly ["normal", "most-width", "most-height", "most-block-size", "most-inline-size"];
export type PositionTryOrder = (typeof POSITION_TRY_ORDERS)[number];
declare const POSITION_TRY_TACTICS: readonly ["flip-block", "flip-inline", "flip-start"];
export type PositionTryOptionsTryTactics = (typeof POSITION_TRY_TACTICS)[number];
interface PositionTryDefTactic {
    type: 'try-tactic';
    tactics: PositionTryOptionsTryTactics[];
}
interface PositionTryDefPositionArea {
    type: 'position-area';
    positionArea: PositionAreaProperty;
}
interface PositionTryDefAtRule {
    type: 'at-rule';
    atRule: Identifier['name'];
}
interface PositionTryDefAtRuleWithTactic {
    type: 'at-rule-with-try-tactic';
    tactics: PositionTryOptionsTryTactics[];
    atRule: Identifier['name'];
}
type PositionTryObject = PositionTryDefTactic | PositionTryDefPositionArea | PositionTryDefAtRule | PositionTryDefAtRuleWithTactic;
export declare function applyTryTacticsToSelector(selector: string, tactics: PositionTryOptionsTryTactics[]): Partial<Record<"height" | "width" | "left" | "top" | "bottom" | "inset" | "margin" | "right" | "inset-block-start" | "inset-block-end" | "inset-inline-start" | "inset-inline-end" | "inset-block" | "inset-inline" | "margin-block-start" | "margin-block-end" | "margin-block" | "margin-inline-start" | "margin-inline-end" | "margin-inline" | "margin-bottom" | "margin-left" | "margin-right" | "margin-top" | "min-width" | "min-height" | "max-width" | "max-height" | "block-size" | "inline-size" | "min-block-size" | "min-inline-size" | "max-block-size" | "max-inline-size" | "justify-self" | "align-self" | "place-self" | "position-anchor" | "position-area", string>> | undefined;
export declare function applyTryTacticsToAtRule(block: TryBlock, tactics: PositionTryOptionsTryTactics[]): Partial<Record<"height" | "width" | "left" | "top" | "bottom" | "inset" | "margin" | "right" | "inset-block-start" | "inset-block-end" | "inset-inline-start" | "inset-inline-end" | "inset-block" | "inset-inline" | "margin-block-start" | "margin-block-end" | "margin-block" | "margin-inline-start" | "margin-inline-end" | "margin-inline" | "margin-bottom" | "margin-left" | "margin-right" | "margin-top" | "min-width" | "min-height" | "max-width" | "max-height" | "block-size" | "inline-size" | "min-block-size" | "min-inline-size" | "max-block-size" | "max-inline-size" | "justify-self" | "align-self" | "place-self" | "position-anchor" | "position-area", string>>;
type InsetRules = Partial<Record<AcceptedPositionTryProperty, string>>;
export declare function applyTryTacticToBlock(rules: InsetRules, tactic: PositionTryOptionsTryTactics): Partial<Record<"height" | "width" | "left" | "top" | "bottom" | "inset" | "margin" | "right" | "inset-block-start" | "inset-block-end" | "inset-inline-start" | "inset-inline-end" | "inset-block" | "inset-inline" | "margin-block-start" | "margin-block-end" | "margin-block" | "margin-inline-start" | "margin-inline-end" | "margin-inline" | "margin-bottom" | "margin-left" | "margin-right" | "margin-top" | "min-width" | "min-height" | "max-width" | "max-height" | "block-size" | "inline-size" | "min-block-size" | "min-inline-size" | "max-block-size" | "max-inline-size" | "justify-self" | "align-self" | "place-self" | "position-anchor" | "position-area", string>>;
export declare function getPositionTryDeclaration(node: Declaration): {
    order?: PositionTryOrder;
    options?: PositionTryObject[];
};
export declare function getPositionFallbackValues(node: Declaration): {
    order?: PositionTryOrder;
    options?: PositionTryObject[];
};
export declare function isAcceptedPositionTryProperty(declaration: Declaration): boolean;
export declare function getPositionTryRules(node: Atrule): {
    name: string;
    tryBlock: TryBlock;
} | {
    name?: undefined;
    tryBlock?: undefined;
};
export declare function parsePositionFallbacks(styleData: StyleData[]): {
    fallbackTargets: FallbackTargets;
    validPositions: AnchorPositions;
};
export {};
