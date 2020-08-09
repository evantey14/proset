const comparePlayers = (a, b) => (a.name > b.name ? 1 : -1); // alphabetize players by name

const togglePresence = function (array, element) {
  /* If array contains element, remove it, otherwise add it to the array. */
  if (array.includes(element)) {
    return array.filter((el) => el !== element);
  } else {
    return [...array, element];
  }
};

const intToBinaryArray = (i, length) =>
  i
    .toString(2)
    .padStart(length, "0")
    .split("")
    .map((s) => s === "1");

const isValidSet = (cards) =>
  !cards.includes(0) && cards.reduce((acc, cur) => acc ^ cur) === 0;

const findSet = function (cards) {
  for (let i = 1; i < 128; i++) {
    const cardsPresent = intToBinaryArray(i, 7);
    const guess = cards.filter((c, index) => cardsPresent[index]);
    if (isValidSet(guess)) {
      return guess;
    }
  }
};

export { comparePlayers, findSet, intToBinaryArray, togglePresence };
