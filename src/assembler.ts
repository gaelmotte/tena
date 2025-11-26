import { getRamSymbolTable } from "./ram";
import { AssemblerOperation, CompoundOp, SymbolicLabel, SymbolOp } from "./types";

type RevisitItem = {
  itemOffset: number;
  symbolOp : SymbolOp;
};
export type SymbolTable = Record<string, number>;
type RevisitQueue = Array<RevisitItem>;
type ResolutionResult = {
  resolved: boolean;
  value: number;
};

type AssemblerState = {
  revisit: RevisitQueue;
  symbols: SymbolTable;
  offset: number;
  ROMBuffer: Uint8Array;
};

export const processHeader = (state: AssemblerState) => {
  state.ROMBuffer = new Uint8Array([
    0x4e,
    0x45,
    0x53,
    0x1a,
    2, // 2x 16KB PRG-ROM Banks
    1, // 1x  8KB CHR-ROM
    0, // mapper 0 (NROM)
    0, // System: NES
    0, // padding
    0, // padding
    0, // padding
    0, // padding
    0, // padding
    0, // padding
    0, // padding
    0, // padding
    ...state.ROMBuffer,
  ]);

};
const printSymbol = (name: string, offset: number) => {
  console.log(
        `${name.padEnd(30, " ")} 0x${(offset)
          .toString(16)
          .padStart(4, "0")}`
      );
}

export const processOp = (op: AssemblerOperation, state: AssemblerState) => {
  switch (op.type) {
    case "SymbolicLabel":
      if (op.value in state.symbols) {
        // TODO: Improve these errors with positional information
        throw new Error(`Symbol "${op.value}" has already been declared`);
      }
      // if (reservedSymbols.includes(op.value)) {
      //   throw new Error(`Symbol "${op.value}" has reserved`);
      // }

      const labelOffset = state.offset;

      // if (!op.value.startsWith('__discard')) {
      printSymbol(op.value, labelOffset + 0x8000);
      // }

      state.symbols[op.value] = labelOffset;
      return;

    case "opDescription":
      if (!Object.keys(op).includes("symbol")) {
        op.bytes.forEach(
          (byte: number) => (state.ROMBuffer[state.offset++] = byte)
        );
        return;
      }

      // is a symbolic op
      const symbolOp = op as SymbolOp;

      const existingSymbol = state.symbols[symbolOp.symbol.value]
      if( existingSymbol != undefined){
        if(symbolOp.size == 16){
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) & 0xFF;
          state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) >> 8;
        }else{
          // TODO ensure relative ofset is less in a Byte Range
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = existingSymbol - state.offset;
        }

        return;
      }

      state.revisit.push({symbolOp, itemOffset: state.offset});
      if(symbolOp.size == 16){
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
          state.ROMBuffer[state.offset++] = 0;
        }else{
          // TODO ensure relative ofset is less in a Byte Range
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
        }

      return;

    case "compound": {
      for (let compoundOp of op.operations ) {
        processOp(compoundOp, state);
      }
    } return;

    default:
      throw new Error("Not Implemented Yet");
  }
};

const processRevisit = (revisit: RevisitItem, state: AssemblerState) => {
  const existingSymbol = state.symbols[revisit.symbolOp.symbol.value];
  if(existingSymbol == undefined){
    throw new Error("Symbol not resolved:"+revisit.symbolOp.symbol.value);
  }
 
  if(revisit.symbolOp.size == 16){
    state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
    state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) & 0xFF;
    state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) >> 8;
  }else{
    // TODO ensure relative ofset is less in a Byte Range
    state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
    state.ROMBuffer[revisit.itemOffset++] = existingSymbol - revisit.itemOffset;
  }
}

const putAdress = (adress: number, state: AssemblerState) => {
  state.ROMBuffer[state.offset++] = adress & 0xff;
  state.ROMBuffer[state.offset++] = adress >> 8;
};
const processFooter = (state: AssemblerState) => {
  state.offset = 0x7FFA;
  putAdress(0x8000, state);
  putAdress(0x8001, state);
  putAdress(0x0000, state);
};

export const assemble = (ops: AssemblerOperation[]) => {
  const state: AssemblerState = {
    offset: 0x0000,
    symbols: {},
    revisit: [],
    ROMBuffer: new Uint8Array(0x8000), // Simple 32kb ROM only (for now)
  };

  for (let op of ops) {
    processOp(op, state);
  }

  for (let revisit of state.revisit){
    processRevisit(revisit, state);
  }

  processFooter(state);

  processHeader(state);

  const ramSymbols = getRamSymbolTable();
  Object.entries(ramSymbols).forEach(([label,value])=>printSymbol(label, value));


  return {
    buffer: state.ROMBuffer,
    symbols: state.symbols,
    ramSymbols: ramSymbols,
    finalOffset: state.offset,
  };
};
