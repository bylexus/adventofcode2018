/**
 * NOTE: NOT yet finished - still in an early stage, but just have too less time for that kind of prob...
 *
 *
 * Elves and Goblins - this is a very hard one -
 *
 * some thoughts:
 *
 * - each elve / goblin needs to be calculated separately, one after each other:
 *      The player must do all of its movement before the next player's turn. Even attacking.
 * - find free spaces after an opponent: Create a distance map starting from the player:
 *   calculate the distances from the player's location away for each square recursively.
 * - This distance map also shows:
 *   - which opponents are NOT reachable (no distance value)
 *   - which free square is the nearest (that with the lowest distance value)
 *
 * A player's turn will need the following steps:
 * - check if an opponent is in range. If yes, do not move, only attack.
 * - if no oppoment is nearby, move:
 *   - find all possible target spots (free squre next to an opponent)
 *   - calculate distance map to targets, recursively: The recurse function returns the path cost (last distance number):
 *     the initiator can then decide which path to take.
 * - after moving, attack, if an adacjent opponent is nearby.
 *
 * NOTE: Coordinates are always given in [y][x] pairs.
 */
class Player {
    constructor(type, y, x) {
        this.type = type; // 'E' or 'G'
        this.x = x;
        this.y = y;
        this.attack = 3;
        this.hp = 200;
        this.isAlive = true;
        this.nextCoord = null;
    }

    getPlayerHash() {
        return 10000 * this.y + this.x;
    }
}

let fs = require('fs');

let players = {};

let playfield = fs
    .readFileSync('./day-15-simple1.txt', { encoding: 'UTF-8' })
    .trim()
    .split('\n')
    .map(line => line.split(''));

init();
printPlayfield();
let player = players[Object.keys(players)[0]];

for (let i = 0; i < 2; i++) {
    let pks = Object.keys(players).sort();
    pks.forEach(pk => {
        let player = players[pk];
        // move 1
        let movableCoords = calcDistanceMap(player);
        // printPlayfield();
        let coord = findNearestMoveCoord(player, movableCoords);
        movePlayer(player, coord);
        // printPlayfield();
        cleanPlayfield();
        printPlayfield();
    });
}

function init() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            let square = playfield[y][x];
            if (square === 'E' || square === 'G') {
                let player = new Player(square, y, x);
                players[player.getPlayerHash()] = player;
                playfield[y][x] = player;
            }
        }
    }
}

function printPlayfield() {
    let out = '  ';
    for (let x = 0; x < playfield[0].length; x++) {
        out += String(x % 10);
    }
    out += '\n';
    for (let y = 0; y < playfield.length; y++) {
        out += String(y % 10) + ' ';
        for (let x = 0; x < playfield[y].length; x++) {
            let square = playfield[y][x];
            if (square instanceof Player) {
                out += square.type;
            } else {
                out += square;
            }
        }
        out += '\n';
    }
    console.log(out);
}

/**
 * Calcs the distant map in the playfield for the actual player:
 * Every "." field gets a number, which represents the distance
 * to the player.
 *
 * At the same time, the movable spots (adjacent to an enemy) are
 * marked ("!") and the coordinates to them are returned.
 */
function calcDistanceMap(player) {
    let opponents = getOpponents(player);
    let fieldQueue = [];
    let movableSpots = [];

    opponents.forEach(o => {
        let coords = markMovableSpots(o);
        movableSpots = movableSpots.concat(coords);
    });

    // for each direction around the player, add "." fields to the processing queue: This
    // is the initial queue entry.
    [[player.y, player.x + 1], [player.y + 1, player.x], [player.y, player.x - 1], [player.y - 1, player.x]].forEach(
        square => {
            if (playfield[square[0]][square[1]] === '.') {
                playfield[square[0]][square[1]] = 1;
                fieldQueue.push(square);
            }
        }
    );

    // now, work on the queue to process "." fields: Put new fields to the end of the queue,
    // and process from the beginning. This way, all fields are examined in the correct order.
    while (fieldQueue.length > 0) {
        let square = fieldQueue.shift();
        [
            [square[0], square[1] + 1],
            [square[0] + 1, square[1]],
            [square[0], square[1] - 1],
            [square[0] - 1, square[1]]
        ].forEach(s => {
            if (playfield[s[0]][s[1]] === '.') {
                playfield[s[0]][s[1]] = playfield[square[0]][square[1]] + 1;
                fieldQueue.push(s);
            }
        });
    }
    return movableSpots;
}

