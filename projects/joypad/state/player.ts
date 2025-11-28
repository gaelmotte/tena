import { allocate } from "@core/ram";
import { a, fn, inline, label, u8, zp } from "@core/utils";
import { AND, BEQ, BNE, DEC, INC, LDA, STA } from "@core/ops";
import { Buttons, down } from "./joypad";
import { GROUND_POS } from "./game";
import { getOAMAdress, OAMSpriteProperties } from "@core/oam";

const playerY = allocate("playerY",1);

export const initPlayer = fn("initPlayer",({})=>[
    LDA(u8(GROUND_POS * 8)),
    STA(zp(playerY)),
])

export const updatePlayerMouvement = fn("updatePlayerMouvement",({}) =>[

    LDA(zp(down)),
    AND(u8(Buttons.BUTTON_DOWN)),
    BEQ(label(1)),
    INC(zp(playerY)),
    label(),

    LDA(zp(down)),
    AND(u8(Buttons.BUTTON_UP)),
    BEQ(label(1)),
    DEC(zp(playerY)),
    label(),

]);

export const updatePlayerSprite = fn("updatePlayerSprite", ()=>[
    LDA(zp(playerY)),
    STA(a(getOAMAdress(1,OAMSpriteProperties.POSITION_Y))),
])

export const playerFunctions = inline([initPlayer.block, updatePlayerMouvement.block, updatePlayerSprite.block]);