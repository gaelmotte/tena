import { Absolute, AssemblerOperation, CompoundOp, Immediate, SymbolicLabel, ZeroPage } from "./types";

export const u8 = (value: number): Immediate => ({ type: "Immediate", value });
export const a = (value: number) : Absolute => ({type: "Absolute", value});
export const zp = (value:number): ZeroPage => ({type:"ZeroPage", value}); // TODO ensure is in zero page
export const label = (value: string): SymbolicLabel => ({ type: 'SymbolicLabel', value });

export const inline = (operations: AssemblerOperation[]): CompoundOp => ({
  type: 'compound',
  operations
});