import { SymbolTable } from "./assembler";

export const formatRomLabels = (symbols: SymbolTable, offset: number = 0) => {
  return Object.entries(symbols)
    .map(([name, adress]) => `$${(adress + offset).toString(16)}#${name}#`)
    .join("\n");
};
