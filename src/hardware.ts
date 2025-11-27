export enum PPU {
    PPUCTRL         = 0x2000,
    PPUMASK         = 0x2001,
    PPUSTATUS       = 0x2002,
    OAMADDR         = 0x2003,
    OAMDATA         = 0x2004,
    PPUSCROLL       = 0x2005,
    PPUADDR         = 0x2006,
    PPUDATA         = 0x2007
}

export enum VRAM_NAMETABLES{
    NAMETABLE_A = 0x2000,
    NAMETABLE_B = 0x2400,
    NAMETABLE_C = 0x2800,
    NAMETABLE_D = 0x2c00
}

export enum VRAM_ATTRIBUTES{
    ATTR_A      = 0x23c0,
    ATTR_B      = 0x27c0,
    ATTR_C      = 0x2bc0,
    ATTR_D      = 0x2fc0,
    PALETTE     = 0x3f00
}

export enum IO {
    JOYPAD1         = 0x4016,
    JOYPAD2         = 0x4017,
    OAMDMA          = 0x4014
}

export enum AUDIO {
    PULSE1_VOLUME   = 0x4000,
    PULSE1_SWEEP    = 0x4001,
    PULSE1_TIMERLO  = 0x4002,
    PULSE1_TIMERHI  = 0x4003,
    APUSTATUS       = 0x4015, 
}
