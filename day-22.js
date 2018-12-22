let depth = 6969;
let targetCoord = [796, 9];
let cave = new Array(targetCoord[0]+1);
for (let i = 0; i <= targetCoord[0]; i++) {
    cave[i] = new Array(targetCoord[1]+1);
}

let str = '';
let sum = 0;
for (let y = 0; y < cave.length; y++) {
    for (let x = 0; x < cave[y].length; x++) {
        let geoIndex = 0;
        if (y === 0 && x === 0) {
            geoIndex = 0;
        } else if (y === targetCoord[0] && x === targetCoord[1]) {
            geoIndex = 0;
        } else if (y === 0) {
            geoIndex = x * 16807;
        } else if (x === 0) {
            geoIndex = y * 48271;
        } else {
            geoIndex = cave[y][x - 1] * cave[y - 1][x];
        }

        let erodeLevel = (geoIndex + depth) % 20183;
        cave[y][x] = erodeLevel;
        sum += erodeLevel % 3;
        switch (erodeLevel % 3) {
            case 0:
                str += '.';
                break;
            case 1:
                str += '=';
                break;
            case 2:
                str += '|';
                break;
        }
    }
    str += '\n';
}

console.log(str);
console.log(`Day 20: The erode sum from 0,0 to ${targetCoord[0]},${targetCoord[1]} is (Solution 1): ${sum}`);
