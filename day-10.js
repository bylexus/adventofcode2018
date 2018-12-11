let fs = require('fs');

// Parse input into an array with 4 numbers: [x, y, velocityX, velocityY]
let matcher = new RegExp('\\<\\s*(-?\\d+),\\s*(-?\\d+)\\>.*\\<\\s*(-?\\d+),\\s*(-?\\d+)\\>');
let starmap = [];
let input = fs
    .readFileSync('./day-10-input.txt', { encoding: 'UTF-8' })
    // .readFileSync('./day-10-input-small.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => {
        let match = line.trim().match(matcher);
        starmap.push([Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])]);
    });

// Don't consider images higher than this:
const MAX_HEIGHT = 15;

/**
 * Approach:
 * The image must be found visually. So the stars have to be drawn and output to be investigated manually.
 * But: The final coordinate set has a very large dimension: over 100'000 points in width / height.
 *
 * So my guess is that the final readable message must be within an image height of about 15.
 * So I will calculate the coordinate movements until it fits into a height of 15...
 * Then I will produce the output image until it does NOT fit into 100 15.
 * Maybe this works.....
 */

let entryBorder = false;
let second = 0;
// Each loop calculates the next second in the starmap.
// If the starmap's height fit into MAX_HEIGHT, an ASCII art image is drawn.
while (true) {
    let dimInfo = findDimensions(starmap),
        dim = dimInfo.dimension;
    // Draw star map ASCII art, if small enough:
    if (dim[1] <= MAX_HEIGHT) {
        entryBorder = true;
        console.log('Image dimension:', dim, 'at second: ', second);
        let img = calcImage(starmap, dimInfo);
        console.log(img);
    }

    starmap = calcNextPosition(starmap);

    // we leave the max height range? end:
    if (dim[1] > MAX_HEIGHT && entryBorder) {
        break;
    }
    second++;
}

/**
 * Calculates the boundaries of the actual coodinates: width, height, min/max values
 */
function findDimensions(starmap) {
    let maxY = -Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let minX = Infinity;
    for (let i = 0; i < starmap.length; i++) {
        if (starmap[i][0] > maxX) {
            maxX = starmap[i][0];
        }
        if (starmap[i][0] < minX) {
            minX = starmap[i][0];
        }
        if (starmap[i][1] > maxY) {
            maxY = starmap[i][1];
        }
        if (starmap[i][1] < minY) {
            minY = starmap[i][1];
        }
    }
    let result = {
        dimension: [maxX - minX + 1, maxY - minY + 1],
        minX,
        minY,
        maxX,
        maxY
    };
    return result;
}

/**
 * Calculates the next second in the star map. Just apply the velocity vectors.
 */
function calcNextPosition(starmap) {
    for (let i = 0; i < starmap.length; i++) {
        starmap[i][0] += starmap[i][2];
        starmap[i][1] += starmap[i][3];
    }

    return starmap;
}

/**
 * Checks if the star map contains the given coordinate, return true if so,
 * false if not
 */
function hasCoord(starmap, coord) {
    for (let i = 0; i < starmap.length; i++) {
        if (starmap[i][0] === coord[0] && starmap[i][1] === coord[1]) {
            return true;
        }
    }
    return false;
}

/**
 * Draws an Ascii-art of the actual starmap
 */
function calcImage(starmap, dimensions) {
    let str = '';
    for (let y = dimensions.minY; y <= dimensions.maxY; y++) {
        for (let x = dimensions.minX; x <= dimensions.maxX; x++) {
            str += hasCoord(starmap, [x, y]) ? '*' : ' ';
        }
        str += '\n';
    }
    return str;
}
