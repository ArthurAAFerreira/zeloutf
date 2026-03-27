import type { CssNode, Declaration, FunctionNode, Identifier, List, SelectorList, SyntaxParseError, Value } from 'css-tree';
export declare const INSTANCE_UUID: string;
/** Singleton to hold CSS parse errors in case polyfill fails.
 *
 * Not included in the store in parse.ts, as it has a different lifecycle.
 */
export declare const cssParseErrors: Set<SyntaxParseError>;
export interface DeclarationWithValue extends Declaration {
    value: Value;
}
export declare function isAnchorFunction(node: CssNode | null): node is FunctionNode;
/**
 * @param cssText
 * @param captureErrors `true` only on the initial parse of CSS before the
 * polyfill changes it
 */
export declare function getAST(cssText: string, captureErrors?: boolean): CssNode;
export declare function generateCSS(ast: CssNode): string;
export declare function isDeclaration(node: CssNode): node is DeclarationWithValue;
export declare function getDeclarationValue(node: DeclarationWithValue): string;
export interface StyleData {
    el: HTMLElement;
    css: string;
    url?: URL;
    changed?: boolean;
    created?: boolean;
}
export declare const POSITION_ANCHOR_PROPERTY: string;
export declare function splitCommaList(list: List<CssNode>): Identifier[][];
export declare function getSelectors(rule: SelectorList | undefined): {
    selector: string;
    elementPart: string;
    pseudoElementPart: string | undefined;
}[];
export declare function reportParseErrorsOnFailure(): void;
export declare function resetParseErrors(): void;
