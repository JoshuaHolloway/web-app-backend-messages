function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// randomIntFromInterval(1e2, 1e4); // [$1, $100]

// ==============================================

const randIntFromIntervalExcluding = ({
  min,
  max,
  exclude,
}: {
  min: number;
  max: number;
  exclude: number;
}) => {
  let current = exclude;
  while (current === exclude) {
    current = randomIntFromInterval(min, max);
  }
  return current;
};

// ==============================================

function randomIntFromIntervalOrNull(min: number, max: number) {
  const rand1 = randomIntFromInterval(min, max);
  const rand2 = randomIntFromInterval(min, max);

  if (rand1 === rand2) {
    return null;
  }
  return rand1;
}
// randomIntFromInterval(1e2, 1e4); // [$1, $100]

// ==============================================

const randBoolean = () => {
  return randomIntFromInterval(0, 1) === 1 ? true : false;
};

// ==============================================

export {
  randomIntFromInterval,
  randomIntFromIntervalOrNull,
  randIntFromIntervalExcluding,
  randBoolean,
};
