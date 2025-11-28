import { IO, PPU } from "./hardware";
import { INC, LDA, STA } from "./ops";
import { allocate } from "./ram";
import { a, inline, u8, zp } from "./utils";

export const OAM_SHADOW_PAGE = 2;
export const OAM_SHADOW = allocate("shadowOMA", 256, OAM_SHADOW_PAGE);
export const OAM_NEED = allocate("needOAM",1);

export enum OAMSpriteProperties {
    POSITION_Y,
    TILE_INDEX,
    ATTRIBUTES,
    POSITION_X
}
export const getOAMAdress = (sprite: number, prop : OAMSpriteProperties) => OAM_SHADOW_PAGE * 0x0100 + sprite *4 + prop;

export const dma = inline([
    LDA(u8(0)),
    STA(a(PPU.OAMADDR)),
    LDA(u8(OAM_SHADOW_PAGE)),
    STA(a(IO.OAMDMA)),
])

export const setNeedOam = inline([
    INC(zp(OAM_NEED)),
])