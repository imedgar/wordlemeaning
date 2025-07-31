/**
 * Configuration constants for the Wordle extension
 */
const CONFIG = {
  dictionaryUrl: "https://www.dictionary.com/browse/",
  wordLength: 5,
  pollInterval: 1000,
  dictionaryDelay: 1500,
};

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
];

const invalidStates = [STATE.tbd, STATE.empty, STATE.present, STATE.absent];

let attemptedWord = "";
let pollIntervalId = null;

/**
 * Polls the Wordle game to detect when it's complete and extract the word
 * Handles both win and loss scenarios
 */
function pollWordle() {
  try {
    const currentWord = getCurrentResolvedWord();
    if (currentWord?.length === CONFIG.wordLength) {
      openDictionary(currentWord);
      stopPolling();
      return;
    }
    const revealed = isRevealed();
    if (revealed) {
      openDictionary(revealed);
      stopPolling();
      return;
    }

    if (isWordleComplete()) {
      stopPolling();
      return;
    }
  } catch (error) {
    console.error('Error in pollWordle:', error);
    stopPolling();
  }
}

/**
 * Starts polling the Wordle game for completion
 * Clears any existing polling interval before starting
 */
function startPolling() {
  if (pollIntervalId) {
    clearInterval(pollIntervalId);
  }
  pollIntervalId = setInterval(pollWordle, CONFIG.pollInterval);
}

/**
 * Stops the polling interval and cleans up resources
 */
function stopPolling() {
  if (pollIntervalId) {
    clearInterval(pollIntervalId);
    pollIntervalId = null;
  }
}

/**
 * Extracts the current resolved word from the game tiles
 * @returns {string} The resolved word if found, empty string otherwise
 */
function getCurrentResolvedWord() {
  try {
    const letters = document.querySelectorAll(`*[class^="${DOM.resolvedClass}"]`);
    if (!letters || letters.length === 0) return "";

    let word = "";
    for (let i = 0; i < letters.length; i++) {
      const letterEl = letters[i];
      const letterState = letters[i].getAttribute("data-state");

      // not correct clears the word 
      if (invalidStates.includes(letterState)) {
        word = "";
        continue;
      }

      const letterText = letterEl.innerText?.trim();
      if (letterText) {
        word += letterText;
      }

      // if correct word length achieved, break
      if (word.length === CONFIG.wordLength) {
        break;
      }
      // avoid counting letters from different rows
      if ((i + 1) % CONFIG.wordLength === 0) {
        word = "";
      }
    }
    return word;
  } catch (error) {
    console.error('Error in getCurrentResolvedWord:', error);
    return "";
  }
}

/**
 * Checks if the word has been revealed in a toast notification
 * @returns {string|boolean} The revealed word or false if not revealed
 */
function isRevealed() {
  try {
    const revealedElements = document.querySelectorAll(`*[class^="${DOM.revealedClass}"]`);
    if (revealedElements.length > 0) {
      const revealed = revealedElements[0].innerText?.trim();
      if (!revealed || DONT_REVEAL.includes(revealed)) {
        return false;
      }
      return revealed;
    }
    return false;
  } catch (error) {
    console.error('Error in isRevealed:', error);
    return false;
  }
}

/**
 * Checks if the Wordle game is complete by looking for stats display
 * @returns {boolean} True if game is complete, false otherwise
 */
function isWordleComplete() {
  try {
    const completeElements = document.querySelectorAll(`*[class^="${DOM.statsClass}"]`);
    return completeElements?.length;
  } catch (error) {
    console.error('Error in isWordleComplete:', error);
    return false;
  }
}

/**
 * Opens a dictionary page for the given word in a new tab
 * @param {string} word - The word to look up
 */
function openDictionary(word) {
  try {
    if (!word || typeof word !== 'string') {
      console.error('Invalid word provided to openDictionary:', word);
      return;
    }

    setTimeout(() => {
      chrome.storage.sync.get('dictionary', (data) => {
        try {
          const selectedDictionary = data?.dictionary || 'dictionary';
          const dictionaryFunction = DICT[selectedDictionary];

          if (!dictionaryFunction) {
            console.error('Dictionary function not found for:', selectedDictionary);
            return;
          }

          const url = dictionaryFunction(word.toLowerCase());

          chrome.runtime.sendMessage(
            {
              url: url,
              type: "open_url",
            },
            (_) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
              }
            }
          );
        } catch (error) {
          console.error('Error in storage callback:', error);
        }
      });
    }, CONFIG.dictionaryDelay);
  } catch (error) {
    console.error('Error in openDictionary:', error);
  }
}

// Start polling when content script loads
startPolling();

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
  stopPolling();
});

