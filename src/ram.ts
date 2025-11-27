import { SymbolTable } from "./assembler";
import { BNE, INX, LDA, LDX, STA } from "./ops";
import { Index } from "./types";
import { a, inline, label, u8 } from "./utils";

export type RamLabel = {
  name: string;
  value: number;
  valueEnd?: number;
};

type Page = {
  offset: number;
  allocatedLabels: RamLabel[];
};

const allocatedLabels: string[] = [];
const allocatedPages: Page[] = [
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
  {
    offset: 0,
    allocatedLabels: [],
  },
];

export const allocate = (label: string, size: number, page: number = 0) => {
  // ensure unique label
  if (allocatedLabels.includes(label)) {
    throw new Error("symbol already allocated");
  }

  // ensure page allocatable
  if (page >= allocatedPages.length) {
    throw new Error("Ram overflow, cannot allocate");
  }

  // ensure no overflow
  if (256 < allocatedPages[page].offset + size) {
    throw new Error("Page overflow, cannot allocate");
  }

  const ramLabel: RamLabel = {
    name: label,
    value: page * 0x100 + allocatedPages[page].offset,
    valueEnd: size === 1 ? undefined : page * 0x100 + allocatedPages[page].offset + size -1
  };
  allocatedPages[page].offset += size;
  allocatedPages[page].allocatedLabels.push(ramLabel);
  allocatedLabels.push(label);

  return ramLabel.value;
};

export const getRamSymbolTable = () => {
  const table: RamLabel[] = [];

  allocatedPages.forEach((page) =>
    page.allocatedLabels.forEach((label) => (table.push(label)))
  );

  return table;
};

export const resetRam = inline([
    LDA(u8(0)),
    LDX(u8(0)),
    label("zeroRam"),
    
    STA(a(0x000), Index.X),
    STA(a(0x100), Index.X),
    STA(a(0x200), Index.X),
    STA(a(0x300), Index.X),
    STA(a(0x400), Index.X),
    STA(a(0x500), Index.X),
    STA(a(0x600), Index.X),
    STA(a(0x700), Index.X),
    INX(),
    BNE(label("zeroRam")),
])