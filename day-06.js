// let coords = [[1, 1], [1, 6], [8, 3], [3, 4], [5, 5], [8, 9]];
let coords = [
  [192, 220],
  [91, 338],
  [65, 319],
  [143, 310],
  [243, 205],
  [237, 135],
  [342, 197],
  [114, 56],
  [189, 168],
  [194, 174],
  [55, 331],
  [181, 162],
  [272, 111],
  [201, 121],
  [73, 88],
  [276, 274],
  [324, 323],
  [201, 146],
  [125, 301],
  [190, 185],
  [247, 307],
  [157, 65],
  [217, 181],
  [62, 222],
  [319, 202],
  [86, 342],
  [333, 339],
  [181, 240],
  [263, 198],
  [200, 296],
  [306, 228],
  [55, 50],
  [154, 356],
  [54, 70],
  [91, 91],
  [265, 182],
  [272, 267],
  [118, 296],
  [75, 140],
  [319, 272],
  [357, 341],
  [193, 342],
  [102, 334],
  [246, 123],
  [328, 139],
  [229, 284],
  [199, 309],
  [151, 243],
  [295, 229],
  [201, 277],
];

let width = 0,
  height = 0;

// Step 1: Determine the width / height of the needed coordinate plane:
// We begin the plane at 0,0, for easier calculation: It is a bit of overhead (we really only
// need the grid that outlines all coordinates), but the grid is small enough to let optimizations away.

coords.forEach(pair => {
  let [col, row] = pair;
  width = Math.max(width, col);
  height = Math.max(height, row);
});
width = width + 1;
height = height + 1;

console.log(`Day 6: Coordinate plane: width/height: ${width}, ${height}`);

// Build coordinate plane, calculate Manhattan distance to all coords for each plane point
let plane = new Array(width);
for (let col = 0; col < plane.length; col++) {
  plane[col] = new Array(height);
  for (let row = 0; row < plane[col].length; row++) {
    plane[col][row] = findNearestCoordIndex([col, row], coords);
  }
}

// Now we have a coordinate plane filled with nearest-coord-indexes. We now elimiate:
// - all coord-indexes that touches a border: Those are infinite areas and not wanted.
let infiniteIndexes = [];
for (let col = 0; col < width; col++) {
  if (plane[col][0] > -1) {
    infiniteIndexes.push(plane[col][0]);
  }
  if (plane[col][height - 1] > -1) {
    infiniteIndexes.push(plane[col][height - 1]);
  }
}
for (let row = 0; row < height; row++) {
  if (plane[0][row] > -1) {
    infiniteIndexes.push(plane[0][row]);
  }
  if (plane[width - 1][row] > -1) {
    infiniteIndexes.push(plane[width - 1][row]);
  }
}

// Clean out all infinite-index points from the plane:
for (let col = 0; col < width; col++) {
  for (let row = 0; row < height; row++) {
    if (infiniteIndexes.indexOf(plane[col][row]) > -1) {
      plane[col][row] = -1;
    }
  }
}

// now, cound the remaining points in the plane: count by coord index.
let areaCountByCoordIndex = {};
for (let col = 0; col < width; col++) {
  for (let row = 0; row < height; row++) {
    let index = plane[col][row];
    if (index >= 0) {
      areaCountByCoordIndex[index] = (areaCountByCoordIndex[index] || 0) + 1;
    }
  }
}

// Now, find the largest size:
let maxArea = 0;
Object.keys(areaCountByCoordIndex).forEach(key => {
  maxArea = Math.max(areaCountByCoordIndex[key], maxArea);
});

console.log(`Day 6: Maximum non-infinite area (Solution 1): ${maxArea}`);

// ---------------- Part 2: Region with sum(ManhattanDistance < 10000) --------------------
let regionCount = 0;
for (let col = 0; col < width; col++) {
    for (let row = 0; row < height; row++) {
        if (sumManhattanDistances([col, row], coords) < 10000) {
            regionCount++;
        }
    }
}
console.log(`Day 6: Region size with sum of Manhattan Distances < 10000 (Solution 2): ${regionCount}`);

function manhattanDistance(point1, point2) {
  return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

/**
 * walks through each coordinate, searching for the nearest coordinate to the given point.
 * If two coords have the same min distance, -1 is returned instead.
 */
function findNearestCoordIndex(point, coords) {
  let minDist = Infinity;
  let minDistCoordIndex = null;
  let distances = [];
  for (let i = 0; i < coords.length; i++) {
    let dist = manhattanDistance(point, coords[i]);
    distances.push(dist);
    if (dist < minDist) {
      minDist = dist;
      minDistCoordIndex = i;
    }
  }
  // check if minDist does only occur once in the distances array:
  if (distances.indexOf(minDist) === distances.lastIndexOf(minDist)) {
    return minDistCoordIndex;
  } else return -1;
}

function sumManhattanDistances(point, coords) {
  let sum = 0;
  for (let i = 0; i < coords.length; i++) {
    sum += manhattanDistance(point, coords[i]);
  }
  return sum;
}

function outputPlane(plane) {
  for (let row = 0; row < plane[0].length; row++) {
    let rowStr = '';
    for (let col = 0; col < plane.length; col++) {
      rowStr += String(plane[col][row] > -1 ? plane[col][row] : '.');
    }
    console.log(rowStr);
  }
}
