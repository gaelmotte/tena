
export type SymbolicLabel = { type: 'SymbolicLabel', value: string };
export type Immediate = { type: "Immediate"; value: number };
export type Absolute = { type: "Absolute"; value: number };
export type ZeroPage = { type: "ZeroPage"; value: number };
export type Indirect = { type: "Indirect"; value: number };
export type SymbolOr<T> = SymbolicLabel | T;

export type BaseOp = { type: "opDescription"; bytes: Uint8Array };
export type SymbolOp = BaseOp  & { symbol: SymbolicLabel, size: 8 | 16, isRelative : boolean };

export type OpDescription =
  | BaseOp
  | SymbolOp

export enum Index {
  X = "x",
  Y = "y",
  PREX= "prex",
  POSTY = "posty",
}
