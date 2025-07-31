/**
 * Initialize settings when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('dictionary', (data) => {
    try {
      if (data?.dictionary) {
        const element = document.querySelector(`#${data.dictionary}`);
        if (element) {
          element.checked = true;
        }
      }
    } catch (error) {
      console.error('Error loading dictionary setting:', error);
    }
  });
});

/**
 * Set up event listeners for dictionary selection
 */
const dictionaryRadios = document.querySelectorAll('input[name="dictionary"]');
dictionaryRadios.forEach((radio) => {
  radio.addEventListener('click', () => {
    try {
      const selectedDictionary = document.querySelector('input[name="dictionary"]:checked');
      if (selectedDictionary) {
        const dictionaryValue = selectedDictionary.value;
        chrome.storage.sync.set({ dictionary: dictionaryValue }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving dictionary setting:', chrome.runtime.lastError);
            showStatusMessage('Error saving setting', 'error');
          } else {
            showStatusMessage('Saved', 'success');
          }
        });
      }
    } catch (error) {
      console.error('Error handling dictionary selection:', error);
    }
  });
});

/**
 * Shows a status message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showStatusMessage(message, type) {
  const statusElement = document.getElementById('status-message');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = type === 'success' ? '#02f002' : '#dc3545';
    statusElement.style.display = 'block';

    // Hide message after 3 seconds
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

