import * as fsSync from 'fs';
import { assemble } from "@core/assembler";
import { AssemblerOperation, Index } from "@core/types";
import { BIT, BNE, BPL, CLD, INX, JMP, LDA, LDX, RTI, SEI, STA, STX, TXA, TXS } from '@core/ops';
import { a, label, u8 } from '@core/utils';
import { AUDIO, PPU } from '@core/hardware';


// https://www.moria.us/blog/2018/03/nes-development
const program: AssemblerOperation[] = [
    label("nmi"),
    RTI(),
    label("reset"),
    SEI(),
    CLD(),
    LDX(u8(0XFF)),
    TXS(), // Initialize stack pointer
    INX(),
    STX(a(PPU.PPUCTRL)),
    STX(a(PPU.PPUMASK)),
    STX(a(AUDIO.APUSTATUS)),

    //PPU warmup, wait two frames, plus a third later.
    //http://forums.nesdev.com/viewtopic.php?f=2&t=3958

    label("waitPPUSTATUS1"),
    BIT(a(PPU.PPUSTATUS)),
    BPL(label("waitPPUSTATUS1")),

    label("waitPPUSTATUS2"),
    BIT(a(PPU.PPUSTATUS)),
    BPL(label("waitPPUSTATUS2")),

    TXA(),
    label("zeroRam"),

    STA(a(0x000), Index.X),
    STA(a(0x100), Index.X),
    STA(a(0x200), Index.X),
    STA(a(0x300), Index.X),
    STA(a(0x400), Index.X),
    STA(a(0x500), Index.X),
    STA(a(0x600), Index.X),
    STA(a(0x700), Index.X),
    INX(),
    BNE(label("zeroRam")),

    label("waitPPUSTATUS3"),
    BIT(a(PPU.PPUSTATUS)),
    BPL(label("waitPPUSTATUS3")),


    // send Audio PULSE
    LDA(u8(0x01)),
    STA(a(AUDIO.APUSTATUS)),

    LDA(u8(0x08)),
    STA(a(AUDIO.PULSE1_TIMERLO)),
    LDA(u8(0x02)),
    STA(a(AUDIO.PULSE1_TIMERHI)),
    LDA(u8(0xbf)),
    STA(a(AUDIO.PULSE1_VOLUME)),

    label("forever"),
    JMP(label("forever"))
    


];


const result = assemble(program, { nmi: label("nmi"), reset: label("reset") });
fsSync.writeFileSync('beep.nes', result.buffer);
fsSync.writeFileSync('beep.mlb', result.mesenBuffer);
