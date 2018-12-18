let fs = require('fs');
let input_11 = fs
    .readFileSync('./day-18-input.txt', { encoding: 'UTF-8' })
    // .readFileSync('./day-18-input-small.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => line.split(''));
let input_21 = fs
    .readFileSync('./day-18-input.txt', { encoding: 'UTF-8' })
    // .readFileSync('./day-18-input-small.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => line.split(''));

let input_12 = new Array(input_11.length);
for (let i = 0; i < input_11.length; i++) {
    input_12[i] = new Array(input_11[i].length);
}
let input_22 = new Array(input_21.length);
for (let i = 0; i < input_21.length; i++) {
    input_22[i] = new Array(input_21[i].length);
}

// input and input2 are 2 arrays used interchangeable:
// they act as a "calculating buffer", like a double-buffered image,
// during a calculation minute.

let orig = input_11;
let copy = input_12;
let tmp;
let end1 = 10;

let directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

let endMinute, sum;

endMinute = calcWood(end1);
sum = calcSum(copy);
console.log(`Day 18: Sum after ${endMinute} minutes (Solution 1): ${sum}`);

// -------------------------------------------------------------------------------------
/**
 * For the 2nd part, a bit investigation is needed, as calculation take much too long:
 * It appears that the calculated SUM repeats after every 28 minute AFTER about 500 minutes.
 *
 * So we can just calculate the result:
 * Multiply of 28 big enough to be over 500: 20*28 = 560
 * div(1000000000,560) = 1785714 --> So the sum at minute 560 is the same
 * sum as at 560 * 1785714 = 999999840
 * This is 160 steps away from 1000000000, ANd 160 steps away from 560
 * --> so the sum at 560 + 160 = 720 is the solution
 */

// let end2 = 1000000000;
let end2 = 720; // see number investigation above

orig = input_21;
copy = input_22;
let sumsSeeninMinute = {}
sumsSeeninMinute[calcSum(orig)] = 0;

endMinute = calcWood(end2);
sum = 0;
// print(copy, endMinute);
sum = calcSum(copy);
console.log(`Day 18: Sum after ${endMinute} minutes (same as at 1000000000, Solution 2): ${sum}`);

function calcWood(endMinute) {
    let minute = 1;
    while (true) {
        // work from orig to copy:
        // char codes, for faster access:
        // '.': 46;
        // '|': 124;
        // '#': 35;

        for (let y = 0; y < orig.length; y++) {
            for (let x = 0; x < orig[y].length; x++) {
                switch (orig[y][x].charCodeAt(0)) {
                    case 46:
                        if (fieldHasAdjacent(orig, [y, x], 124, 3)) {
                            copy[y][x] = '|';
                        } else {
                            copy[y][x] = '.';
                        }
                        break;
                    case 124:
                        if (fieldHasAdjacent(orig, [y, x], 35, 3)) {
                            copy[y][x] = '#';
                        } else {
                            copy[y][x] = '|';
                        }
                        break;
                    case 35:
                        if (fieldHasAdjacent(orig, [y, x], 35, 1) && fieldHasAdjacent(orig, [y, x], 124, 1)) {
                            copy[y][x] = '#';
                        } else {
                            copy[y][x] = '.';
                        }

                        break;
                }
            }
        }

        if (minute === endMinute) {
            break;
        }
        // let sum = calcSum(copy);
        // if (sumsSeeninMinute[sum]) {
        //     console.log('Found same sum at minutes: ',minute, minute-sumsSeeninMinute[sum], sum);
        //     // break;
        // }
        // sumsSeeninMinute[sum] = minute;

        // copy now contains the new state. Make it the new orig for the next round:
        minute++;
        tmp = orig;
        orig = copy;
        copy = tmp;
    }
    return minute;
}

function fieldHasAdjacent(wood, coord, code, count) {
    for (let i = 0; i < directions.length; i++) {
        let y = coord[0] + directions[i][0];
        let x = coord[1] + directions[i][1];
        if (y >= 0 && x >= 0 && y < wood.length && x < wood[y].length && wood[y][x].charCodeAt(0) === code) {
            count--;
        }
        if (count === 0) {
            return true;
        }
    }
    return false;
}

function print(wood, minute) {
    let str = `Wood after ${minute} minutes:\n`;
    for (let y = 0; y < wood.length; y++) {
        for (let x = 0; x < wood[y].length; x++) {
            str += wood[y][x];
        }
        str += '\n';
    }
    console.log(str);
}

function calcSum(wood) {
    let trees = 0;
    let yards = 0;
    for (let y = 0; y < wood.length; y++) {
        for (let x = 0; x < wood[y].length; x++) {
            if (wood[y][x] === '|') {
                trees++;
            } else if (wood[y][x] === '#') {
                yards++;
            }
        }
    }
    return trees * yards;
}
