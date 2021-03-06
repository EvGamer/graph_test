export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min;
}

export function shuffleRange(min, max) {
  const length = max - min + 1;
  const sequence = [];
  sequence.length = length

  for (let value = min; value <= max; value++) {
    let isSet = false;
    let i = randomInt(0, length);

    while (!isSet) {
      if (sequence[i] == null) {
        sequence[i] = value;
        isSet = true;
      }
      i = (i + 1) % length;
    }
  }
  return sequence;
}

export function fillEveryKeyWithValue(keys, value) {
  const object = {};
  for (let key of keys) {
    object[key] = value;
  }
  return object;
}

function *toIterator(sequence) {
  for (let elem of sequence) {
    yield elem;
  }
}

export function delayedLoop(delay, sequence, callback) {
  const iter = toIterator(sequence);
  const interval = setInterval(() => {
    const nxt = iter.next();
    const { value, done } = nxt;
    if (done) clearInterval(interval);
    else callback(value);
  }, delay)
}

export const delay = (duration) => new Promise((resolve) => setTimeout(() => resolve(), duration));

export function makeConnectionHandler(onTarget, onSource) {
  let source = null;
  return function twoNodesHandler(event) {
    if (!source) {
      source = event.target;
      if (onSource) onSource(event);
      return;
    }
    onTarget(source, event.target, event);
  }
}