import * as fsSync from 'fs';
import { assemble } from "@core/assembler";
import { AssemblerOperation } from "@core/types";
import { BRK, JMP, LDA, RTI, SEI } from '@core/ops';
import { label, u8 } from '@core/utils';


const program: AssemblerOperation[] = [
    label("nmi"),
    RTI(),
    label("reset"),
    SEI(),
    LDA(u8(42)),
    label("forever"),
    BRK()
    // JMP(label("forever")),
];


const result = assemble(program);
fsSync.writeFileSync('beep.nes', result.buffer);