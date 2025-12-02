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
  ROR,
  ASL,
  ADC,
  BCC,
  JMP,
  BRK,
  CMP,
  BPL,
  BMI,
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
import { AandXtoObstacle, clearObstacle, drawObstacle, findObstacle } from "./obstacles";
import { isAboveObstacle } from "./player";

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
]);
/**
 * puts 
 * a = nametable
 * x = col
 */
export const distanceToAandX = fn("distanceToAandX",()=>[
  distance.lo,
  LSR(),
  LSR(),
  LSR(),
  TAX(),

  distance.hi,
  AND(u8(0b00000001)),
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

const checkGameover = fn("checkGameover", ({returnLabel}) => [
  JSR(distanceToAandX.start),
  // increment x to match player x pos
  INX(),
  INX(),
  JSR(AandXtoObstacle.start),
  JSR(findObstacle.start),
  BCC(returnLabel),

  JSR(isAboveObstacle.start),
  BPL(returnLabel),

  JMP(label("reset"))
  
]);

export const updateGame = fn("updateGame", () => [
  JSR(checkStartGame.start),
  distance.add4_4(speed.adress),
  JSR(checkGameover.start),
]);

export const updateGameScroll = fn("updateGameScroll", () => [
  distance.hi,
  AND(u8(0b00000001)),
  TAX(),
  distance.lo,
  JSR(setShadowScroll.start),
]);


export const updateGamebackground = fn("updateGamebackground", () => [

  JSR(distanceToAandX.start),
  // xor the last bit of a to go to the other nametable
  EOR(u8(1)),

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

  JSR(distanceToAandX.start),
  // xor the last bit of a to go to the other nametable
  EOR(u8(1)),
  JSR(AandXtoObstacle.start),
  JSR(findObstacle.start),
  BCC(label(1)),
  JSR(drawObstacle.start),
  JMP(label(2)),
  label(),
  JSR(clearObstacle.start),
  label(),
  STY(zp(drawBufferIndex)),

]);
