let fs = require('fs');
let matcher = new RegExp('\\<\\s*(-?\\d+),\\s*(-?\\d+)\\>.*\\<\\s*(-?\\d+),\\s*(-?\\d+)\\>');
// Parse input into an array with 4 numbers: [x, y, velocityX, velocityY]
let coords = [];
let input = fs
    .readFileSync('./day-10-input.txt', { encoding: 'UTF-8' })
    // .readFileSync('./day-10-input-small.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => {
        let match = line.trim().match(matcher);
        coords.push([Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])]);
    });

const MAX_HEIGHT = 15;

/**
 * Approach:
 * The image must be found visually. So the stars have to be drawn and output to be investigated manually.
 * But: The final coordinate set has a very large dimension: over 100'000 points in width / height.
 *
 * So my guess is that the final readable message must be within an image height of about 100.
 * So I will calculate the coordinate movements until it fits into a height of 100...
 * Then I will produce the output image until it does NOT fit into 100 again.
 * Maybe this works.....
 */

let entryBorder = false;
let second = 0;
while (true) {
    let dimInfo = findDimensions(coords),
        dim = dimInfo.dimension;
    if (dim[1] <= MAX_HEIGHT) {
        entryBorder = true;
        console.log("Image dimension:", dim, "at second: ",second);
        let img = calcImage(coords, dimInfo);
        console.log(img);
    }

    coords = calcNextPosition(coords);

    if (dim[1] > MAX_HEIGHT && entryBorder) {
        // we leave the 100-height range, end:
        break;
    }
    second++;
}

function findDimensions(coords) {
    let maxY = -Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let minX = Infinity;
    for (let i = 0; i < coords.length; i++) {
        if (coords[i][0] > maxX) {
            maxX = coords[i][0];
        }
        if (coords[i][0] < minX) {
            minX = coords[i][0];
        }
        if (coords[i][1] > maxY) {
            maxY = coords[i][1];
        }
        if (coords[i][1] < minY) {
            minY = coords[i][1];
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

function calcNextPosition(coords) {
    for (let i = 0; i < coords.length; i++) {
        coords[i][0] += coords[i][2];
        coords[i][1] += coords[i][3];
    }

    return coords;
}

function hasCoord(coords, coord) {
    for (let i = 0; i < coords.length; i++) {
        if (coords[i][0] === coord[0] && coords[i][1] === coord[1]) {
            return true;
        }
    }
    return false;
}

function calcImage(coords, dimensions) {
    let str = "";
    for (let y = dimensions.minY; y <= dimensions.maxY; y++) {
        for (let x = dimensions.minX; x <= dimensions.maxX; x++) {
            str += hasCoord(coords, [x,y]) ? '*' : ' ';
        }
        str += "\n";
    }
    return str;
}
