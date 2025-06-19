const CONFIG = { dictionaryUrl: "https://www.dictionary.com/browse/", };

const DICT = {
  dictionary: (word) => `https://www.dictionary.com/browse/${word}`,
  oxford: (word) => `https://www.oed.com/search/dictionary/?scope=Entries&q=${word}`,
  merriam: (word) => `https://www.merriam-webster.com/dictionary/${word}`,
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

const DONT_REVEAL = [
  "Not in word list",
  "Not enough letters",
]

const dontCheck = [STATE.tbd, STATE.empty, STATE.present, STATE.absent];

let attemptedWord = "";

function pollWordle() {
  const currentWord = getCurrentResolvedWord();
  if (currentWord?.length === 5) {
    openDictionary(currentWord);
    return;
  }
  const revealed = isRevealed();
  if (revealed) {
    openDictionary(revealed);
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
    if (DONT_REVEAL.includes(revealed)) {
      return false;
    }
    return revealed;
  }
  return false;
}

function isWordleComplete() {
  const completeElements = document.querySelectorAll(`*[class^="${DOM.statsClass}"]`);
  return completeElements.length > 0;
}

function openDictionary(word) {
  setTimeout(async () => {
    chrome.storage.sync.get('dictionary', (data) => {
      chrome.runtime.sendMessage(
        {
          url: DICT[data?.dictionary || 'dictionary']?.(word.toLowerCase()),
          type: "open_url",
        },
        () => { }
      );
    });
  }, 1500);
}

pollWordle();

