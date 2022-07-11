const CONFIG = {
	dictionaryUrl: "https://www.dictionary.com/browse/",
	divClass: "Toast-module_toast"
}

checkIsRevealed();	

function checkIsRevealed() {
	let isRevealed = document.querySelectorAll(`*[class^="${CONFIG.divClass}"]`);
	if (isRevealed.length !== 0) {
		console.log('revealed!');
		whatDoesItMean(isRevealed[0].innerText);
	} else {
		console.log('not solved yet');
		setTimeout(checkIsRevealed, 3000);
	}
}

function whatDoesItMean(word) {
	console.log(`the word is ${word}, will open a new tab in 3 sec.`);
	setTimeout(openNewTab, 
		3000, 
		CONFIG.dictionaryUrl.concat(word));
}

function openNewTab(url) {
	window.open(url, '_blank').focus();
}