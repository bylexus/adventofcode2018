let input = [
  'Step V must be finished before step H can begin.',
  'Step U must be finished before step R can begin.',
  'Step E must be finished before step D can begin.',
  'Step B must be finished before step R can begin.',
  'Step W must be finished before step X can begin.',
  'Step A must be finished before step P can begin.',
  'Step T must be finished before step L can begin.',
  'Step F must be finished before step C can begin.',
  'Step P must be finished before step Y can begin.',
  'Step N must be finished before step G can begin.',
  'Step R must be finished before step S can begin.',
  'Step D must be finished before step C can begin.',
  'Step O must be finished before step K can begin.',
  'Step L must be finished before step J can begin.',
  'Step J must be finished before step H can begin.',
  'Step M must be finished before step I can begin.',
  'Step G must be finished before step K can begin.',
  'Step Z must be finished before step Q can begin.',
  'Step X must be finished before step Q can begin.',
  'Step H must be finished before step I can begin.',
  'Step K must be finished before step Y can begin.',
  'Step Q must be finished before step S can begin.',
  'Step I must be finished before step Y can begin.',
  'Step S must be finished before step Y can begin.',
  'Step C must be finished before step Y can begin.',
  'Step T must be finished before step S can begin.',
  'Step P must be finished before step S can begin.',
  'Step I must be finished before step S can begin.',
  'Step V must be finished before step O can begin.',
  'Step O must be finished before step Q can begin.',
  'Step T must be finished before step R can begin.',
  'Step E must be finished before step J can begin.',
  'Step F must be finished before step S can begin.',
  'Step O must be finished before step H can begin.',
  'Step Z must be finished before step S can begin.',
  'Step D must be finished before step Z can begin.',
  'Step F must be finished before step K can begin.',
  'Step W must be finished before step P can begin.',
  'Step G must be finished before step I can begin.',
  'Step B must be finished before step T can begin.',
  'Step G must be finished before step Y can begin.',
  'Step X must be finished before step S can begin.',
  'Step B must be finished before step K can begin.',
  'Step V must be finished before step A can begin.',
  'Step U must be finished before step N can begin.',
  'Step T must be finished before step P can begin.',
  'Step V must be finished before step D can begin.',
  'Step G must be finished before step X can begin.',
  'Step B must be finished before step D can begin.',
  'Step R must be finished before step J can begin.',
  'Step M must be finished before step Z can begin.',
  'Step U must be finished before step Z can begin.',
  'Step U must be finished before step G can begin.',
  'Step A must be finished before step C can begin.',
  'Step H must be finished before step Q can begin.',
  'Step X must be finished before step K can begin.',
  'Step B must be finished before step S can begin.',
  'Step Q must be finished before step C can begin.',
  'Step Q must be finished before step Y can begin.',
  'Step R must be finished before step I can begin.',
  'Step V must be finished before step Q can begin.',
  'Step A must be finished before step D can begin.',
  'Step D must be finished before step S can begin.',
  'Step K must be finished before step S can begin.',
  'Step G must be finished before step C can begin.',
  'Step D must be finished before step O can begin.',
  'Step R must be finished before step H can begin.',
  'Step K must be finished before step Q can begin.',
  'Step W must be finished before step R can begin.',
  'Step H must be finished before step Y can begin.',
  'Step P must be finished before step J can begin.',
  'Step N must be finished before step Z can begin.',
  'Step J must be finished before step K can begin.',
  'Step W must be finished before step M can begin.',
  'Step A must be finished before step Z can begin.',
  'Step V must be finished before step W can begin.',
  'Step J must be finished before step X can begin.',
  'Step U must be finished before step F can begin.',
  'Step P must be finished before step L can begin.',
  'Step W must be finished before step G can begin.',
  'Step T must be finished before step F can begin.',
  'Step R must be finished before step C can begin.',
  'Step R must be finished before step O can begin.',
  'Step Z must be finished before step C can begin.',
  'Step E must be finished before step S can begin.',
  'Step L must be finished before step I can begin.',
  'Step U must be finished before step O can begin.',
  'Step W must be finished before step K can begin.',
  'Step K must be finished before step I can begin.',
  'Step O must be finished before step M can begin.',
  'Step V must be finished before step M can begin.',
  'Step V must be finished before step Z can begin.',
  'Step A must be finished before step I can begin.',
  'Step F must be finished before step J can begin.',
  'Step F must be finished before step O can begin.',
  'Step M must be finished before step C can begin.',
  'Step Q must be finished before step I can begin.',
  'Step H must be finished before step S can begin.',
  'Step U must be finished before step A can begin.',
  'Step J must be finished before step S can begin.',
  'Step P must be finished before step Z can begin.',
];

