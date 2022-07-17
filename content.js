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

let attemptedWord = [];
let whichTry = 0;

checkIsResolved();

function checkIsResolved() {
  let letters = document.querySelectorAll(`*[class^="${DOM.resolvedClass}"]`);

  for (let i = 0; i < letters.length; i++) {
    let letterState = letters[i].attributes["data-state"].nodeValue;

    // dont check if it is not sent yet
    if (dontCheck.includes(letterState)) {
      attemptedWord = [];
      setTimeout(checkIsResolved, 3000);
      return;
    }

    if (letterState === STATE.correct) {
      attemptedWord.push(letters[i].innerText);
      // solved
      if (attemptedWord.length === 5) {
        console.log("solved!! " + attemptedWord.join(""));
        whatDoesItMean(attemptedWord.join(""));
        return;
      }
      // it's a new try (new row...)
      if ((i + 1) % 5 === 0) {
        attemptedWord = [];
      }
    } else {
      attemptedWord = [];
    }
  }

  if (!checkIsRevealed() && !checkWordleComplete()) {
    setTimeout(checkIsResolved, 5000);
  }  
}

function checkIsRevealed() {
  let isRevealed = document.querySelectorAll(
    `*[class^="${DOM.revealedClass}"]`
  );

  if (isRevealed.length > 0) {
    whatDoesItMean(isRevealed[0].innerText);
    return true;
  }
  return false;
}

function checkWordleComplete() {
  let isComplete = document.querySelectorAll(`*[class^="${DOM.statsClass}"]`);

  return isComplete.length > 0;
}

function whatDoesItMean(word) {
  chrome.runtime.sendMessage(
    {
      url: CONFIG.dictionaryUrl.concat(word).toLowerCase(),
      type: "open_url",
    },
    () => {}
  );
}
