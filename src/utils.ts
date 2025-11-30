import { RTS } from "./ops";
import { Absolute, AssemblerOperation, CompoundOp, Immediate, Indirect, Label, PositionLabel, SymbolicLabel, ZeroPage } from "./types";

export const u8 = (value: number): Immediate => ({ type: "Immediate", value });
export const a = (value: number) : Absolute => ({type: "Absolute", value});
export const zp = (value:number): ZeroPage => ({type:"ZeroPage", value}); // TODO ensure is in zero page
export const i = (value:number): Indirect => ({type:"Indirect", value}); // TODO ensure is in zero page

export function label(value:string):SymbolicLabel;
export function label():PositionLabel;
export function label(value:number):PositionLabel;
export function label(value?:any):Label{
    if(arguments.length === 0){
        return { type : "PositionalLabel", value:NaN}
    }
    if(arguments.length === 1 && typeof value === 'number'){
        if(value === 0) throw new Error("Positional labels cannot be 0");
        return {type: "PositionalLabel", value}
    }
    if(typeof value === 'string' ){
        return { type: 'SymbolicLabel', value }
    }
    throw new Error("unknow param");
}
export const hi = (value:number) : number => value >> 8;
export const lo = (value:number) : number => value & 0xFF;
export const inline = (operations: AssemblerOperation[]): CompoundOp => ({
  type: 'compound',
  operations
});

export type FnBlock = {
  block: CompoundOp;
  start: SymbolicLabel;
  end: SymbolicLabel;
  returnLabel: SymbolicLabel;
}
export const fn = (
  name: string,
  getOperations: (symbols: Omit<FnBlock, 'block'>) => AssemblerOperation[]
): FnBlock => {
  const start = label(name);
  const end = label(`${name}_end`);
  const ret = label(`${name}_ret`);

  return {
    start: start,
    end: end,
    returnLabel: ret,
    block: inline([
      start,
      ...getOperations({ start, end, returnLabel: ret }),
      ret,
      RTS(),
      end,
    ])
  };
}