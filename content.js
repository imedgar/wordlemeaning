const CONFIG = {
  dictionaryUrl: "https://www.dictionary.com/browse/",
};

const DOM = {
  revealedClass: "Toast-module_toast",
  statsClass: "Stats-module_gameStats",
  resolvedClass: "Tile-module_tile",
};

const STATE = {
  tbd: "tbd",
  present: "present",
  correct: "correct",
  empty: "empty",
  absent: "absent",
};

const dontCheck = [STATE.tbd, STATE.empty, STATE.present, STATE.absent];

let attemptedWord = "";

function pollWordle() {
  const currentWord = getCurrentResolvedWord();
  if (currentWord?.length === 5) {
    openDictionary(currentWord);
    return;
  }

  if (isRevealed()) {
    return;
  }

  if (isWordleComplete()) {
    return;
  }

  requestAnimationFrame(pollWordle);
}

function getCurrentResolvedWord() {
  const letters = document.querySelectorAll(`*[class^="${DOM.resolvedClass}"]`);
  if (!letters || letters.length === 0) return "";

  let word = "";
  for (let i = 0; i < letters.length; i++) {
    const letterEl = letters[i];
    const letterState = letters[i].getAttribute("data-state");

    // not correct clears the word 
    if (dontCheck.includes(letterState)) {
      word = "";
      continue;
    }

    word += letterEl.innerText;
    // if 5 correct in a row, it is solved
    if (word.length === 5) {
      break;
    }
    // avoid counting 5 with different rows
    if ((i + 1) % 5 === 0) {
      word = "";
    }
  }
  return word;
}

function isRevealed() {
  const revealedElements = document.querySelectorAll(`*[class^="${DOM.revealedClass}"]`);
  if (revealedElements.length > 0) {
    const revealed = revealedElements[0].innerText;
    if (revealed === "Not in word list") {
      return false;
    }
    openDictionary(revealed);
    return true;
  }
  return false;
}

function isWordleComplete() {
  const completeElements = document.querySelectorAll(`*[class^="${DOM.statsClass}"]`);
  return completeElements.length > 0;
}

function openDictionary(word) {
  chrome.runtime.sendMessage(
    {
      url: CONFIG.dictionaryUrl.concat(word).toLowerCase(),
      type: "open_url",
    },
    () => { }
  );
}

pollWordle();