// Hash map problem. Map an array for each char (key), that contains all steps that need to be executed BEFORE that step.
// Then, begin removing those keyes that have no dependants, and remove those from all arrays, too. Then, repeat, until no key is left.
let dependants = {};

let matcher = new RegExp('Step ([a-zA-Z]+) .* before step ([a-zA-Z]+)');
input.forEach(line => {
  let match = line.match(matcher);
  if (match) {
    let prevStep = match[1],
      dependantStep = match[2];

    if (!dependants[dependantStep]) {
      dependants[dependantStep] = [];
    }
    if (!dependants[prevStep]) {
      dependants[prevStep] = [];
    }
    // Keep info on dependant steps for that step:
    dependants[dependantStep].push(prevStep);
  }
});

// Now, begin to reduce steps, for Part 1:
let stepsInOrder = [];
let dependantsPart1 = Object.assign({}, dependants);
while (Object.keys(dependantsPart1).length > 0) {
  let nextStep = executeNextStep(dependantsPart1);
  if (nextStep) {
    stepsInOrder.push(nextStep);
  } else {
    break;
  }
}

console.log(`Day 7, Steps in order (Solution 1): ${stepsInOrder.join('')}`);

// ------------ Part 2 -------------------
/**
 * Idea:
 * Each worker is stored with the following info:
 * - which part he is working on
 * - when is he finished (second he will be done, or, in other words, the LAST second he is working on the part)
 * - If he is free, then the part is NULL
 *
 * We increase seconds, and check each worker. As soon as one is free, we fetch the next free step to work on, until no one is left.
 */

let workers = [
  {part: null, endTime: null},
  {part: null, endTime: null},
  {part: null, endTime: null},
  {part: null, endTime: null},
  {part: null, endTime: null},
];

stepsInOrder = [];
let dependantsPart2 = Object.assign({}, dependants);
let second = 0;
while (true) {
  workers.forEach(worker => {
      if (second > worker.endTime) {
        stepsInOrder.push(worker.part);
        removeStep(dependantsPart2, worker.part, true);
        worker.part = null;
        worker.endTime = null;
      }

    if (worker.part === null) {
      let nextStep = executeNextStep(dependantsPart2, false);
      if (nextStep) {
        worker.part = nextStep;
        worker.endTime = second + 60 + nextStep.charCodeAt(0) - 64 - 1;
        // worker.endTime = second + nextStep.charCodeAt(0) - 64 - 1;
      }
    }

  });
  if (workers.filter(w => w.part !== null).length === 0 && Object.keys(dependantsPart2).length === 0) {
    break;
  } else {
    second++;
  }
}
second--;

console.log(`Day 7: Time needed with 5 workers (Solution 2): ${second}, part order: ${stepsInOrder.join('')}`);

function executeNextStep(dependants, removeFromDependants = true) {
  let freeStep = findFreeStep(dependants);
  if (freeStep) {
    removeStep(dependants, freeStep, removeFromDependants);
    return freeStep;
  }
}

function findFreeStep(dependants) {
  let keys = Object.keys(dependants).sort();
  for (let i = 0; i < keys.length; i++) {
    if (dependants[keys[i]].length === 0) {
      return keys[i];
    }
  }
  return null;
}

function removeStep(dependants, step, removeFromDependants = true) {
  let keys = Object.keys(dependants);
  if (removeFromDependants) {
    keys.forEach(key => {
      dependants[key] = dependants[key].filter(item => item !== step);
    });
  }
  delete dependants[step];
  return dependants;
}
