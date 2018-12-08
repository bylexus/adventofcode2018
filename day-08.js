let fs = require('fs');
let input = fs
    // .readFileSync('./day-08-input-small.txt', { encoding: 'UTF-8' })
    .readFileSync('./day-08-input.txt', { encoding: 'UTF-8' })
    .trim()
    .split(/\s+/)
    .map(n => Number(n));

// Input is organized as follows:
//
// - nr of child nodes
// - nr of meta data entries
// - child nodes (as stated by nr of childs)
// - meta data entries (as stated by nr of childs)
//
// Step 1: Organize the tree
class Node {
    constructor() {
        this.childCount = 0;
        this.metaCount = 0;
        this.childs = [];
        this.meta = [];
    }
    sumCombinedMeta() {
        return this.sumMeta() + this.childs.map(child => child.sumCombinedMeta()).reduce((acc, curr) => acc + curr, 0);
    }
    sumMeta() {
        return this.meta.reduce((acc, curr) => acc + curr, 0);
    }
    calcValue() {
        if (this.childCount === 0) {
            return this.sumMeta();
        } else {
            let sum = 0;
            this.meta.forEach(childNr => {
                let index = childNr - 1;
                if (index >= 0 && index < this.childs.length) {
                    sum += this.childs[index].calcValue();
                }
            });
            return sum;
        }
    }
    print() {
        console.log(`Node: childs: ${this.childCount}, meta: ${this.metaCount}`);
        for (let i = 0; i < this.childCount; i++) {
            this.childs[i].print();
        }
        console.log(` Meta: ${this.meta.join(' ')}`);
    }
}

// Process input, recursively
let node = new Node();
node.childCount = input[0];
node.metaCount = input[1];
processChildNodes(input, 2, node);
console.log(`Day 8: Meta data sum (Solution 1): ${node.sumCombinedMeta()}`);
console.log(`Day 8: Value of root node (Solution 2): ${node.calcValue()}`);

function processChildNodes(input, startIndex, rootNode) {
    for (let i = 0; i < rootNode.childCount; i++) {
        let childNode = new Node();
        childNode.childCount = input[startIndex];
        childNode.metaCount = input[startIndex + 1];
        rootNode.childs.push(childNode);
        startIndex = processChildNodes(input, startIndex + 2, childNode);
    }
    for (let m = 0; m < rootNode.metaCount; m++) {
        rootNode.meta.push(input[startIndex]);
        startIndex++;
    }
    return startIndex;
}
