import { Absolute, Immediate, SymbolicLabel } from "./types";

export const u8 = (value: number): Immediate => ({ type: "Immediate", value });
export const a = (value: number) : Absolute => ({type: "Absolute", value})
export const label = (value: string): SymbolicLabel => ({ type: 'SymbolicLabel', value });