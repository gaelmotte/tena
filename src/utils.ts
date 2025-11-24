import { Immediate, SymbolicLabel } from "./types";

export const u8 = (value: number): Immediate => ({ type: "Immediate", value });
export const label = (value: string): SymbolicLabel => ({ type: 'SymbolicLabel', value });