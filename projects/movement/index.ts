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
import { joypadFunctions } from "./state/joypad";
import { initPlayer, playerFunctions } from "./state/player";
import { gameFunctions, initGame } from "./state/game";

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

  JSR(initGame.start),
  JSR(initPlayer.start),

  JSR(resetScroll.start),

  // enable bg rendering and NMI
  JSR(enableNMI.start),
  LDX(u8(0b00011110)), // enable bg and sprite rendering, enable 1st column
  STX(a(PPU.PPUMASK)),

  JSR(main.start),

  mainFunctions,
  nmiFunctions,
  ppuFunctions,
  joypadFunctions,
  playerFunctions,
  gameFunctions,
];

const result = assemble(
  program,
  { nmi: nmiLabel, reset: label("reset") },
  chrrom
);
fsSync.writeFileSync("movement.nes", result.buffer);
fsSync.writeFileSync("movement.mlb", result.mesenBuffer);
