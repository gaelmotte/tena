import { LDA, CLC, ADC, STA, SEC, SBC, LSR, ROR, ORA, TAX, AND } from "@core/ops";
import { allocate, tmp } from "@core/ram";
import { CompoundOp, Immediate, Index } from "@core/types";
import { hi, i, inline, lo, u8, zp } from "@core/utils";

const allocatedFixedPoints: {
  "12_4": number[];
  "4_4": number[];
} = {
  "12_4": [],
  "4_4": [],
};

export const twoComplement = (value:number) =>{
  return ~value +1;
}

/**
 * only works in positive values
 */
export type FixedPoint12_4 = {
  adress: number;
  add4_4: (adress?: number| Immediate) => CompoundOp;
  sub4_4: (adress?: number| Immediate) => CompoundOp;
  /** low byte of integer value*/
  lo: CompoundOp;
  /** high byte of integer value*/
  hi: CompoundOp;
  /** integer value*/
  set: (value:number) => CompoundOp
};

/**
 * can be negative values
 */
export type FixedPoint4_4 = {
  adress: number;
  add4_4: (adress?: number | Immediate) => CompoundOp;
  sub4_4: (adress?: number | Immediate) => CompoundOp;
  int: CompoundOp;
  set: (value?:number) => CompoundOp
};



//https://github.com/NesHacker/PlatformerMovement/blob/main/src/state/Player.s
export const fixedPoint12_4 = (name: string): FixedPoint12_4 => {
  const adress = allocate(name, 2);
  allocatedFixedPoints["12_4"].push(adress);

  return {
    adress,
    add4_4: (value?: number | Immediate): CompoundOp => {
      if (typeof value === "number") {
        if (!allocatedFixedPoints["4_4"].includes(value))
          throw new Error("can only add FixedPoint4_4");

        return inline([
            LDA(zp(value)),
            CLC(),
            ADC(zp(adress)),
            STA(zp(adress)),
            LDA(u8(0)),
            ADC(zp(adress+1)),
            STA(zp(adress+1)),
        ]);
      }
      // a contains a reference to the 4_4
      if(value == undefined){
        return inline([
          STA(zp(tmp)),
          LDA(u8(0)),
          TAX(),
          LDA(i(tmp),Index.PREX),
          CLC(),
          ADC(zp(adress)),
          STA(zp(adress)),
          LDA(u8(0)),
          ADC(zp(adress+1)),
          STA(zp(adress+1)),
        ]);
      }
      // value is the number itsef
      return inline([
            LDA(value),
            CLC(),
            ADC(zp(adress)),
            STA(zp(adress)),
            LDA(u8(0)),
            ADC(zp(adress+1)),
            STA(zp(adress+1)),
        ]);
    },
    sub4_4: (value?: number | Immediate): CompoundOp => {
      if (typeof value === "number") {
        if (!allocatedFixedPoints["4_4"].includes(value))
          throw new Error("can only sub FixedPoint4_4");

        return inline([
            LDA(u8(0)),
            SEC(),
            SBC(u8(value)),
            STA(zp(tmp)),
            LDA(zp(adress)),
            SEC(),
            SBC(zp(tmp)),
            STA(zp(adress)),
            LDA(zp(adress+1)),
            SBC(u8(0)),
            STA(zp(adress+1)),
        ]);
      }
      // a contains a reference to the 4_4
      if(value == undefined){
        return inline([
          STA(zp(tmp)),
          LDA(u8(0)),
          TAX(),
          LDA(u8(0)),
          SEC(),
          SBC(i(tmp),Index.PREX),
          STA(zp(tmp)),
          LDA(zp(adress)),
          SEC(),
          SBC(zp(tmp)),
          STA(zp(adress)),
          LDA(zp(adress+1)),
          SBC(u8(0)),
          STA(zp(adress+1)),
        ]);
      }
      // value is the number itsef
      return inline([
            LDA(u8(0)),
            SEC(),
            SBC(value),
            STA(zp(tmp)),
            LDA(zp(adress)),
            SEC(),
            SBC(zp(tmp)),
            STA(zp(adress)),
            LDA(zp(adress+1)),
            SBC(u8(0)),
            STA(zp(adress+1)),
        ]);
    },
    lo : inline([
        LDA(zp(adress)),
        STA(zp(tmp)),
        LDA(zp(adress+1)),
        STA(zp(tmp+1)),
        LSR(zp(tmp+1)),
        ROR(zp(tmp)),
        LSR(zp(tmp+1)),
        ROR(zp(tmp)),
        LSR(zp(tmp+1)),
        ROR(zp(tmp)),
        LSR(zp(tmp+1)),
        ROR(zp(tmp)),
        LDA(zp(tmp))
    ]),
    hi : inline([
        LDA(zp(adress+1)),
        LSR(),
        LSR(),
        LSR(),
        LSR(),
        AND(u8(0x0f))
    ]),
    set: (value: number) => inline([
        LDA(u8(lo(value<<4))),
        STA(zp(adress)),
        LDA(u8(hi(value<<4))),
        STA(zp(adress+1))
    ])
  };
};

export const fixedPoint4_4 = (name: string): FixedPoint4_4 => {
  const adress = allocate(name, 1);
  allocatedFixedPoints["4_4"].push(adress);

  return {
    adress,
    int: inline([
        LDA(zp(adress)),
        LSR(),
        LSR(),
        LSR(),
        LSR(),
    ]),
    add4_4: (value?: number | Immediate): CompoundOp => {
      if (typeof value === "number") {
        if (!allocatedFixedPoints["4_4"].includes(value))
          throw new Error("can only add FixedPoint4_4");

        return inline([
            LDA(zp(value)),
            CLC(),
            ADC(zp(adress)),
            STA(zp(adress)),
        ]);
      }
      // a contains a reference to the 4_4
      if(value == undefined){
        return inline([
          STA(zp(tmp)),
          LDA(u8(0)),
          TAX(),
          LDA(i(tmp),Index.PREX),
          CLC(),
          ADC(zp(adress)),
          STA(zp(adress)),
        ]);
      }
      // value is the number itsef
      return inline([
            LDA(value),
            CLC(),
            ADC(zp(adress)),
            STA(zp(adress)),
        ]);
    },
    sub4_4: (value?: number | Immediate): CompoundOp => {
      if (typeof value === "number") {
        if (!allocatedFixedPoints["4_4"].includes(value))
          throw new Error("can only sub FixedPoint4_4");

        return inline([
            LDA(u8(0)),
            SEC(),
            SBC(u8(value)),
            STA(zp(tmp)),
            LDA(zp(adress)),
            SEC(),
            SBC(zp(tmp)),
            STA(zp(adress)),
        ]);
      }
      // a contains a reference to the 4_4
      if(value == undefined){
        return inline([
          STA(zp(tmp)),
          LDA(u8(0)),
          TAX(),
          LDA(u8(0)),
          SEC(),
          SBC(i(tmp),Index.PREX),
          STA(zp(tmp)),
          LDA(zp(adress)),
          SEC(),
          SBC(zp(tmp)),
          STA(zp(adress)),
        ]);
      }
      // value is the number itsef
      return inline([
            LDA(u8(0)),
            SEC(),
            SBC(value),
            STA(zp(tmp)),
            LDA(zp(adress)),
            SEC(),
            SBC(zp(tmp)),
            STA(zp(adress))
        ]);
    },
    set: (value?: number) => value != undefined ? inline([
        LDA(u8(lo(value))),
        STA(zp(adress))
    ]) : inline([
        STA(zp(adress))
    ])
  }
}

