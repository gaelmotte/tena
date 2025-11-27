import { INC, BNE, LDA, STA, CLC, ADC, BCC, SEC } from "@core/ops";
import { allocate } from "@core/ram";
import { a, inline, label, u8, zp } from "@core/utils";

export const twoByteCounterZp = (name: string) => {
  const adress = allocate(name, 2);
  return {
    adress,
    increment: inline([
      INC(zp(adress)),
      BNE(label(1)),
      INC(zp(adress + 1)),
      // SEC(), // reset the carry for use in another code
      label(),
    ]),
    reset: inline([LDA(u8(0)), STA(a(adress)), STA(a(adress + 1))]),
    add: inline([
      CLC(),
      ADC(zp(adress)),
      STA(zp(adress)),
      BCC(label(1)),
      INC(zp(adress + 1)),
      // SEC(), // reset the carry for use in another code
      label()
    ])
  };
};
