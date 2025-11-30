import { PPU, VRAM_NAMETABLES } from "./hardware";
import {
  AND,
  BCC,
  BIT,
  BNE,
  BPL,
  DEX,
  JSR,
  LDA,
  LDX,
  ORA,
  STA,
  STX,
  STY,
  TXA,
} from "./ops";
import { allocate, tmp } from "./ram";
import { a, fn, hi, inline, label, lo, u8, zp } from "./utils";

const shadowPPUCTRL = allocate("shadowPPUCTRL", 1);

export const enableNMI = fn("enableNMI", () => [
  LDA(u8(0b10000000)),
  ORA(zp(shadowPPUCTRL)),
  STA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),
]);

export const disableNMI = fn("disableNMI", () => [
  LDA(u8(0b01111111)),
  AND(zp(shadowPPUCTRL)),
  STA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),
]);

const fillLine = fn("fillLine", ({ start }) => [
  STA(a(PPU.PPUDATA)),
  DEX(),
  BNE(start),
]);

export const fullLine = fn("fullLine", () => [
  LDX(u8(32)),
  JSR(fillLine.start),
]);

export const vramReset = inline([
  BIT(a(PPU.PPUSTATUS)),
  LDA(u8(0)),
  STA(a(PPU.PPUADDR)),
  STA(a(PPU.PPUADDR)),
]);

const vramAdress = (adress: number) =>
  inline([
    BIT(a(PPU.PPUSTATUS)),
    LDA(u8(hi(adress))),
    STA(a(PPU.PPUADDR)),
    LDA(u8(lo(adress))),
    STA(a(PPU.PPUADDR)),
  ]);

export const vramColRow = (
  col: number,
  row: number,
  nametable: VRAM_NAMETABLES
) => inline([vramAdress(nametable + row * 0x20 + col)]);

export const resetScroll = fn("resetScroll", () => [
  LDA(u8(0)),
  STA(a(PPU.PPUSCROLL)),
  STA(a(PPU.PPUSCROLL)),
  LDA(u8(0b11111100)),
  AND(zp(shadowPPUCTRL)),
  STA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),
]);

/**
 * a : ppuscroll
 * x : nametable
 */
export const setScroll = fn("setScroll", () => [
  STA(a(PPU.PPUSCROLL)),
  LDA(u8(0)),
  STA(a(PPU.PPUSCROLL)),

  LDA(zp(shadowPPUCTRL)),
  AND(u8(0b11111100)),
  STA(zp(tmp)),
  TXA(),
  ORA(zp(tmp)),

  STA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),
]);

/**
 * a : incrmeent by that much
 */
// export const incScrolX = fn("incScrolX", () => [
//   // increment thee scroll x
//   addScrollX,

//   // reflect upper bit in in shadowppuctlr
//   LDA(zp(shadowPPUCTRL)),
//   AND(u8(0b11111100)),
//   STA(zp(tmp)),

//   LDA(u8(0b0000001)),
//   AND(zp(scrollX + 1)),
//   ORA(zp(tmp)),

//   STA(zp(shadowPPUCTRL)),
//   STA(a(PPU.PPUCTRL)),
//   label(),

//   LDA(zp(scrollX)),
//   STA(a(PPU.PPUSCROLL)),
//   LDA(u8(0)),
//   STA(a(PPU.PPUSCROLL)),
// ]);

export const waitPPU = inline([label(), BIT(a(PPU.PPUSTATUS)), BPL(label(-1))]);

export const ppuFunctions = inline([
  fillLine.block,
  fullLine.block,
  resetScroll.block,
  setScroll.block,
  enableNMI.block,
  disableNMI.block,
]);
