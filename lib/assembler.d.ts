import { AssemblerOperation, SymbolicLabel } from "./types";
type RevisitItem = {
    symbol: SymbolicLabel;
    itemOffset: number;
};
type SymbolTable = Record<string, number>;
type RevisitQueue = Array<RevisitItem>;
type AssemblerState = {
    revisit: RevisitQueue;
    symbols: SymbolTable;
    offset: number;
    ROMBuffer: Uint8Array;
};
export declare const processHeader: (state: AssemblerState) => void;
export declare const processOp: (op: AssemblerOperation, state: AssemblerState) => void;
export declare const assemble: (ops: AssemblerOperation[]) => void;
export {};
