/*
NesPrgRom:003E:forever
NesInternalRam:0000-0001:counter
*/

import { SymbolTable } from "./assembler";
import { RamLabel } from "./ram";

export const format = (symbols: SymbolTable, ramSymbols: RamLabel[]) => {
  return (
    Object.entries(symbols)
      .map(([name, value]) => {
        return `NesPrgRom:${value.toString(16)}:${name}`;
      })
      .join("\n") +
    "\n" +
    ramSymbols
      .map((symbol) => {
        return `NesInternalRam:${symbol.value.toString(16)}${
          symbol.valueEnd ? "-" + symbol.valueEnd.toString(16) : ""
        }:${symbol.name}`;
      })
      .join("\n")
  );
};
