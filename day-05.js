let fs = require('fs');
let input = fs.readFileSync('./day-05-input.txt', {encoding: 'UTF-8'}).trim();

console.log(`Day 5: Input chain size: ${input.length}`);

let output = reducePolymer(input);

console.log(`Day 5: Remaining chain size (Solution 1): ${output.length}`);

// ------------- Part two ----------------------
let unitTypes = 'abcdefghijklmnopqrstuvwxyz';
let minLength = output.length;
let minType = null;
for (let i = 0; i < unitTypes.length; i++) {
    let type = unitTypes[i];
    let remainingChain = output.replace(new RegExp(type,'gi'), '');
    let reducedChain = reducePolymer(remainingChain);
    if (reducedChain.length < minLength) {
        minLength = reducedChain.length;
        minType = type;
    }
}

console.log(`Day 5: Shortest chain length by reducing '${minType}/${minType.toUpperCase()}' (Solution 2): ${minLength}`)


function reducePolymer(input) {
  let repeat = true;
  let index = 0;
  while (repeat) {
    repeat = false;
    index = 0;
    while (index < input.length - 1) {
      // distance between upper and lower case char code: 32 (e.g. "A" = 65, "a" = 97)
      if (
        Math.abs(input.charCodeAt(index) - input.charCodeAt(index + 1)) === 32
      ) {
        input = input.slice(0, index) + input.slice(index + 2);
        repeat = true;
      } else {
        index += 1;
      }
    }
  }
  return input;
}
