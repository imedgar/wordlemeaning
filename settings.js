document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('dictionary', (data) => {
    if (data?.dictionary) {
      document.querySelector(`#${data.dictionary}`).checked = true;
    }
  });
});

const dictionaryRadios = document.querySelectorAll('input[name="dictionary"]');
dictionaryRadios.forEach((radio) => {
  radio.addEventListener('click', () => {
    const selectedDictionary = document.querySelector('input[name="dictionary"]:checked');
    if (selectedDictionary) {
      const dictionaryValue = selectedDictionary.value;
      chrome.storage.sync.set({ dictionary: dictionaryValue }, () => { });
    }
  });
});

