import { BEQ, BNE, INC, LDA } from "@core/ops";
import { allocate } from "@core/ram";
import { a, fn, inline, label } from "@core/utils";

export const SLEEPING = allocate("sleeping",1);

export const waitFrame = fn("waitFrame",()=>[
    INC(a(SLEEPING)),
    label(),
    LDA(a(SLEEPING)),
    BNE(label(-1)),
])