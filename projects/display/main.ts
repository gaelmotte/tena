import { OAM_SHADOW, setNeedOam } from "@core/oam";
import { JSR, INC, BNE, JMP, LDA, LDX, LDY } from "@core/ops";
import { incScrolX } from "@core/ppu";
import { allocate } from "@core/ram";
import { waitFrame } from "@core/std/nmi";
import { a, fn, inline, label, u8, zp } from "@core/utils";

const COUNTER = allocate("counter", 2);

export const main = fn("main",({start})=>[
  // wait for end of vblank
  JSR(waitFrame.start),

  INC(zp(COUNTER)),
  BNE(label("noCounterp1")),
  INC(zp(COUNTER + 1)),

  // move first sprite down
  INC(a(OAM_SHADOW)),
  // set need dma
  setNeedOam,

  // set x scroll
  LDA(u8(20)),
  JSR(incScrolX.start),
  

  label("noCounterp1"),
  JMP(start),
])

export const mainFunctions = inline([main.block]);