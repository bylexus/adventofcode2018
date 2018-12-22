// Use with nodejs --harmony, for Object. values

// Test 1: 23 doors
// let input = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$';

// Test 2: 31 doors:
// let input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$';

// Real input:
let fs = require('fs');
let input = fs.readFileSync('./day-20-input.txt', { encoding: 'UTF-8' }).trim();

let distances = {};
let intersections = [];
let actDist = 0;
let actCoord = [0, 0];

for (let charIndex = 0; charIndex < input.length; charIndex++) {
    let char = input.charAt(charIndex);
    // console.log(charIndex, char);
    switch (char) {
        case '^':
            // The start: initialize actual position as 0:0, distance 0:
            actCoord = [0, 0];
            distances[coordHash(actCoord)] = 0;
            actDist = 0;
            break;
        case 'N':
        case 'E':
        case 'S':
        case 'W':
            actDist += 1;
            actCoord = moveTo(char, actCoord);
            let ch = coordHash(actCoord);
            if (!distances[ch] || distances[ch] > actDist) {
                distances[ch] = actDist;
            }
            break;
        case '(':
            intersections.push([actCoord, actDist]);
            break;
        case '|':
            let lastIntersection = intersections[intersections.length-1];
            actCoord = lastIntersection[0];
            actDist = lastIntersection[1];
            break;
        case ')':
            intersections.pop();
        case '$':
            break;
    }
}

let maxDist = Math.max(...Object.values(distances));
let nrOfFarAwayRooms = Object.values(distances).filter(d => d >= 1000).length;
console.log(`Day 20: Furthes room is: ${maxDist} doors away (Solution 1)`);
console.log(`Day 20: Nr of rooms with a distance >= 1000: ${nrOfFarAwayRooms}`);

// console.log(distances, intersections);

function coordHash(coord) {
    let x = coord[1],
        y = coord[0];
    return `${y}:${x}`;
}

function moveTo(dir, coord) {
    switch (dir) {
        case 'N':
            return [coord[0] - 1, coord[1]];
        case 'E':
            return [coord[0], coord[1] + 1];
        case 'S':
            return [coord[0] + 1, coord[1]];
        case 'W':
            return [coord[0], coord[1] - 1];
    }
}
