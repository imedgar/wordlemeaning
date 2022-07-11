const CONFIG = {
  dictionaryUrl: "https://www.dictionary.com/browse/",
  revealedClass: "Toast-module_toast",
  statsClass: "Stats-module_gameStats",
  resolvedClass: "Tile-module_tile",
};

const values = {
  genius: "genius",
  magnificent: "magnificent",
  impressive: "impressive",
  splendid: "splendid",
  great: "great",
  phew: "phew",
};

let word = [];

execute();

function execute() {
  checkIsResolved();
  checkIsRevealed();
}

function checkIsResolved() {
  if (checkIsDone()) {
    return;
  }

  let guesses = document.querySelectorAll(
    `*[class^="${CONFIG.resolvedClass}"]`
  );
  let counter = 0;

  for (let i = 0; i < guesses.length; i++) {
    if (counter === 5) {
      console.log("resolved!");
      whatDoesItMean(word.join(""));
      return;
    }
    if (guesses[i].attributes["data-state"].nodeValue === "correct") {
      counter++;
      word.push(guesses[i].innerText);
    } else {
      counter = 0;
      word = [];
    }
  }
  setTimeout(checkIsResolved, 5000);
}

function checkIsRevealed() {
  if (checkIsDone()) {
    return;
  }

  let isRevealed = document.querySelectorAll(
    `*[class^="${CONFIG.revealedClass}"]`
  );
  if (isRevealed.length !== 0) {
    console.log("revealed!");
    whatDoesItMean(isRevealed[0].innerText);
  } else {
    setTimeout(checkIsRevealed, 3000);
  }
}

function checkIsDone() {
  let isRevealed = document.querySelectorAll(
    `*[class^="${CONFIG.statsClass}"]`
  );
  return isRevealed.length !== 0;
}

function whatDoesItMean(word) {
  console.log(`the word is ${word}, will open a new tab in 3 sec.`);
  setTimeout(openNewTab, 3000, CONFIG.dictionaryUrl.concat(word));
}

function openNewTab(url) {
  window.open(url, "_blank").focus();
  //chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
}
