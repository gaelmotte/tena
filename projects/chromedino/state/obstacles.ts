import { ADC, ASL, BEQ, BNE, BPL, CLC, CMP, DEX, DEY, INC, INY, LDA, LDX, LDY, RTS, SEC, STA, TXA } from "@core/ops";
import { drawBuffer } from "@core/ppu";
import { allocate, tmp } from "@core/ram";
import { Index } from "@core/types";
import { a, fn, label, u8, zp } from "@core/utils";

const OBSTACLES_COUNT = 4

/**
 * MSB : nametable
 * 7-6-5-4-3 : col
 * other props to come
 */
const obstacles = allocate("obstacles", OBSTACLES_COUNT);

export const initObstacles = fn("initObstacles", () => [
  LDA(u8(1 << 7)),
  LDY(u8(OBSTACLES_COUNT - 1)),
  label(),
  CLC(),
  ADC(u8(0b00011100)), // evry 7 cols
  STA(a(obstacles), Index.Y),
  DEY(),
  BPL(label(-1)),
]);

export const drawObstacle = fn("drawObstacle", () => [
  LDA(u8(0x04)),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
]);

export const clearObstacle = fn("clearObstacle", () => [
  LDA(u8(0x00)),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  STA(a(drawBuffer), Index.Y),
  INY(),
  LDA(u8(1)),
  STA(a(drawBuffer), Index.Y),
  INY(),
]);

/**
 * a : obstacle position at wich to check
 */
export const findObstacle = fn("findObstacle", ()=> [
  LDX(u8(OBSTACLES_COUNT - 1)),
  label(),
  CMP(zp(obstacles), Index.X),
  BEQ(label(1)),
  DEX(),
  BPL(label(-1)),
  CLC(),
  RTS(),

  label(),
  TXA(),
  SEC(),
]);

export const AandXtoObstacle = fn("AandXtoObstacle", () => [
  ASL(),
  ASL(),
  ASL(),
  ASL(),
  ASL(),
  ASL(),
  ASL(),
  STA(zp(tmp)),
  TXA(),
  ASL(),
  ASL(),
  CLC(),
  ADC(zp(tmp))
])

export const updateObstacles = fn("updateObstacles", () => []);
