import * as path from "path";
import * as fsSync from "fs";
import { assemble } from "@core/assembler";
import { AssemblerOperation } from "@core/types";
import {
  CLD,
  INX,
  JSR,
  LDA,
  LDX,
  SEI,
  STX,
  TXS,
} from "@core/ops";
import { a, label, u8 } from "@core/utils";
import { AUDIO, PPU, VRAM_NAMETABLES } from "@core/hardware";
import { resetRam } from "@core/ram";
import { nmi, nmiLabel } from "./nmi";
import { nmiFunctions } from "@core/std/nmi";
import { main, mainFunctions } from "./main";
import { enableNMI, fullLine, ppuFunctions, resetScroll, vramColRow, waitPPU } from "@core/ppu";

const basePath = path.join(__dirname, "bin");
const chrrom = fsSync.readFileSync(path.join(basePath, "CHR-ROM.bin"));

const program: AssemblerOperation[] = [
  nmi,
  label("reset"),
  SEI(),
  CLD(),
  LDX(u8(0xff)),
  TXS(), // Initialize stack pointer
  INX(),
  // disable everything
  STX(a(PPU.PPUCTRL)),
  STX(a(PPU.PPUMASK)),
  STX(a(AUDIO.APUSTATUS)),

  //PPU warmup, wait two frames, plus a third later.
  //http://forums.nesdev.com/viewtopic.php?f=2&t=3958
  waitPPU,
  waitPPU,
  resetRam,
  waitPPU,

  // draw bg initially
  vramColRow(0, 10, VRAM_NAMETABLES.NAMETABLE_A),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),
  
  vramColRow(0, 10, VRAM_NAMETABLES.NAMETABLE_B),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),

  resetScroll,

  // enable bg rendering and NMI
  JSR(enableNMI.start),
  LDX(u8(0b00011110)), // enable bg and sprite rendering, enable 1st column
  STX(a(PPU.PPUMASK)),

  JSR(main.start),

  mainFunctions,
  nmiFunctions,
  ppuFunctions,
];

const result = assemble(
  program,
  { nmi: nmiLabel, reset: label("reset") },
  chrrom
);
fsSync.writeFileSync("display.nes", result.buffer);
fsSync.writeFileSync("display.mlb", result.mesenBuffer);
