import { VRAM_NAMETABLES } from "@core/hardware";
import { LDA, JSR, AND, BEQ, TAX } from "@core/ops";
import { vramColRow, fullLine, setScroll } from "@core/ppu";
import { fixedPoint12_4, fixedPoint4_4, twoComplement } from "@core/std/fixedPoint";
import { fn, inline, label, u8, zp } from "@core/utils";
import { down, Buttons } from "./joypad";

export const GROUND_POS = 20;

const speed = fixedPoint4_4("speed");
const distance = fixedPoint12_4("distance");

export const initGame = fn("initGame", ({}) => [
  // draw bg initially
  vramColRow(0, GROUND_POS, VRAM_NAMETABLES.NAMETABLE_A),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),

  vramColRow(0, GROUND_POS, VRAM_NAMETABLES.NAMETABLE_B),
  LDA(u8(1)),
  JSR(fullLine.start),
  LDA(u8(2)),
  JSR(fullLine.start),
  LDA(u8(3)),
  JSR(fullLine.start),

  // setup scrolling speed
  speed.set(0b0001_1000),
]);

export const updateGame = fn("updateGame", () => [
  LDA(zp(down)),
  AND(u8(Buttons.BUTTON_RIGHT)),
  BEQ(label(1)),
  distance.add4_4(speed.adress),
  label(),

  LDA(zp(down)),
  AND(u8(Buttons.BUTTON_LEFT)),
  BEQ(label(1)),
  distance.sub4_4(u8(twoComplement(0b0001_1000))),
  label(),
]);

export const updateGameScroll = fn("updateScroll", () => [
  distance.hi,
  AND(u8(0b00000001)),
  TAX(),
  distance.lo,
  JSR(setScroll.start),
])

export const gameFunctions = inline([initGame.block, updateGame.block, updateGameScroll.block]);
