chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request?.type === "open_url") {
    openTab(request.url);
    sendResponse({ message: `tab created: ${request.url}` });
  }
});

function openTab(url) {
  chrome.tabs.create({
    url: url,
  });
}
