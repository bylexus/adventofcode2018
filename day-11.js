let serial = 9005,
    grid = [],
    gridLength = 300,
    maxInfo = {
        power: 0,
        x: 0,
        y: 0,
        size: 0
    };

// fill / calculate the grid:
for (let y = 0; y < gridLength; y++) {
    grid[y] = [];
    for (let x = 0; x < gridLength; x++) {
        grid[y][x] = calcCellValue(x + 1, y + 1, serial);
        if (y >= 2 && x >= 2) {
            let squarePower = calcPower(grid, x - 2, y - 2, 3);
            if (squarePower > maxInfo.power) {
                maxInfo.power = squarePower;
                maxInfo.x = x - 1;
                maxInfo.y = y - 1;
                maxInfo.size = 3;
            }
        }
    }
}

console.log(`Day 11: 3x3 grid coordinate with most power (Solution 1): ${maxInfo.x},${maxInfo.y}`);
console.log(maxInfo);

// ---- Problem 2 --------------------
maxInfo = {
    power: 0,
    x: 0,
    y: 0,
    size: 0
};
for (let size = 1; size <= 300; size++) {
    for (let y = 0; y < gridLength - size + 1; y++) {
        for (let x = 0; x < gridLength - size + 1; x++) {
            let squarePower = calcPower(grid, x, y, size);
            if (squarePower > maxInfo.power) {
                maxInfo.power = squarePower;
                maxInfo.x = x + 1;
                maxInfo.y = y + 1;
                maxInfo.size = size;
            }
        }
    }
}

console.log( `Day 11: grid coordinate with most power (Solution 2): ${maxInfo.x},${maxInfo.y},${maxInfo.size} has power ${maxInfo.power}`);

function calcCellValue(x, y, serial) {
    let rackId = x + 10;
    let res = (rackId * y + serial) * rackId;
    return (Math.floor(Math.abs(res) / 100) % 10) - 5;
}

function calcPower(grid, left, top, size) {
    let pwr = 0;
    for (let y = top; y < top + size; y++) {
        for (let x = left; x < left + size; x++) {
            pwr += grid[y][x];
        }
    }
    return pwr;
}
