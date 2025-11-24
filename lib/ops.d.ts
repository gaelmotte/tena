import { OpDescription, Immediate, Absolute, ZeroPage, Indirect, SymbolOr, SymbolicLabel } from "./types";
/** Add with Carry MODE Immediate */
export declare function ADC(value: Immediate): OpDescription;
/** Add with Carry MODE ZeroPage */
export declare function ADC(value: SymbolOr<ZeroPage>): OpDescription;
/** Add with Carry MODE ZeroPage,X */
export declare function ADC(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Add with Carry MODE Absolute */
export declare function ADC(value: SymbolOr<Absolute>): OpDescription;
/** Add with Carry MODE Absolute,X */
export declare function ADC(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Add with Carry MODE Absolute,Y */
export declare function ADC(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Add with Carry MODE (Indirect,X) */
export declare function ADC(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Add with Carry MODE (Indirect),Y */
export declare function ADC(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Logical AND MODE Immediate */
export declare function AND(value: Immediate): OpDescription;
/** Logical AND MODE ZeroPage */
export declare function AND(value: SymbolOr<ZeroPage>): OpDescription;
/** Logical AND MODE ZeroPage,X */
export declare function AND(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Logical AND MODE Absolute */
export declare function AND(value: SymbolOr<Absolute>): OpDescription;
/** Logical AND MODE Absolute,X */
export declare function AND(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Logical AND MODE Absolute,Y */
export declare function AND(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Logical AND MODE (Indirect,X) */
export declare function AND(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Logical AND MODE (Indirect),Y */
export declare function AND(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Arithmetic Shift Left MODE Accumulator */
export declare function ASL(): OpDescription;
/** Arithmetic Shift Left MODE ZeroPage */
export declare function ASL(value: SymbolOr<ZeroPage>): OpDescription;
/** Arithmetic Shift Left MODE ZeroPage,X */
export declare function ASL(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Arithmetic Shift Left MODE Absolute */
export declare function ASL(value: SymbolOr<Absolute>): OpDescription;
/** Arithmetic Shift Left MODE Absolute,X */
export declare function ASL(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Branch if Carry Clear MODE Relative */
export declare function BCC(value: SymbolicLabel): OpDescription;
/** Branch if Carry Set MODE Relative */
export declare function BCS(value: SymbolicLabel): OpDescription;
/** Branch if Equal MODE Relative */
export declare function BEQ(value: SymbolicLabel): OpDescription;
/** Bit Test MODE ZeroPage */
export declare function BIT(value: SymbolOr<ZeroPage>): OpDescription;
/** Bit Test MODE Absolute */
export declare function BIT(value: SymbolOr<Absolute>): OpDescription;
/** Branch if Minus MODE Relative */
export declare function BMI(value: SymbolicLabel): OpDescription;
/** Branch if Not Equal MODE Relative */
export declare function BNE(value: SymbolicLabel): OpDescription;
/** Branch if Positive MODE Relative */
export declare function BPL(value: SymbolicLabel): OpDescription;
/** Force Interrupt MODE Implied */
export declare function BRK(): OpDescription;
/** Branch if Overflow Clear MODE Relative */
export declare function BVC(value: SymbolicLabel): OpDescription;
/** Branch if Overflow Set MODE Relative */
export declare function BVS(value: SymbolicLabel): OpDescription;
/** Clear Carry Flag MODE Implied */
export declare function CLC(): OpDescription;
/** Clear Decimal Mode MODE Implied */
export declare function CLD(): OpDescription;
/** Clear Interrupt Disable MODE Implied */
export declare function CLI(): OpDescription;
/** Clear Overflow Flag MODE Implied */
export declare function CLV(): OpDescription;
/** Compare MODE Immediate */
export declare function CMP(value: Immediate): OpDescription;
/** Compare MODE ZeroPage */
export declare function CMP(value: SymbolOr<ZeroPage>): OpDescription;
/** Compare MODE ZeroPage,X */
export declare function CMP(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Compare MODE Absolute */
export declare function CMP(value: SymbolOr<Absolute>): OpDescription;
/** Compare MODE Absolute,X */
export declare function CMP(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Compare MODE Absolute,Y */
export declare function CMP(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Compare MODE (Indirect,X) */
export declare function CMP(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Compare MODE (Indirect),Y */
export declare function CMP(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Compare X Register MODE Immediate */
export declare function CPX(value: Immediate): OpDescription;
/** Compare X Register MODE ZeroPage */
export declare function CPX(value: SymbolOr<ZeroPage>): OpDescription;
/** Compare X Register MODE Absolute */
export declare function CPX(value: SymbolOr<Absolute>): OpDescription;
/** Compare Y Register MODE Immediate */
export declare function CPY(value: Immediate): OpDescription;
/** Compare Y Register MODE ZeroPage */
export declare function CPY(value: SymbolOr<ZeroPage>): OpDescription;
/** Compare Y Register MODE Absolute */
export declare function CPY(value: SymbolOr<Absolute>): OpDescription;
/** Decrement Memory MODE ZeroPage */
export declare function DEC(value: SymbolOr<ZeroPage>): OpDescription;
/** Decrement Memory MODE ZeroPage,X */
export declare function DEC(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Decrement Memory MODE Absolute */
export declare function DEC(value: SymbolOr<Absolute>): OpDescription;
/** Decrement Memory MODE Absolute,X */
export declare function DEC(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Decrement X Register MODE Implied */
export declare function DEX(): OpDescription;
/** Decrement Y Register MODE Implied */
export declare function DEY(): OpDescription;
/** Exclusive OR MODE Immediate */
export declare function EOR(value: Immediate): OpDescription;
/** Exclusive OR MODE ZeroPage */
export declare function EOR(value: SymbolOr<ZeroPage>): OpDescription;
/** Exclusive OR MODE ZeroPage,X */
export declare function EOR(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Exclusive OR MODE Absolute */
export declare function EOR(value: SymbolOr<Absolute>): OpDescription;
/** Exclusive OR MODE Absolute,X */
export declare function EOR(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Exclusive OR MODE Absolute,Y */
export declare function EOR(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Exclusive OR MODE (Indirect,X) */
export declare function EOR(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Exclusive OR MODE (Indirect),Y */
export declare function EOR(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Increment Memory MODE ZeroPage */
export declare function INC(value: SymbolOr<ZeroPage>): OpDescription;
/** Increment Memory MODE ZeroPage,X */
export declare function INC(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Increment Memory MODE Absolute */
export declare function INC(value: SymbolOr<Absolute>): OpDescription;
/** Increment Memory MODE Absolute,X */
export declare function INC(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Increment X Register MODE Implied */
export declare function INX(): OpDescription;
/** Increment Y Register MODE Implied */
export declare function INY(): OpDescription;
/** Jump MODE Absolute */
export declare function JMP(value: SymbolOr<Absolute>): OpDescription;
/** Jump MODE Indirect */
export declare function JMP(value: SymbolOr<Indirect>): OpDescription;
/** Jump to Subroutine MODE Absolute */
export declare function JSR(value: SymbolOr<Absolute>): OpDescription;
/** Load Accumulator MODE Immediate */
export declare function LDA(value: Immediate): OpDescription;
/** Load Accumulator MODE ZeroPage */
export declare function LDA(value: SymbolOr<ZeroPage>): OpDescription;
/** Load Accumulator MODE ZeroPage,X */
export declare function LDA(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Load Accumulator MODE Absolute */
export declare function LDA(value: SymbolOr<Absolute>): OpDescription;
/** Load Accumulator MODE Absolute,X */
export declare function LDA(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Load Accumulator MODE Absolute,Y */
export declare function LDA(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Load Accumulator MODE (Indirect,X) */
export declare function LDA(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Load Accumulator MODE (Indirect),Y */
export declare function LDA(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Load X Register MODE Immediate */
export declare function LDX(value: Immediate): OpDescription;
/** Load X Register MODE ZeroPage */
export declare function LDX(value: SymbolOr<ZeroPage>): OpDescription;
/** Load X Register MODE ZeroPage,Y */
export declare function LDX(value: SymbolOr<ZeroPage>, index: "y"): OpDescription;
/** Load X Register MODE Absolute */
export declare function LDX(value: SymbolOr<Absolute>): OpDescription;
/** Load X Register MODE Absolute,Y */
export declare function LDX(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Load Y Register MODE Immediate */
export declare function LDY(value: Immediate): OpDescription;
/** Load Y Register MODE ZeroPage */
export declare function LDY(value: SymbolOr<ZeroPage>): OpDescription;
/** Load Y Register MODE ZeroPage,X */
export declare function LDY(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Load Y Register MODE Absolute */
export declare function LDY(value: SymbolOr<Absolute>): OpDescription;
/** Load Y Register MODE Absolute,X */
export declare function LDY(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Logical Shift Right MODE Accumulator */
export declare function LSR(): OpDescription;
/** Logical Shift Right MODE ZeroPage */
export declare function LSR(value: SymbolOr<ZeroPage>): OpDescription;
/** Logical Shift Right MODE ZeroPage,X */
export declare function LSR(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Logical Shift Right MODE Absolute */
export declare function LSR(value: SymbolOr<Absolute>): OpDescription;
/** Logical Shift Right MODE Absolute,X */
export declare function LSR(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** No Operation MODE Implied */
export declare function NOP(): OpDescription;
/** Logical Inclusive OR MODE Immediate */
export declare function ORA(value: Immediate): OpDescription;
/** Logical Inclusive OR MODE ZeroPage */
export declare function ORA(value: SymbolOr<ZeroPage>): OpDescription;
/** Logical Inclusive OR MODE ZeroPage,X */
export declare function ORA(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Logical Inclusive OR MODE Absolute */
export declare function ORA(value: SymbolOr<Absolute>): OpDescription;
/** Logical Inclusive OR MODE Absolute,X */
export declare function ORA(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Logical Inclusive OR MODE Absolute,Y */
export declare function ORA(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Logical Inclusive OR MODE (Indirect,X) */
export declare function ORA(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Logical Inclusive OR MODE (Indirect),Y */
export declare function ORA(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Push Accumulator MODE Implied */
export declare function PHA(): OpDescription;
/** Push Processor Status MODE Implied */
export declare function PHP(): OpDescription;
/** Pull Accumulator MODE Implied */
export declare function PLA(): OpDescription;
/** Pull Processor Status MODE Implied */
export declare function PLP(): OpDescription;
/** Rotate Left MODE Accumulator */
export declare function ROL(): OpDescription;
/** Rotate Left MODE ZeroPage */
export declare function ROL(value: SymbolOr<ZeroPage>): OpDescription;
/** Rotate Left MODE ZeroPage,X */
export declare function ROL(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Rotate Left MODE Absolute */
export declare function ROL(value: SymbolOr<Absolute>): OpDescription;
/** Rotate Left MODE Absolute,X */
export declare function ROL(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Rotate Right MODE Accumulator */
export declare function ROR(): OpDescription;
/** Rotate Right MODE ZeroPage */
export declare function ROR(value: SymbolOr<ZeroPage>): OpDescription;
/** Rotate Right MODE ZeroPage,X */
export declare function ROR(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Rotate Right MODE Absolute */
export declare function ROR(value: SymbolOr<Absolute>): OpDescription;
/** Rotate Right MODE Absolute,X */
export declare function ROR(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Return from Interrupt MODE Implied */
export declare function RTI(): OpDescription;
/** Return from Subroutine MODE Implied */
export declare function RTS(): OpDescription;
/** Subtract with Carry MODE Immediate */
export declare function SBC(value: Immediate): OpDescription;
/** Subtract with Carry MODE ZeroPage */
export declare function SBC(value: SymbolOr<ZeroPage>): OpDescription;
/** Subtract with Carry MODE ZeroPage,X */
export declare function SBC(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Subtract with Carry MODE Absolute */
export declare function SBC(value: SymbolOr<Absolute>): OpDescription;
/** Subtract with Carry MODE Absolute,X */
export declare function SBC(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Subtract with Carry MODE Absolute,Y */
export declare function SBC(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Subtract with Carry MODE (Indirect,X) */
export declare function SBC(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Subtract with Carry MODE (Indirect),Y */
export declare function SBC(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Set Carry Flag MODE Implied */
export declare function SEC(): OpDescription;
/** Set Decimal Flag MODE Implied */
export declare function SED(): OpDescription;
/** Set Interrupt Disable MODE Implied */
export declare function SEI(): OpDescription;
/** Store Accumulator MODE ZeroPage */
export declare function STA(value: SymbolOr<ZeroPage>): OpDescription;
/** Store Accumulator MODE ZeroPage,X */
export declare function STA(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Store Accumulator MODE Absolute */
export declare function STA(value: SymbolOr<Absolute>): OpDescription;
/** Store Accumulator MODE Absolute,X */
export declare function STA(value: SymbolOr<Absolute>, index: "x"): OpDescription;
/** Store Accumulator MODE Absolute,Y */
export declare function STA(value: SymbolOr<Absolute>, index: "y"): OpDescription;
/** Store Accumulator MODE (Indirect,X) */
export declare function STA(value: SymbolOr<Indirect>, index: "prex"): OpDescription;
/** Store Accumulator MODE (Indirect),Y */
export declare function STA(value: SymbolOr<Indirect>, index: "posty"): OpDescription;
/** Store X Register MODE ZeroPage */
export declare function STX(value: SymbolOr<ZeroPage>): OpDescription;
/** Store X Register MODE ZeroPage,Y */
export declare function STX(value: SymbolOr<ZeroPage>, index: "y"): OpDescription;
/** Store X Register MODE Absolute */
export declare function STX(value: SymbolOr<Absolute>): OpDescription;
/** Store Y Register MODE ZeroPage */
export declare function STY(value: SymbolOr<ZeroPage>): OpDescription;
/** Store Y Register MODE ZeroPage,X */
export declare function STY(value: SymbolOr<ZeroPage>, index: "x"): OpDescription;
/** Store Y Register MODE Absolute */
export declare function STY(value: SymbolOr<Absolute>): OpDescription;
/** Transfer Accumulator to X MODE Implied */
export declare function TAX(): OpDescription;
/** Transfer Accumulator to Y MODE Implied */
export declare function TAY(): OpDescription;
/** Transfer Stack Pointer to X MODE Implied */
export declare function TSX(): OpDescription;
/** Transfer X to Accumulator MODE Implied */
export declare function TXA(): OpDescription;
/** Transfer X to Stack Pointer MODE Implied */
export declare function TXS(): OpDescription;
/** Transfer Y to Accumulator MODE Implied */
export declare function TYA(): OpDescription;
