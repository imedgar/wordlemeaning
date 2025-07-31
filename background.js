/**
 * Listens for messages from content scripts to open dictionary URLs
 */
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  let message = {};
  try {
    if (request?.type === "open_url") {
      openTab(request.url);
      message = { message: `tab created: ${request.url}` }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    message = { error: error.message }
  }
  sendResponse(message);
});

/**
 * Opens a new tab with the specified URL
 * @param {string} url - The URL to open
 */
function openTab(url) {
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL provided to openTab:', url);
    return;
  }

  chrome.tabs.create({
    url: url,
  });
}
