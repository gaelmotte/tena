import { allocate } from "@core/ram";
import { a, fn, inline, label, u8, zp } from "@core/utils";
import { ADC, AND, BEQ, BNE, CLC, DEC, INC, LDA, STA } from "@core/ops";
import { Buttons, down } from "./joypad";
import { GROUND_POS } from "./game";
import { getOAMAdress, OAMSpriteProperties } from "@core/oam";
import { fixedPoint12_4 } from "@core/std/fixedPoint";

const SPEED = 0b0001_1000;
const twoComplement = (value:number) =>{
  return ~value +1;
}
const {
  adress: playerY,
  add4_4: addPlayerY,
  sub4_4: subPlayerY,
  lo: loPlayerY,
  set: setPlayerY
} = fixedPoint12_4("playerY");

export const initPlayer = fn("initPlayer", ({}) => [
  setPlayerY(GROUND_POS * 8),
  loPlayerY,
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_Y))),
  LDA(u8(10)),
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_X))),
]);

export const updatePlayerMouvement = fn("updatePlayerMouvement", ({}) => [
  LDA(zp(down)),
  AND(u8(Buttons.BUTTON_DOWN)),
  BEQ(label(1)),
  addPlayerY(u8(SPEED)),
  label(),

  LDA(zp(down)),
  AND(u8(Buttons.BUTTON_UP)),
  BEQ(label(1)),
  subPlayerY(u8(twoComplement(SPEED))),
  label(),
]);

export const updatePlayerSprite = fn("updatePlayerSprite", () => [
  loPlayerY,
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_Y))),
]);

export const playerFunctions = inline([
  initPlayer.block,
  updatePlayerMouvement.block,
  updatePlayerSprite.block,
]);
