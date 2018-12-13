let fs = require('fs');

let track = fs
    .readFileSync('./day-13-input.txt', { encoding: 'UTF-8' })
    // .readFileSync('./day-13-input-small.txt', { encoding: 'UTF-8' })
    .split('\n')
    .map(line => line.split(''));
let cars = {};
let nextDir = {
    l: 's',
    s: 'r',
    r: 'l',

    '^l': '<',
    '^s': '^',
    '^r': '>',

    '>l': '^',
    '>s': '>',
    '>r': 'v',

    vl: '>',
    vs: 'v',
    vr: '<',

    '<l': 'v',
    '<s': '<',
    '<r': '^',

    '^/': '>',
    '^\\': '<',

    '>/': '^',
    '>\\': 'v',

    'v/': '<',
    'v\\': '>',

    '</': 'v',
    '<\\': '^'
};

// Build car map and remove from tracks:
for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
        let char = track[y][x];
        if (char === '^' || char === '>' || char === 'v' || char === '<') {
            let car = {
                x,
                y,
                dir: char,
                nextDir: 'l'
            };
            cars[Number(carHash(car))] = car;
            if (char === '>' || char === '<') {
                track[y][x] = '-';
            } else if (char === '^' || char === 'v') {
                track[y][x] = '|';
            }
        }
    }
}

let tick = 0;
let newCars;
let firstCrashDone = false;

// print(cars, track);

outer: while (true) {
    newCars = {}; // empty newCar hash, to check colissions later

    // move cars: get cars in the correct order:
    let carKeys = Object.keys(cars)
        .map(k => Number(k))
        .sort();
    for (let k = 0; k < carKeys.length; k++) {
        if (!cars[carKeys[k]]) {
            continue;
        }
        let car = moveCar(cars[carKeys[k]], track, nextDir);
        delete cars[carKeys[k]];
        let crashCars = checkCrash(car, newCars, cars);
        if (crashCars) {
            if (!firstCrashDone) {
                console.log(`Day 13: Car crash at (Solution 1): ${crashCars.a.x},${crashCars.a.y}`);
                firstCrashDone = true;
                // break outer;
            }
            delete cars[carHash(crashCars.a)];
            delete cars[carHash(crashCars.b)];
            delete newCars[carHash(crashCars.a)];
            delete newCars[carHash(crashCars.b)];
        } else {
            newCars[carHash(car)] = car;
        }
    }
    if (Object.keys(newCars).length === 1) {
        let car = newCars[Object.keys(newCars)[0]];
        console.log(`Day 13: Final location of last remaining car: ${car.x},${car.y}`)
        console.log(car);break;
    }
    cars = newCars;
    // print(cars, track);
}

function carHash(car) {
    return 10000 * car.y + car.x;
}

function moveCar(car, track, nextDir) {
    switch (car.dir) {
        case '^':
            car.y--;
            break;
        case '>':
            car.x++;
            break;
        case 'v':
            car.y++;
            break;
        case '<':
            car.x--;
            break;
    }
    let char = track[car.y][car.x];
    if (char === '/' || char === '\\') {
        car.dir = nextDir[car.dir + char];
    }
    if (char === '+') {
        car.dir = nextDir[car.dir + car.nextDir];
        car.nextDir = nextDir[car.nextDir];
    }
    return car;
}

function checkCrash(car, newCars, oldCars) {
    let crashCars = null;
    let h = Number(carHash(car));
    if ((oldCars[h] && oldCars[h] !== car) || (newCars[h] && newCars[h] !== car)) {
        crashCars = {a: car, b: oldCars[h] || newCars[h]};
    }
    return crashCars;
}

function print(cars, track) {
    track = JSON.parse(JSON.stringify(track));
    Object.keys(cars).forEach(k => {
        let car = cars[k];
        track[car.y][car.x] = car.dir;
    });
    let str = track.map(line => line.join('')).join('\n');
    console.log(str);
    console.log(cars);
}
