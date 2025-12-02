import { OAM_SHADOW, setNeedOam } from "@core/oam";
import { JSR, INC, BNE, JMP, LDA, LDX, LDY } from "@core/ops";
import { waitFrame } from "@core/std/nmi";
import { a, fn, inline, label, u8, zp } from "@core/utils";
import { updatejoypad } from "./state/joypad";
import { updatePlayerMouvement, updatePlayerSprite } from "./state/player";
import { updateGame, updateGamebackground, updateGameScroll } from "./state/game";


export const main = fn("main",({start})=>[
  // wait for end of nmi
  JSR(waitFrame.start),

  JSR(updatejoypad.start),

  JSR(updatePlayerMouvement.start),
  JSR(updatePlayerSprite.start),

  JSR(updateGame.start),
  JSR(updateGamebackground.start),
  JSR(updateGameScroll.start),



  JMP(start),
])

export const mainFunctions = inline([main.block]);