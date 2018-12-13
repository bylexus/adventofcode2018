/*
let initialState = '#..#.#..##......###...###';
let rules = {
    '...##': '#',
    '..#..': '#',
    '.#...': '#',
    '.#.#.': '#',
    '.#.##': '#',
    '.##..': '#',
    '.####': '#',
    '#.#.#': '#',
    '#.###': '#',
    '##.#.': '#',
    '##.##': '#',
    '###..': '#',
    '###.#': '#',
    '####.': '#'
};
*/
let initialState =
    '##...#......##......#.####.##.#..#..####.#.######.##..#.####...##....#.#.####.####.#..#.######.##...';
let rules = {
    '#####': '#',
    '###.#': '#',
    '##..#': '#',
    '##...': '#',
    '#.###': '#',
    '#.##.': '#',
    '#..##': '#',
    '#...#': '#',
    '.####': '#',
    '.###.': '#',
    '.##.#': '#',
    '.##..': '#',
    '.#.#.': '#',
    '.#..#': '#',
    '.#...': '#',
    '...##': '#'
};

let sol1 = growPlantsForGenerations(initialState, rules, 20);
console.log(`Day 12: Sum of plants after 20 generations (Solution 1): ${sol1}`);


// Hmmm.... 50'000'000'000 take ways too long to examine... so is there a pattern?
// yes, indeed! The added sum to each generation stays at 51 after 98 generations!
// so I only grow the first 150 gens - the rest is just math:
let sol2 = growPlantsForGenerations(initialState, rules, 150) + (50000000000 - 150) * 51;
console.log(`Day 12: Sum of plants after 50000000000 generations (Solution 2): ${sol2}`);
// console.log('Day 12, solution 2: sorry, not yet done: searching for faster solution');

function growPlantsForGenerations(initialState, rules, generations) {
    let zeroIndex = 0;

    let lastSum = 0;

    let prevState = null,
        state = initialState;
    for (let generation = 1; generation <= generations; generation++) {
        // 1: append/prepend enough empty places:
        let firstPlantIndex = state.indexOf('#');
        zeroIndex = firstPlantIndex < 5 ? (zeroIndex += 5 - firstPlantIndex) : zeroIndex;
        state = appendEmpty(state);
        prevState = state;

        // 2: calc new generation:
        for (let i = 2; i < state.length - 2; i++) {
            let plant = growPlant(prevState, i, rules);
            state = state.substr(0, i) + plant + state.substr(i + 1);
        }

        // pattern searching in sum per generation:
        // console.log(`${generation}:`, state, zeroIndex);
        // let sum = sumPlants(state, zeroIndex);
        // console.log("sum plants after generation ",generation,sum);
        // console.log("sum diff to last gen: ",sum-lastSum);
        // lastSum=sum;
    }

    return sumPlants(state, zeroIndex);
}

function appendEmpty(state) {
    let start = state.indexOf('#');
    let end = state.length - state.lastIndexOf('#') - 1;
    if (start < 5 && start > -1) {
        state = repeatStr('.', 5 - start) + state;
    }
    if (end < 5 && end > -1) {
        state = state + repeatStr('.', 5 - end);
    }
    return state;
}

function repeatStr(str, count) {
    let res = '';
    while (count > 0) {
        res += str;
        count--;
    }
    return res;
}

function growPlant(state, index, rules) {
    let plants = state.substr(index - 2, 5);
    return rules[plants] || '.';
}

function sumPlants(plants, zeroIndex) {
    let sum = 0;
    for (let i = 0; i < plants.length; i++) {
        if (plants[i] === '#') {
            sum += i - zeroIndex;
        }
    }
    return sum;
}