function getOpponents(player) {
    let ops = [];
    Object.keys(players).forEach(k => {
        let o = players[k];
        if (o.type !== player.type && o.isAlive) {
            ops.push(o);
        }
    });
    return ops;
}

/**
 * marks the squares adjacent to a player which are "free" with a "!"
 */
function markMovableSpots(player) {
    let dirs = [[player.y, player.x + 1], [player.y + 1, player.x], [player.y, player.x - 1], [player.y - 1, player.x]];
    let coords = [];
    dirs.forEach(coord => {
        if (playfield[coord[0]][coord[1]] === '.') {
            playfield[coord[0]][coord[1]] = '!';
            coords.push(coord);
        }
    });
    return coords;
}

/**
 * Finds the coordinates the player should next move to,
 * based on the calculated distance map playfield,
 * and the given set of possible end destinations.
 *
 * A shortest path is searched and the coords the player should move to
 * are returned.
 *
 * @param array coords: The destination coords (array of coord pairs) to move the player towards
 */
function findNearestMoveCoord(player, coords) {
    // sort coords in read order:
    coords = sortCoords(coords);
    let nearest = null;

    // find nearest destination coord:
    let shortesDist = Infinity,
        shortestCoords = null;

    coords.forEach(c => {
        // backward looking dirs
        // let dirs = [[c[0] - 1, c[1]], [c[0], c[1] - 1], [c[0] + 1, c[1]], [c[0], c[1] + 1]];
        let dirs = [[c[0] - 1, c[1]], [c[0], c[1] - 1], [c[0], c[1] + 1], [c[0] + 1, c[1]]];
        // let dirs = [[c[0], c[1] + 1], [c[0] + 1, c[1]], [c[0], c[1] - 1], [c[0] - 1, c[1]]];
        dirs.forEach(d => {
            let distance = Number(playfield[d[0]][d[1]]);
            if (distance > 0) {
                if (distance < shortesDist) {
                    shortesDist = distance;
                    shortestCoords = d;
                }
            }
        });
    });

    if (shortestCoords) {
        // Find shortest path back from those coords
        return findNextMoveFromDestCoords(player, shortestCoords);
    }
    return null;
}

/**
 * Finds the shortest path back from the given coordinates to the player,
 * returning the next move coords into that direction to the player.
 */
function findNextMoveFromDestCoords(player, coords) {
    // backward looking dirs
    let dirs = [
        [coords[0], coords[1] + 1],
        [coords[0] + 1, coords[1]],
        [coords[0], coords[1] - 1],
        [coords[0] - 1, coords[1]]
    ];

    // find next coordinate with shortest distance to target:
    let shortestDist = Infinity,
        shortestCoords = null;
    dirs.forEach(d => {
        let distance = Number(playfield[d[0]][d[1]]);
        if (distance === 1) {
            shortestDist = 1;
            shortestCoords = d;
            return false;
        }
        if (distance > 0) {
            if (distance < shortestDist) {
                shortestDist = distance;
                shortestCoords = d;
            }
        }
    });

    if (shortestDist === 1) {
        return shortestCoords;
    } else {
        return findNextMoveFromDestCoords(player, shortestCoords);
    }
}

function sortCoords(coords) {
    return coords.sort((c1, c2) => {
        let c1h = 10000 * c1[0] + c1[1];
        let c2h = 10000 * c2[0] + c2[1];
        if (c1h < c2h) {
            return -1;
        } else if (c1h === c2h) {
            return 0;
        } else {
            return 1;
        }
    });
}

function movePlayer(player, coords) {
    playfield[player.y][player.x] = '.';
    player.y = coords[0];
    player.x = coords[1];
    playfield[player.y][player.x] = player;
    return player;
}

function cleanPlayfield() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            let square = playfield[y][x];
            if (Number(square) > 0 || square === '!') {
                playfield[y][x] = '.';
            }
        }
    }
}
