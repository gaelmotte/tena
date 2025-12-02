/**
 * losely based on https://www.nesdev.org/wiki/The_frame_and_NMIs
 */
import { dma, OAM_NEED } from "@core/oam";
import { PHP, INC, BNE, PLP, RTI, PHA, TXA, TYA, PLA, LDA, BEQ, STA, JSR } from "@core/ops";
import { allocate } from "@core/ram";
import { a, inline, label, u8, zp } from "@core/utils";
import { SLEEPING } from "@core/std/nmi";
import { twoByteCounterZp } from "@core/std/counters";
import { draw, setScroll } from "@core/ppu";

const {adress:FRAME_COUNTER, increment: incFrameCounter} = twoByteCounterZp("frameCounter")

export const nmiLabel = label("nmi");

export const nmi = inline([
  nmiLabel,
  PHP(),
  PHA(),
  TXA(),
  PHA(),
  TYA(),
  PHA(),

  incFrameCounter,

  LDA(a(OAM_NEED)),
  BEQ(label("NoDma")),
  dma,
  label("NoDma"),

  JSR(draw.start),
  JSR(setScroll.start),

  LDA(u8(0)),
  STA(a(SLEEPING)),

  PLA(),
  TYA(),
  PLA(),
  TXA(),
  PLA(),
  PLP(),
  RTI(),
])