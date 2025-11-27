
export type SymbolicLabel = { type: 'SymbolicLabel', value: string };
export type PositionLabel = {type: 'PositionalLabel', value: number};
export type Label = SymbolicLabel | PositionLabel;
export type Immediate = { type: "Immediate"; value: number };
export type Absolute = { type: "Absolute"; value: number };
export type ZeroPage = { type: "ZeroPage"; value: number };
export type Indirect = { type: "Indirect"; value: number };
// FIX FOR JMP
export type IndirectLabel = Indirect & { symbol: Label }


export type SymbolOr<T> = Label | T;

export type BaseOp = { type: "opDescription"; bytes: Uint8Array };
export type SymbolOp = BaseOp  & { symbol: Label, size: 8 | 16, isRelative : boolean };
export type CompoundOp= { type: 'compound', operations: AssemblerOperation[]; };


export type OpDescription =
  | BaseOp
  | SymbolOp
  | CompoundOp


export type AssemblerOperation =
  | Label
  | OpDescription;
//   | InlineBytes
//   | OffsetControl
//   | VirtualOffsetControl
//   | AlignOffsetControl
//   | CompoundOperation;

export enum Index {
  X = "x",
  Y = "y",
  PREX= "prex",
  POSTY = "posty",
}
