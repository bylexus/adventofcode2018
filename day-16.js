// ----- Use with node --harmony (for Object.values)

let fs = require('fs');
let samples = JSON.parse(fs.readFileSync('./day-16-input-part1.json', { encoding: 'UTF-8' }).trim());
let testops = JSON.parse(fs.readFileSync('./day-16-input-part2.json', { encoding: 'UTF-8' }).trim());

let ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];
let opcodes = {}; // known op codes
let unsureSamples = [];

samples.forEach(sample => {
    let duplicateOps = findMatchingOps(sample.op, sample.before, sample.after, ops);
    // count possible duplicate ops (problem 1):
    if (duplicateOps.length >= 3) {
        unsureSamples.push(sample);
    }
    if (duplicateOps.length === 1) {
        // found a unique op, register it as known, for problem 2 later:
        opcodes[Number(sample.op[0])] = duplicateOps[0];
    }
});

console.log(`Day 16: Samples with >= 3 possible opcodes (Solution 1): ${unsureSamples.length}`);

// Part 2: for solution 2, we do the same: We loop so long with the KNOWN opcodes:
// if we get > 1 matches, we check if only ONE is still unknown: Then we found a new one.
// Repeat as long as we don't found all.
while (Object.keys(opcodes).length < ops.length) {
    samples.forEach(sample => {
        let knownOpCodes = Object.keys(opcodes).map(Number);
        let opcode = Number(sample.op[0]);
        let op = opcodes[opcode];

        if (op) {
            return; // opcode is unique / already known, so no need to inspect
        }

        let duplicateOps = findMatchingOps(sample.op, sample.before, sample.after, ops);
        if (duplicateOps.length >= 2) {
            // found possible ops: eliminate all known ops. If only one remains, that one must be it.
            let unknownOps = [];
            let ops = Object.values(opcodes);
            for (let i = 0; i < duplicateOps.length; i++) {
                if (ops.indexOf(duplicateOps[i]) === -1) {
                    unknownOps.push(duplicateOps[i]);
                }
            }
            if (unknownOps.length === 1) {
                // found a new op!
                opcodes[opcode] = unknownOps[0];
            }
        }
    });
}
console.log('Day 16: Deducted opcodes:\n', opcodes);

// Part 2.2: calculate the test program:
let startregister = [0, 0, 0, 0];
testops.forEach(op => {
    startregister = applyOp(opcodes[Number(op[0])], op, startregister);
});

console.log(`Day 16: End registers: ${startregister}: Register 0 contains (Solution 2): ${startregister[0]}`);

function applyOp(opFn, input, register) {
    return opFn(input, register);
}

function findMatchingOps(opInput, inRegister, exptectedRegister, ops) {
    let matchingOps = [];
    ops.forEach(opFn => {
        let res = applyOp(opFn, opInput, inRegister);
        if (compareRegisters(exptectedRegister, res)) {
            matchingOps.push(opFn);
        }
    });
    return matchingOps;
}

function compareRegisters(r1, r2) {
    for (let i = 0; i < r1.length; i++) {
        if (r1[i] !== r2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * addr (add register) stores into register C the result of adding register A and register B.
 */
function addr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] + register[input[2]];
    return register;
}

/**
 * addi (add immediate) stores into register C the result of adding register A and value B.
 */
function addi(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] + input[2];
    return register;
}

/**
 * mulr (multiply register) stores into register C the result of multiplying register A and register B.
 */
function mulr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] * register[input[2]];
    return register;
}

/**
 * muli (multiply immediate) stores into register C the result of multiplying register A and value B.
 */
function muli(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] * input[2];
    return register;
}

/**
 * banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
 */
function banr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] & register[input[2]];
    return register;
}

/**
 * bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
 */
function bani(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] & input[2];
    return register;
}

/**
 * borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
 */
function borr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] | register[input[2]];
    return register;
}

/**
 * bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
 */
function bori(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] | input[2];
    return register;
}

/**
 * setr (set register) copies the contents of register A into register C. (Input B is ignored.)
 */
function setr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]];
    return register;
}

/**
 * seti (set immediate) stores value A into register C. (Input B is ignored.)
 */
function seti(input, register) {
    register = [].concat(register);
    register[input[3]] = input[1];
    return register;
}

/**
 * gtir (greater-than immediate/register) sets register C to 1
 * if value A is greater than register B. Otherwise, register C is set to 0.
 */
function gtir(input, register) {
    register = [].concat(register);
    register[input[3]] = input[1] > register[input[2]] ? 1 : 0;
    return register;
}

/**
 * gtri (greater-than register/immediate) sets register C to 1
 * if register A is greater than value B. Otherwise, register C is set to 0.
 */
function gtri(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] > input[2] ? 1 : 0;
    return register;
}

/**
 * gtrr (greater-than register/register) sets register C to 1
 * if register A is greater than register B. Otherwise, register C is set to 0.
 */
function gtrr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] > register[input[2]] ? 1 : 0;
    return register;
}

/**
 * eqir (equal immediate/register) sets register C to 1
 * if value A is equal to register B. Otherwise, register C is set to 0.
 */
function eqir(input, register) {
    register = [].concat(register);
    register[input[3]] = input[1] === register[input[2]] ? 1 : 0;
    return register;
}

/**
 * eqri (equal register/immediate) sets register C to 1
 * if register A is equal to value B. Otherwise, register C is set to 0.
 */
function eqri(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] === input[2] ? 1 : 0;
    return register;
}

/**
 * eqrr (equal register/register) sets register C to 1
 * if register A is equal to register B. Otherwise, register C is set to 0.
 */
function eqrr(input, register) {
    register = [].concat(register);
    register[input[3]] = register[input[1]] === register[input[2]] ? 1 : 0;
    return register;
}
