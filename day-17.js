// ----- Use with node --harmony (for Object.values)

let matcher = new RegExp('(x|y)=(\\d+)\\,\\s*(x|y)=(\\d+)\\.\\.(\\d+)');
let fs = require('fs');
let maxX = 0,
    maxY = 0,
    minX = Infinity,
    minY = Infinity;
let input = fs
    // .readFileSync('./day-17-input-small.txt', { encoding: 'UTF-8' })
    .readFileSync('./day-17-input.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => {
        let match = line.match(matcher);
        if (match) {
            let [full, fixAxis, at, axis, from, to] = match;
            at = Number(at);
            from = Number(from);
            to = Number(to);
            if (axis === 'x') {
                maxX = Math.max(maxX, from);
                maxX = Math.max(maxX, to);
                minX = Math.min(minX, from);
                minX = Math.min(minX, to);
                maxY = Math.max(maxY, at);
                minY = Math.min(minY, at);
            }
            if (axis === 'y') {
                maxY = Math.max(maxY, from);
                maxY = Math.max(maxY, to);
                minY = Math.min(minY, from);
                minY = Math.min(minY, to);
                maxX = Math.max(maxX, at);
                minX = Math.min(minX, at);
            }
            return {
                axis,
                at,
                from,
                to
            };
        }
    });

let earth = new Array(maxY + 1);
console.log(minX, maxX, minY, maxY);

init();
// print();
drainFromSource([0, 500]);
print();
let waterCount = countWater(['~','|']);
let stillWaterCount = countWater(['~']);
console.log(`Day 17: Water count (Solution 1): ${waterCount}`);
console.log(`Day 17: Still Water count (Solution 2): ${stillWaterCount}`);

function init() {
    // init empty ground
    for (let y = 0; y < earth.length; y++) {
        earth[y] = new Array(maxX + 2);
        for (let x = 0; x < earth[y].length; x++) {
            earth[y][x] = '.'; //sand
        }
    }
    // fill in clay:
    input.forEach(line => {
        for (let i = line.from; i <= line.to; i++) {
            if (line.axis === 'x') {
                earth[line.at][i] = '#';
            }
            if (line.axis === 'y') {
                earth[i][line.at] = '#';
            }
        }
    });

    // fill in source:
    earth[0][500] = '+';
}

/**
 * drips water from the given source coordinate down, until no more water can run down.
 *
 * Steps:
 * 1. fill downwards until we reach either ground or the bottom line
 * 2. then fill to the left and right of the bottom, if landed on ground,
 *    checking each side for a new source (a border where water can fall down).
 *    If this is the case, this drip can stop, after processing the new source(s) recursively.
 * 3. recursively process new sources
 *
 * @param {array} sourceCoord
 */
function drainFromSource(sourceCoord) {
    let actCoord = [sourceCoord[0] + 1, sourceCoord[1]];
    // step 1: drain down water:
    while (earth[actCoord[0]] && (earth[actCoord[0]][actCoord[1]] === '.' || earth[actCoord[0]][actCoord[1]] === '~')) {
        let [y, x] = actCoord;
        earth[y][x] = '|';
        if (y + 1 >= earth.length) {
            break;
        }
        actCoord = [y + 1, x];
    }

    // we reach ground, check what we reached:
    if (isBottom(actCoord)) {
        // console.log('bottom reached at', actCoord);
        return actCoord;
    }
    if (isClay(actCoord)) {
        // console.log('clay reached at', actCoord);
        while (!coordsMatch(actCoord, sourceCoord)) {
            let continueFill = true;
            actCoord = [actCoord[0] - 1, actCoord[1]];
            let sourceLEndCoords = null;
            let sourceREndCoords = null;

            let sourceL = fillLeft(actCoord);
            if (sourceL === -1) {
                // -1 means: we have reached an existing source, skip
                continueFill = false;
            } else if (sourceL) {
                sourceLEndCoords = drainFromSource(sourceL);
                if (!coordsMatch(sourceLEndCoords, sourceL)) {
                    continueFill = false;
                }
            }
            let sourceR = fillRight(actCoord);
            if (sourceR === -1) {
                // -1 means: we have reached an existing source, skip
                continueFill = false;
            } else if (sourceR) {
                sourceREndCoords = drainFromSource(sourceR);
                if (!coordsMatch(sourceREndCoords, sourceR)) {
                    continueFill = false;
                }
            }
            // If both sides are blocked (no drain at both sides), we fill the drain water with still water:
            if (sourceR === null && sourceL === null) {
                fillLine(actCoord);
            }
            if (!continueFill) {
                // end here, as sources do the rest:
                return false;
            }
        }
    }
    return actCoord;
}

