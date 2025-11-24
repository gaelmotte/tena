export const processHeader = (state) => {
    // iNes header
    state.ROMBuffer[state.offset++] = 0x4E;
    state.ROMBuffer[state.offset++] = 0x45;
    state.ROMBuffer[state.offset++] = 0x53;
    state.ROMBuffer[state.offset++] = 0x1A;
    // Config
    state.ROMBuffer[state.offset++] = 2; // 2x 16KB PRG-ROM Banks
    state.ROMBuffer[state.offset++] = 1; // 1x  8KB CHR-ROM
    state.ROMBuffer[state.offset++] = 0; // mapper 0 (NROM)
    state.ROMBuffer[state.offset++] = 0; // System: NES
};
export const processOp = (op, state) => {
    switch (op.type) {
        case "SymbolicLabel":
            if (op.value in state.symbols) {
                // TODO: Improve these errors with positional information
                throw new Error(`Symbol "${op.value}" has already been declared`);
            }
            // if (reservedSymbols.includes(op.value)) {
            //   throw new Error(`Symbol "${op.value}" has reserved`);
            // }
            const labelOffset = state.offset;
            if (!op.value.startsWith('__discard')) {
                console.log(`${op.value.padEnd(30, ' ')} 0x${labelOffset.toString(16)}`);
            }
            state.symbols[op.value] = labelOffset;
    }
    return;
};
"opDescription";
if (Object.keys(op).includes("symbol")) { }
throw new Error("Not Implemented Yet");
export const assemble = (ops) => {
    const state = {
        offset: 0x0000,
        symbols: {},
        revisit: [],
        ROMBuffer: new Uint8Array(0x8000), // Simple 32kb ROM only (for now)
    };
    processHeader(state);
    for (let op of ops) {
        processOp(op, state);
    }
};
//# sourceMappingURL=assembler.js.map