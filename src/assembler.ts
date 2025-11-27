import { buffer } from "stream/consumers";
import { format } from "./mesenSymbolsFormater";
import { getRamSymbolTable } from "./ram";
import { AssemblerOperation, SymbolicLabel, SymbolOp } from "./types";

type RevisitItem = {
  itemOffset: number;
  symbolOp: SymbolOp;
};
export type SymbolTable = Record<string, number>;
type RevisitQueue = Array<RevisitItem>;

type AssemblerState = {
  revisit: RevisitQueue;
  symbols: SymbolTable;
  positionalSymbols: number[];
  offset: number;
  ROMBuffer: Uint8Array;
};

type VectorTable = {
  nmi: SymbolicLabel;
  reset: SymbolicLabel;
  irq?: SymbolicLabel;
};

export const processHeader = (state: AssemblerState) => {
  state.ROMBuffer = new Uint8Array([
    0x4e,
    0x45,
    0x53,
    0x1a,
    2, // 2x 16KB PRG-ROM Banks
    1, // 1x  8KB CHR-ROM
    1, // mapper 0 (NROM), vertical miroring
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
    `${name.padEnd(30, " ")} 0x${offset.toString(16).padStart(4, "0")}`
  );
};

export const processOp = (op: AssemblerOperation, state: AssemblerState) => {
  switch (op.type) {
    case "PositionalLabel":
      state.positionalSymbols.push(state.offset);
      return;
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

      if (symbolOp.symbol.type === "SymbolicLabel") {
        const existingSymbol = state.symbols[symbolOp.symbol.value];
        if (existingSymbol != undefined) {
          if (symbolOp.size == 16) {
            state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
            state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) & 0xff;
            state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) >> 8;
          } else {
            // TODO ensure relative ofset is less in a Byte Range
            state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
            state.ROMBuffer[state.offset++] = existingSymbol - state.offset;
          }

          return;
        }

        state.revisit.push({ symbolOp, itemOffset: state.offset });
        if (symbolOp.size == 16) {
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
          state.ROMBuffer[state.offset++] = 0;
        } else {
          // TODO ensure relative ofset is less in a Byte Range
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
        }
      } else {
        // is a positional symbol
        if (symbolOp.symbol.value < 0) {
          const existingSymbol =
            state.positionalSymbols[
              state.positionalSymbols.length + symbolOp.symbol.value // value is negative
            ];
          if (symbolOp.size == 16) {
            state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
            state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) & 0xff;
            state.ROMBuffer[state.offset++] = (existingSymbol + 0x8000) >> 8;
          } else {
            // TODO ensure relative ofset is less in a Byte Range
            state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
            state.ROMBuffer[state.offset++] = existingSymbol - state.offset;
          }

          return;
        }
        // futur positional symbol
        state.revisit.push({ symbolOp, itemOffset: state.offset });
        if (symbolOp.size == 16) {
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
          state.ROMBuffer[state.offset++] = 0;
        } else {
          // TODO ensure relative ofset is less in a Byte Range
          state.ROMBuffer[state.offset++] = symbolOp.bytes[0];
          state.ROMBuffer[state.offset++] = 0;
        }
      }

      return;

    case "compound":
      {
        for (let compoundOp of op.operations) {
          processOp(compoundOp, state);
        }
      }
      return;

    default:
      throw new Error("Not Implemented Yet");
  }
};

const processRevisit = (revisit: RevisitItem, state: AssemblerState) => {
  if (revisit.symbolOp.symbol.type === "SymbolicLabel") {
    const existingSymbol = state.symbols[revisit.symbolOp.symbol.value];
    if (existingSymbol == undefined) {
      throw new Error("Symbol not resolved:" + revisit.symbolOp.symbol.value);
    }

    if (revisit.symbolOp.size == 16) {
      state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
      state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) & 0xff;
      state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) >> 8;
    } else {
      // TODO ensure relative ofset is less in a Byte Range
      state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
      state.ROMBuffer[revisit.itemOffset++] =
        existingSymbol - revisit.itemOffset;
    }
  } else {
    // positional symbol
    if (revisit.symbolOp.symbol.value < 0)
      throw new Error("we should not have revisited this");
    const existingSymbol = state.positionalSymbols.filter(
      (it) => it > revisit.itemOffset
    )[0];
    if (revisit.symbolOp.size == 16) {
      state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
      state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) & 0xff;
      state.ROMBuffer[revisit.itemOffset++] = (existingSymbol + 0x8000) >> 8;
    } else {
      // TODO ensure relative ofset is less in a Byte Range
      state.ROMBuffer[revisit.itemOffset++] = revisit.symbolOp.bytes[0];
      state.ROMBuffer[revisit.itemOffset++] =
        existingSymbol - revisit.itemOffset;
    }
  }
};

const putAdress = (adress: number, state: AssemblerState) => {
  state.ROMBuffer[state.offset++] = adress & 0xff;
  state.ROMBuffer[state.offset++] = adress >> 8;
};
const processFooter = (vectors: VectorTable, state: AssemblerState) => {
  state.offset = 0x7ffa;
  if (state.symbols[vectors.nmi.value] == undefined)
    throw new Error("Unresolved nmi");
  if (state.symbols[vectors.reset.value] == undefined)
    throw new Error("Unresolved reset");
  putAdress(state.symbols[vectors.nmi.value] + 0x8000, state);
  putAdress(state.symbols[vectors.reset.value] + 0x8000, state);
  putAdress(
    vectors.irq?.value
      ? state.symbols[vectors.irq?.value]
        ? state.symbols[vectors.nmi.value] + 0x8000
        : 0x0000
      : 0x0000,
    state
  );
};

const processChrRom = (chrrom: Buffer, state: AssemblerState) => {
  for (let byte of chrrom) {
    state.ROMBuffer[state.offset++] = byte;
  }
};

export const assemble = (
  ops: AssemblerOperation[],
  vectors: VectorTable,
  chrrom?: any
) => {
  const state: AssemblerState = {
    offset: 0x0000,
    symbols: {},
    positionalSymbols: [],
    revisit: [],
    ROMBuffer: new Uint8Array(0xa000),
  };

  for (let op of ops) {
    processOp(op, state);
  }

  for (let revisit of state.revisit) {
    processRevisit(revisit, state);
  }

  processFooter(vectors, state);

  processChrRom(chrrom, state);

  processHeader(state);

  return {
    buffer: state.ROMBuffer,
    mesenBuffer: format(state.symbols, getRamSymbolTable()),
    finalOffset: state.offset,
  };
};
