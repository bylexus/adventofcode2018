let fs = require('fs');
let input = fs
    // .readFileSync('./day-23-input-small.txt', { encoding: 'UTF-8' })
    .readFileSync('./day-23-input.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => {
        let match = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>,\s*r=(\d+)/);
        if (match) {
            return {
                x: Number(match[1]),
                y: Number(match[2]),
                z: Number(match[3]),
                r: Number(match[4])
            };
        }
    });

let maxR = findMaxR(input);
let inRangeBots = findInRangeRobots(input, maxR);
console.log(`Day 23: Nr of robots in range of X:${maxR.x},Y:${maxR.y},Z:${maxR.z},r:${maxR.r}: ${inRangeBots.length}`);

let range = findRobotRange(input);
console.log(range);

function findRobotRange(robots) {
    let range = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity
    };

    robots.forEach(r => {
        range = {
            minX: Math.min(r.x, range.minX),
            maxX: Math.max(r.x, range.maxX),
            minY: Math.min(r.y, range.minY),
            maxY: Math.max(r.y, range.maxY),
            minZ: Math.min(r.z, range.minZ),
            maxZ: Math.max(r.z, range.maxZ)
        };
    });

    range.distX = range.maxX - range.minX;
    range.distY = range.maxY - range.minY;
    range.distZ = range.maxZ - range.minZ;
    return range;
}

function findInRangeRobots(robots, robot) {
    let inRange = [];
    robots.forEach(r => {
        if (distance(r, robot) <= robot.r) {
            inRange.push(r);
        }
    });
    return inRange;
}

function findMaxR(robots) {
    let maxR = { r: 0 };
    robots.forEach(r => {
        if (r.r > maxR.r) {
            maxR = r;
        }
    });
    return maxR;
}

function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}
