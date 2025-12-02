import { VRAM_NAMETABLES } from "@core/hardware";
import {
  LDA,
  JSR,
  AND,
  BEQ,
  TAX,
  BNE,
  INC,
  LDX,
  DEX,
  INX,
  STX,
  EOR,
  STA,
  LSR,
  LDY,
  INY,
  STY,
} from "@core/ops";
import {
  setVramColRow,
  fullLine,
  setShadowScroll,
  bufferDrawColHeader,
  bufferDrawCell,
  draw,
  calcTmpAdress,
  drawBufferIndex,
  drawBuffer,
  tmpAdress,
} from "@core/ppu";
import {
  fixedPoint12_4,
  fixedPoint4_4,
  twoComplement,
} from "@core/std/fixedPoint";
import { a, fn, inline, label, u8, zp } from "@core/utils";
import { down, Buttons, pressed } from "./joypad";
import { allocate, tmp } from "@core/ram";
import { Index } from "@core/types";

export const GROUND_POS = 20;

const speed = fixedPoint4_4("speed");
const distance = fixedPoint12_4("distance");
const gameStarted = allocate("gameStarted", 1);

export const initGame = fn("initGame", ({}) => [
  // draw bg initially
  setVramColRow(0, GROUND_POS, VRAM_NAMETABLES.NAMETABLE_A),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),

  setVramColRow(0, GROUND_POS, VRAM_NAMETABLES.NAMETABLE_B),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),

  // LDA(u8(1)),
  // LDX(u8(4)),
  // label(),
  // DEX(),
  // JSR(drawCol.start),
  // BNE(label(-1)),

  // JSR(draw.start),
]);

const checkStartGame = fn("checkStartGame", ({ returnLabel }) => [
  LDA(zp(gameStarted)),
  BNE(returnLabel),

  LDA(zp(pressed)),
  AND(u8(Buttons.BUTTON_A)),
  BEQ(returnLabel),

  INC(zp(gameStarted)),
  // setup scrolling speed
  speed.set(0b0001_1000),
]);

export const updateGame = fn("updateGame", () => [
  JSR(checkStartGame.start),
  distance.add4_4(speed.adress),
]);

export const updateGameScroll = fn("updateGameScroll", () => [
  distance.hi,
  AND(u8(0b00000001)),
  TAX(),
  distance.lo,
  JSR(setShadowScroll.start),
]);

/**
 * a : nametable
 * x : col
 */
const drawCol = fn("drawCol", () => [
  STX(zp(tmp)),
  JSR(bufferDrawColHeader.start),

  LDX(u8(GROUND_POS)),
  LDA(u8(0)),
  label(),
  bufferDrawCell,
  DEX(),
  BNE(label(-1)),

  LDA(u8(1)),
  bufferDrawCell,

  LDA(u8(2)),
  bufferDrawCell,

  LDA(u8(3)),
  bufferDrawCell,

  LDX(u8(7)),
  LDA(u8(0)),
  label(),
  bufferDrawCell,
  DEX(),
  BNE(label(-1)),
  LDX(zp(tmp)),
]);

export const updateGamebackground = fn("updateGamebackground", () => [
  distance.hi,
  AND(u8(0b00000001)),
  EOR(u8(0b00000001)),
  STA(zp(tmp)),

  distance.lo,
  LSR(),
  LSR(),
  LSR(),
  TAX(),

  LDA(zp(tmp)),
  LDY(u8(GROUND_POS -3)),
  JSR(calcTmpAdress.start),
  LDY(zp(drawBufferIndex)),

  LDA(u8(4)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  // push flag = 1
  LDA(u8(1)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  // push adress
  LDA(zp(tmpAdress+1)),
  STA(a(drawBuffer), Index.Y),
  INY(),
  LDA(zp(tmpAdress)),
  STA(a(drawBuffer), Index.Y),
  INY(),

  LDA(u8(0x04)),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  
  STY(zp(drawBufferIndex)),

]);

export const gameFunctions = inline([
  initGame.block,
  updateGame.block,
  updateGameScroll.block,
  checkStartGame.block,
  drawCol.block,
  updateGamebackground.block,
]);
