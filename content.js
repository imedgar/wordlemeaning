const CONFIG = {
  dictionaryUrl: "https://www.dictionary.com/browse/",
  revealedClass: "Toast-module_toast",
  statsClass: "Stats-module_gameStats",
  resolvedClass: "Tile-module_tile",
};

let word = [];
let revealed = false;

checkIsResolved();

function checkIsResolved() {
  let guesses = document.querySelectorAll(
    `*[class^="${CONFIG.resolvedClass}"]`
  );
  let counter = 0;

  for (let i = 0; i < guesses.length; i++) {
    if (counter === 5) {
      whatDoesItMean(word.join(""));
      return;
    }
    if (guesses[i].attributes["data-state"].nodeValue === "correct") {
      counter++;
      word.push(guesses[i].innerText);
    } else {
      counter = 0;
      word = [];
      checkIsRevealed();
    }
  }
  if (checkIsDone()) {
    return;
  }
  setTimeout(checkIsResolved, 5000);
}

function checkIsRevealed() {
  if (revealed) {
    return;
  }
  let isRevealed = document.querySelectorAll(
    `*[class^="${CONFIG.revealedClass}"]`
  );
  if (isRevealed.length !== 0) {
    revealed = true;
    whatDoesItMean(isRevealed[0].innerText);
  }
}

function checkIsDone() {
  let isRevealed = document.querySelectorAll(
    `*[class^="${CONFIG.statsClass}"]`
  );
  return isRevealed.length !== 0;
}

function whatDoesItMean(word) {
  chrome.runtime.sendMessage(
    {
      url: CONFIG.dictionaryUrl.concat(word).toLowerCase(),
      type: "open_url",
    },
    function (response) {
      console.log(response.message);
    }
  );
}