function coordsMatch(coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}

function fillLeft(coord) {
    return fillX(coord, -1);
}

function fillRight(coord) {
    return fillX(coord, 1);
}

function fillX(coord, dir) {
    // fills to the left (dir = -1) or right (dir=1) of the given coordinate, until we reach clay or a border.
    // If we reach a border, we return that coordinate as a new source's location.
    // We fill it with draining water (|), as this is the top layer for now
    if (coord[1] === 0 || coord[1] >= earth[0].length) {
        return null;
    }
    let actCoord = [coord[0], coord[1] + dir];
    while (actCoord[1] >= 0 && actCoord[1] < earth[0].length) {
        // fill sand with water:
        if (earth[actCoord[0]][actCoord[1]] === '.') {
            earth[actCoord[0]][actCoord[1]] = '|';
        }
        // have we reached clay? return.
        if (earth[actCoord[0]][actCoord[1]] === '#') {
            return null;
        }
        // have we reached an existing source? return -1, to indicate an already processed source
        if (
            earth[actCoord[0]][actCoord[1]] === '|' &&
            earth[actCoord[0] + 1] &&
            earth[actCoord[0] + 1][actCoord[1]] === '|'
        ) {
            return -1;
        }
        // have we reached a border? OK, then this is a new source and the end
        // of fill:
        if (earth[actCoord[0] + 1][actCoord[1]] === '.') {
            earth[actCoord[0]][actCoord[1]] = '|';
            return actCoord;
        }
        actCoord = [actCoord[0], actCoord[1] + dir];
    }
    return null;
}

/**
 * fills a whole line with still water '~'. This function may only be called if it is SURE that both
 * sides are blocked by a wall
 */
function fillLine(coord) {
    if (coord[1] === 0 || coord[1] >= earth[0].length) {
        return null;
    }
    // left side
    let actCoord = coord.concat([], coord);
    while (actCoord[1] >= 0 && actCoord[1] < earth[0].length) {
        // have we reached clay? other side
        if (earth[actCoord[0]][actCoord[1]] === '#') {
            break;
        }
        earth[actCoord[0]][actCoord[1]] = '~';
        actCoord = [actCoord[0], actCoord[1] - 1];
    }
    // right side
    actCoord = coord.concat([], coord);
    while (actCoord[1] >= 0 && actCoord[1] < earth[0].length) {
        // have we reached clay? other side
        if (earth[actCoord[0]][actCoord[1]] === '#') {
            break;
        }
        earth[actCoord[0]][actCoord[1]] = '~';
        actCoord = [actCoord[0], actCoord[1] + 1];
    }
}

function isClay(coord) {
    let [y, x] = coord;
    if (x < 0 || x >= earth[0].length) {
        return false;
    }
    if (y < 0 || y >= earth.length) {
        return false;
    }
    return earth[y][x] === '#';
}

function isBottom(coord) {
    return coord[0] >= earth.length - 1 && earth[coord[0]][coord[1]] !== '#';
}

function countWater(waterTiles = ['~','|']) {
    let count = 0;
    for (let y = minY; y <= maxY; y++) {
        for (let x = 0; x < earth[y].length; x++) {
            if (waterTiles.indexOf(earth[y][x]) > -1) {
                count++;
            }
        }
    }
    return count;
}

function print() {
    let str = '';
    for (let y = 0; y < earth.length; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            str += earth[y][x];
        }
        str += '\n';
    }
    console.log(str);
}
