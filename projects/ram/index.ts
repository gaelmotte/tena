import * as fsSync from "fs";
import { assemble } from "@core/assembler";
import { AssemblerOperation, Index } from "@core/types";
import {
  BEQ,
  BIT,
  BNE,
  BPL,
  CLD,
  INC,
  INX,
  JMP,
  LDA,
  LDX,
  RTI,
  SEI,
  STA,
  STX,
  TXA,
  TXS,
} from "@core/ops";
import { a, label, u8, zp } from "@core/utils";
import { AUDIO, PPU } from "@core/hardware";
import { allocate, resetRam } from "@core/ram";

const COUNTER = allocate("counter", 2);

const program: AssemblerOperation[] = [
  label("nmi"),
  RTI(),
  label("reset"),
  SEI(),
  CLD(),
  LDX(u8(0xff)),
  TXS(), // Initialize stack pointer
  INX(),
  STX(a(PPU.PPUCTRL)),
  STX(a(PPU.PPUMASK)),
  STX(a(AUDIO.APUSTATUS)),

  //PPU warmup, wait two frames, plus a third later.
  //http://forums.nesdev.com/viewtopic.php?f=2&t=3958

  label("waitPPUSTATUS1"),
  BIT(a(PPU.PPUSTATUS)),
  BPL(label("waitPPUSTATUS1")),

  label("waitPPUSTATUS2"),
  BIT(a(PPU.PPUSTATUS)),
  BPL(label("waitPPUSTATUS2")),

  resetRam,

  label("waitPPUSTATUS3"),
  BIT(a(PPU.PPUSTATUS)),
  BPL(label("waitPPUSTATUS3")),

  label("forever"),
  INC(zp(COUNTER)),
  BNE(label("noCounter+1")),
  INC(zp(COUNTER + 1)),
  label("noCounter+1"),
  JMP(label("forever")),
];

const result = assemble(program, { nmi: label("nmi"), reset: label("reset") });
fsSync.writeFileSync("ram.nes", result.buffer);
fsSync.writeFileSync("ram.mlb", result.mesenBuffer);
