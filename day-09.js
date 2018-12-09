// Marble Ring Problem
// This would be a great application of a linked (ring) list, but I do it with arrays,
// as I'm too lazy to implement a linked list handling right now.

let inputsTest = {
    ring: [0],
    ringIndex: 0,
    player: 0,
    nrOfPlayers: 9,
    playerScores: new Array(9),
    maxScore: 0,
    maxScoreIndex: -1,
    marbleMax: 25,
    marble: 1
};

let inputsSolution1 = {
    ring: [0],
    ringIndex: 0,
    player: 0,
    nrOfPlayers: 447,
    playerScores: new Array(447),
    maxScore: 0,
    maxScoreIndex: -1,
    marbleMax: 71510,
    marble: 1
};

let inputsSolution2 = {
    ring: [0],
    ringIndex: 0,
    player: 0,
    nrOfPlayers: 447,
    playerScores: new Array(447),
    maxScore: 0,
    maxScoreIndex: -1,
    marbleMax: 71510 * 100,
    marble: 1
};

let outputTest = playMarbleGame(inputsTest);
console.log(`Day 9: Highest player score (Sample): ${outputTest.maxScore} from Player ${outputTest.maxPlayerIndex + 1}`);

let output1 = playMarbleGame(inputsSolution1);
console.log(`Day 9: Highest player score (Solution 1): ${output1.maxScore} from Player ${output1.maxPlayerIndex + 1}`);

function playMarbleGame(inputs) {
    let { ring, ringIndex, player, nrOfPlayers, playerScores, maxScore, maxScoreIndex, marbleMax, marble } = inputs;
    let solution = { maxScore: 0, maxPlayerIndex: -1 };

    while (marble <= marbleMax) {
        if (marble % 23 > 0) {
            ringIndex = calcIndex(ringIndex + 1, ring);
            ring = insertAfter(ringIndex, marble, ring);
            ringIndex = calcIndex(ringIndex + 1, ring);
        } else {
            let removeIndex = calcIndex(ringIndex - 7, ring);
            playerScores[player] = (playerScores[player] || 0) + marble + ring[removeIndex];
            if (playerScores[player] > maxScore) {
                maxScore = playerScores[player];
                maxScoreIndex = player;
            }
            ring = removeAt(removeIndex, ring);
            ringIndex = removeIndex;
        }
        marble++;
        player = (player + 1) % nrOfPlayers;
    }
    return {maxScore, maxPlayerIndex: maxScoreIndex};
}

/**
 * inserts a value at the given index.
 * The array is taken as a ring, so if index >= length, it wraps around.
 *
 * @return array The new array
 */
function insertAfter(index, value, arr) {
    let ix = calcIndex(index, arr) + 1;
    return arr.slice(0, ix).concat([value], arr.slice(ix));
}

/**
 * removes a value at the given index.
 * The array is taken as a ring, so if index >= length, it wraps around.
 *
 * @return array The new array
 */
function removeAt(index, arr) {
    let ix = calcIndex(index, arr);
    return arr.slice(0, ix).concat(arr.slice(ix + 1));
}

/**
 * calculates the "ring" position of the given index:
 * If index is >= arr.length, it wraps around
 *
 * @return int new index, wrapped around if needed
 */
function calcIndex(index, arr) {
    let ix = index % arr.length;
    if (ix < 0) {
        return arr.length + ix;
    } else {
        return ix;
    }
}
