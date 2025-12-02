import { allocate } from "@core/ram";
import { a, fn, inline, label, u8, zp } from "@core/utils";
import { ADC, AND, BCC, BCS, BEQ, BMI, BNE, BPL, CLC, CMP, DEC, INC, JMP, JSR, LDA, LDY, RTS, STA, TYA } from "@core/ops";
import { Buttons, down, pressed } from "./joypad";
import { getOAMAdress, OAMSpriteProperties, setNeedOam } from "@core/oam";
import { fixedPoint12_4, fixedPoint4_4, twoComplement } from "@core/std/fixedPoint";

const GROUND_POS = 20;
const JUMP_INITIAL_VELOCITY = twoComplement(0b0100_000);
const MAX_FALL_SPEED = 0b0100_0000;
const SCREEN_GROUND_POS = GROUND_POS * 8;

enum State {
  RUNNING,
  AIRBONNE,
}

const playerState = allocate("playerState",1);

const playerY = fixedPoint12_4("playerY");
const playerYVelocity = fixedPoint4_4("playerYVelocity");
const playerSpriteY = allocate("playerSpriteY", 1);

const initPlayerY = fn("initPLayerY", () => [
  playerYVelocity.set(0b0000000),
  playerY.set(SCREEN_GROUND_POS),
  playerY.lo,
  STA(zp(playerSpriteY)),
])

const initPlayerSprites = fn("initPlayerSprites", () => [
  LDA(zp(playerSpriteY)),
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_Y))),
  LDA(u8(10)),
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_X))),
])

export const initPlayer = fn("initPlayer", ({}) => [
  JSR(initPlayerY.start),
  JSR(initPlayerSprites.start),

  LDA(u8(State.RUNNING)),
  STA(zp(playerState)),

]);

const updateJumpVelocity = fn("updateJumpVelocity", ()=>[
  LDY(u8(4)),
  playerYVelocity.int,
  CMP(u8(0x0E)),
  BPL(label("decelerate")),
  
  LDA(zp(down)),
  AND(u8(Buttons.BUTTON_A)),
  BEQ(label("decelerate")),

  LDY(u8(1)),

  label("decelerate"),
  TYA(),
  ADC(zp(playerYVelocity.adress)),
  BMI(label("storeVelocity")),

  // cap falling speed
  CMP(u8(MAX_FALL_SPEED)),
  BCC(label("storeVelocity")),
  LDA(u8(MAX_FALL_SPEED)),

  label("storeVelocity"),
  playerYVelocity.set()

])

const applyVelocityY = fn("applyVelocityY", ({returnLabel})=>[
  LDA(zp(playerYVelocity.adress)),
  BMI(label(1)),
  playerY.add4_4(playerYVelocity.adress),
  JMP(returnLabel),
  label(),
  playerY.sub4_4(playerYVelocity.adress),
])

const boundPositionY = fn("boundPositionY", ({returnLabel})=>[
  playerY.lo,
  STA(zp(playerSpriteY)),

  CMP(u8(SCREEN_GROUND_POS)),
  BCS(label(1)),

  JMP(returnLabel),

  label(),
  JSR(initPlayerY.start),
  LDA(u8(State.RUNNING)),
  STA(zp(playerState))
  

])

export const updatePlayerMouvement = fn("updatePlayerMouvement", ({}) => [
  // LDA(zp(down)),
  // AND(u8(Buttons.BUTTON_DOWN)),
  // BEQ(label(1)),
  // playerY.add4_4(u8(SPEED)),
  // label(),

  // LDA(zp(down)),
  // AND(u8(Buttons.BUTTON_UP)),
  // BEQ(label(1)),
  // playerY.sub4_4(u8(twoComplement(SPEED))),
  // label(),

  LDA(zp(playerState)),
  CMP(u8(State.AIRBONNE)),
  BEQ(label("airborne")),

  // check jump
  LDA(zp(pressed)),
  AND(u8(Buttons.BUTTON_A)),
  BNE(label("beginjump")),

  // not jumping
  playerYVelocity.set(0),
  RTS(),

  label("beginjump"),
  playerYVelocity.set(JUMP_INITIAL_VELOCITY),
  LDA(u8(State.AIRBONNE)),
  STA(zp(playerState)),
  RTS(),

  label("airborne"),
  JSR(updateJumpVelocity.start),
  JSR(applyVelocityY.start),
  JSR(boundPositionY.start),

]);



export const updatePlayerSprite = fn("updatePlayerSprite", () => [
  playerY.lo,
  STA(a(getOAMAdress(1, OAMSpriteProperties.POSITION_Y))),
  // set need dma
  setNeedOam,
]);

/**
 * A contains the obstacle
 */
export const isAboveObstacle = fn("isAboveObstacle", () => [
  // check if height is above obstacle
  LDA(u8((GROUND_POS - 4) * 8)),
  CMP(zp(playerSpriteY)),
])

