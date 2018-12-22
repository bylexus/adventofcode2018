// ----- Use with node --harmony (for Object.values)

// let fs = require('fs');
// let samples = JSON.parse(fs.readFileSync('./day-16-input-part1.json', { encoding: 'UTF-8' }).trim());
// let testops = JSON.parse(fs.readFileSync('./day-16-input-part2.json', { encoding: 'UTF-8' }).trim());

// let ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];
// let opcodes = {}; // known op codes
// let unsureSamples = [];
// let instructions = [
//     ['seti', 5, 0, 1],
//     ['seti', 6, 0, 2],
//     ['addi', 0, 1, 0],
//     ['addr', 1, 2, 3],
//     ['setr', 1, 0, 0],
//     ['seti', 8, 0, 4],
//     ['seti', 9, 0, 5]
// ];

let instructions = [
    ['addi', 5, 16, 5],
    ['seti', 1, 1, 2],
    ['seti', 1, 8, 1],
    ['mulr', 2, 1, 3],
    ['eqrr', 3, 4, 3],
    ['addr', 3, 5, 5],
    ['addi', 5, 1, 5],

    ['addr', 2, 0, 0],

    ['addi', 1, 1, 1],
    ['gtrr', 1, 4, 3],
    ['addr', 5, 3, 5],
    ['seti', 2, 6, 5],

    ['addi', 2, 1, 2],

    ['gtrr', 2, 4, 3],

    ['addr', 3, 5, 5],
    ['seti', 1, 2, 5],
    ['mulr', 5, 5, 5],
    ['addi', 4, 2, 4],
    ['mulr', 4, 4, 4],
    ['mulr', 5, 4, 4],
    ['muli', 4, 11, 4],
    ['addi', 3, 2, 3],
    ['mulr', 3, 5, 3],
    ['addi', 3, 13, 3],
    ['addr', 4, 3, 4],
    ['addr', 5, 0, 5],
    ['seti', 0, 8, 5],
    ['setr', 5, 5, 3],
    ['mulr', 3, 5, 3],
    ['addr', 5, 3, 3],
    ['mulr', 5, 3, 3],
    ['muli', 3, 14, 3],
    ['mulr', 3, 5, 3],
    ['addr', 4, 3, 4],
    ['seti', 0, 9, 0],
    ['seti', 0, 9, 5]
];

let ops = {
    addr,
    addi,
    mulr,
    muli,
    banr,
    bani,
    borr,
    bori,
    setr,
    seti,
    gtir,
    gtri,
    gtrr,
    eqir,
    eqri,
    eqrr
};

// let startregister = [1, 0, 0, 0, 0, 0];
let startregister = [0, 0, 0, 0, 0, 0];
// let startregister = [0, 10551294, 1, 0, 10551293, 8];
// let startregister = [ 0, 4300, 2, 10551293, 10551293, 4 ];
// let startregister = [ 2, 10551294, 2, 0, 10551293, 9 ];

let instrPointer = 0;
// let instrRegister = 5;
let instrRegister = 5;
let workRegister = startregister;

while (instrPointer >= 0 && instrPointer < instructions.length) {
    workRegister = applyInstruction(instructions[instrPointer], workRegister);
}

console.log(`Day 19: Register content after exit (Solution 1): ${workRegister}, content of register 0: ${workRegister[0]}`);

function applyInstruction(instruction, register) {
    let opFn = ops[instruction[0]];
    // let newReg = null;
    register[instrRegister] = instrPointer;
    register = opFn(instruction, register);
    // print(register, newReg, instrPointer, instruction);
    instrPointer = register[instrRegister] + 1;
    return register;
}

function compareRegisters(r1, r2) {
    for (let i = 0; i < r1.length; i++) {
        if (r1[i] !== r2[i]) {
            return false;
        }
    }
    return true;
}

function print(register, outReg, instrPointer, instruction) {
    console.log('ip=' + instrPointer, register, instruction, outReg);
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
