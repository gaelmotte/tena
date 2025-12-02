import { AND, BCC, EOR, JSR, LDA, LSR, ROL, STA, TYA } from "@core/ops";
import { allocate } from "@core/ram";
import { a, fn, inline, label, u8, zp } from "@core/utils";

export enum Buttons {
    BUTTON_A      = 1 << 7,
    BUTTON_B      = 1 << 6,
    BUTTON_SELECT = 1 << 5,
    BUTTON_START  = 1 << 4,
    BUTTON_UP     = 1 << 3,
    BUTTON_DOWN   = 1 << 2,
    BUTTON_LEFT   = 1 << 1,
    BUTTON_RIGHT  = 1 << 0
}

export enum Joypads {
    JOYPAD1 = 0x4016,
    JOYPAD2 = 0x4017
}

export const down = allocate("downButtons", 1);
export const pressed = allocate("pressedButtons", 1);



//https://github.com/NesHacker/PlatformerMovement/blob/main/src/state/Joypad.s
export const readJoypad = fn("readJoypad", ({}) => [
    LDA(zp(down)),
    LSR(),
    ROL(zp(down)),
    LDA(u8(1)),
    STA(a(Joypads.JOYPAD1)),
    STA(zp(down)),
    LSR(),
    STA(a(Joypads.JOYPAD1)),

    label(),
    LDA(a(Joypads.JOYPAD1)),
    LSR(),
    ROL(zp(down)),
    BCC(label(-1)),

    TYA(),
    EOR(zp(down)),
    AND(zp(down)),
    STA(zp(pressed)),
    
]);
export const updatejoypad = fn("updatejoypad", ({})=>[
    JSR(readJoypad.start),
])