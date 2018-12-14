// A fine application for a double-linked list ring

class Node {
    constructor(value, prev, next) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }

    print(endNode) {
        let node = this;
        let str = String(node.value);
        while (node !== endNode) {
            node = node.next;
            str += String(node.value);
        }
        console.log(str);
    }
}

let globals = {
    counter: 2
};

let size = 640441,
    plusRecps = 10, // +10 for the next 10 after
    startNode,
    endNode,
    nrOfElves = 2,
    elvesPosition = new Array(nrOfElves);

// init: create the two already known nodes, form a linked ring:
startNode = new Node(3, null, null);
endNode = new Node(7, startNode, startNode);
startNode.next = endNode;
startNode.prev = endNode;

elvesPosition[0] = startNode;
elvesPosition[1] = endNode;

let search = String(size)
    .split('')
    .map(Number); // for 2018
let part1done = false;

while (true) {
    // while (globals.counter < size + plusRecps) {
    endNode = createNewRec(startNode, endNode, elvesPosition, globals);
    moveElves(elvesPosition);

    // Part 1: recipes score:
    if (!part1done && globals.counter >= size + plusRecps) {
        let sum = createScore(startNode, size, plusRecps);
        console.log(`Day 14: Recipes score after ${size} recipes (Solution 1): ${sum}`);
        part1done = true;
    }

    // part 2: search pattern:
    let sequenceIndex = searchSequence(endNode, search);
    if (sequenceIndex) {
        console.log(`Found sequence at: ${sequenceIndex}`);
        break;
    }
}

function createNewRec(startNode, endNode, elvesPosition) {
    let val = String(elvesPosition[0].value + elvesPosition[1].value).split('');
    let node = null;
    for (let i = 0; i < val.length; i++) {
        node = new Node(Number(val[i]), endNode, endNode.next);
        endNode.next = node;
        startNode.prev = node;
        endNode = node;
        globals.counter++;
    }

    return node; // new end node
}

function moveElves(elvesPosition) {
    for (let i = 0; i < elvesPosition.length; i++) {
        let node = elvesPosition[i];
        for (let m = 0; m < 1 + elvesPosition[i].value; m++) {
            node = node.next;
        }
        elvesPosition[i] = node;
    }
}

function createScore(startNode, sumStart, sumLength) {
    let node = startNode;
    let res = '';
    while (sumStart > 0) {
        sumStart--;
        node = node.next;
    }
    while (sumLength > 0) {
        sumLength--;
        res += String(node.value);
        node = node.next;
    }
    return res;
}

function searchSequence(endNode, sequence) {
    let node = endNode;
    let search = sequence[sequence.length - 1];
    let counter = globals.counter;

    // back until we found the last number in the sequence (working backwards through it):
    while (node.value !== search && node !== endNode.next) {
        counter--;
        node = node.prev;
    }
    if (node.value !== search) {
        return null;
    }
    // ok, start found, now look back until we have worked through the sequence backwards:
    for (let i = sequence.length - 1; i >= 0; i--) {
        if (node.value !== sequence[i]) {
            return false;
        }
        node = node.prev;
        counter--;
    }
    return counter;
}
