import { VRAM_NAMETABLES } from "@core/hardware";
import { LDA, JSR } from "@core/ops";
import { vramColRow, fullLine } from "@core/ppu";
import { fn, inline, u8 } from "@core/utils";

export const GROUND_POS = 10; 

export const initGame = fn("initGame", ({})=>[
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
]);

export const gameFunctions = inline([initGame.block]);