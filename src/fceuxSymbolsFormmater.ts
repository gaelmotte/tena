import { SymbolTable } from "./assembler";

export const format = (symbols: SymbolTable) => {
  return Object.entries(symbols)
    .map(([name, adress]) => `$${(adress + 0x8000).toString(16)}#${name}#`)
    .join("\n");
};
