import { PPU, VRAM_NAMETABLES } from "./hardware";
import {
  ADC,
  AND,
  BCC,
  BCS,
  BEQ,
  BIT,
  BNE,
  BPL,
  CLC,
  CMP,
  DEX,
  DEY,
  INC,
  INY,
  JMP,
  JSR,
  LDA,
  LDX,
  LDY,
  ORA,
  STA,
  STX,
  STY,
  TXA,
  TYA,
} from "./ops";
import { allocate, tmp } from "./ram";
import { Index } from "./types";
import { a, fn, hi, inline, label, lo, u8, zp } from "./utils";

const shadowPPUCTRL = allocate("shadowPPUCTRL", 1);
const shadowPPUSCROLL = allocate("shadowPPUSCROLL", 2);
export const PPU_DRAW_BUFFER_PAGE = 3;
export const drawBuffer = allocate("drawBuffer", 256, PPU_DRAW_BUFFER_PAGE);
export const drawBufferIndex = allocate("drawBufferIndex", 1);
export const tmpAdress = allocate("tmpAdress", 2);

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

export const setVramIncrement = fn("setVramIncrement", ({ returnLabel }) => [
  CMP(u8(1)),
  BEQ(label(1)),

  LDA(u8(0b11111011)),
  AND(zp(shadowPPUCTRL)),
  STA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),
  JMP(returnLabel),

  label(),
  LDA(u8(0b0000000100)),
  ORA(zp(shadowPPUCTRL)),
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

export const setVramColRow = (
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
export const setShadowScroll = fn("setShadowScroll", () => [
  STA(zp(shadowPPUSCROLL)),
  LDA(u8(0)),
  STA(zp(shadowPPUSCROLL + 1)),

  LDA(zp(shadowPPUCTRL)),
  AND(u8(0b11111100)),
  STA(zp(tmp)),
  TXA(),
  ORA(zp(tmp)),

  STA(zp(shadowPPUCTRL)),
  // STA(a(PPU.PPUCTRL)),
]);

export const setScroll = fn("setScroll", () => [
  LDA(zp(shadowPPUCTRL)),
  STA(a(PPU.PPUCTRL)),

  BIT(a(PPU.PPUSTATUS)),
  LDA(zp(shadowPPUSCROLL)),
  STA(a(PPU.PPUSCROLL)),
  LDA(zp(shadowPPUSCROLL + 1)),
  STA(a(PPU.PPUSCROLL)),
]);

export const waitPPU = inline([label(), BIT(a(PPU.PPUSTATUS)), BPL(label(-1))]);

export const draw = fn("draw", ({ returnLabel }) => [
  LDY(u8(0)),
  LDA(a(drawBuffer)),
  BEQ(returnLabel),

  // reset the adress and data lines
  BIT(a(PPU.PPUSTATUS)),

  label("drawLoop"),
  // read length to x
  LDX(a(drawBuffer), Index.Y),
  BEQ(label("clearBuffer")),
  INY(),

  // set ppu adressing mode from ready byte
  LDA(a(drawBuffer), Index.Y),
  JSR(setVramIncrement.start),
  INY(),

  LDA(a(drawBuffer), Index.Y),
  STA(a(PPU.PPUADDR)),
  INY(),
  LDA(a(drawBuffer), Index.Y),
  STA(a(PPU.PPUADDR)),
  INY(),

  // for X
  label(),
  LDA(a(drawBuffer), Index.Y),
  STA(a(PPU.PPUDATA)),
  INY(),
  DEX(),
  BNE(label(-1)),

  JMP(label("drawLoop")),

  label("clearBuffer"),
  LDA(u8(0)),
  LDY(zp(drawBufferIndex)),
  label(),
  DEY(),
  STA(a(drawBuffer), Index.Y),
  BNE(label(-1)),
  STA(zp(drawBufferIndex)),
]);

/**
 * a : nametable
 * y : row
 * x : col
 */
export const calcTmpAdress = fn("calcTmpAdress", ({ returnLabel }) => [
  // nametable
  CMP(u8(1)),
  BEQ(label(1)),
  LDA(u8(hi(VRAM_NAMETABLES.NAMETABLE_A))),
  JMP(label(2)),
  label(),
  LDA(u8(hi(VRAM_NAMETABLES.NAMETABLE_B))),
  label(),
  STA(zp(tmpAdress + 1)),

  // col
  STX(zp(tmpAdress)),

  // row
  TYA(),
  label(),
  BEQ(returnLabel),

  LDA(zp(tmpAdress)),
  CLC(),
  ADC(u8(0x20)),
  STA(zp(tmpAdress)),

  BCC(label(1)),
  INC(zp(tmpAdress + 1)),
  label(),
  DEY(),
  JMP(label(-2)),
]);

/**
 * a : nametable
 * x : col
 * dont forget to push bytes to draw with bufferDrawCell
 * clobbers y
 */
export const bufferDrawColHeader = fn("bufferDrawColHeader", () => [
  JSR(calcTmpAdress.start),
  LDY(zp(drawBufferIndex)),

  // push length = 30
  LDA(u8(30)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  // push flag = 1
  LDA(u8(1)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  // push adress
  LDA(zp(tmpAdress + 1)),
  STA(a(drawBuffer), Index.Y),
  INY(),
  LDA(zp(tmpAdress)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  STY(zp(drawBufferIndex)),
]);

/**
 * a : pattern
 * clobbers y
 */
export const bufferDrawCell = inline([
  LDY(zp(drawBufferIndex)),
  // push pattern to draw buffer
  STA(a(drawBuffer), Index.Y),
  INY(),
  STY(zp(drawBufferIndex)),
]);
