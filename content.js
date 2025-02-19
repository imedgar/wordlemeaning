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
  correct: "correct",
  empty: "empty",
};

const dontCheck = [STATE.tbd, STATE.empty];

let attemptedWord = "";
let lastWord = "";

function pollWordle() {
  const currentWord = getCurrentResolvedWord();

  if (currentWord && currentWord !== lastWord) {
    lastWord = currentWord;
    if (currentWord.length === 5) {
      console.log("Solved: " + currentWord);
      openDictionary(currentWord);
      return;
    }
  }

  if (isRevealed()) {
    return;
  }

  if (isWordleComplete()) {
    console.log("Wordle is complete.");
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
    const letterState = letterEl.getAttribute("data-state");

    if (dontCheck.includes(letterState)) {
      return "";
    }

    if (letterState === STATE.correct) {
      word += letterEl.innerText;
    } else {
      return "";
    }

    if ((i + 1) % 5 === 0 && word.length === 5) {
      return word;
    }
  }
  return "";
}

function isRevealed() {
  const revealedElements = document.querySelectorAll(`*[class^="${DOM.revealedClass}"]`);
  if (revealedElements.length > 0) {
    console.log("Reveal overlay active: " + revealedElements[0].innerText);
    openDictionary(revealedElements[0].innerText);
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
    () => {
      console.log("Dictionary lookup triggered for:", word);
    }
  );
}

pollWordle();

