const init = async () => {
    const data = await getData()
    const links = document.querySelectorAll('a')
    const { customSettings, pairs, notesOn } = await getStorageDataLocal(['customSettings', 'pairs', 'notesOn'])

    if (notesOn)
        loopThorugh(links, data, customSettings, pairs)
}

const debInit = debounce(init, 300)
const domObserver = new MutationObserver(mutations => {
    debInit()
})

const startUpd = () => {
	init()
	domObserver.observe(document.documentElement, {
	    childList: true,
	    subtree: true
	})
}

startUpd()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // from bg or popup
    if (request.openPopUp === true) {
        initPopUp(request.linkUrl)
        sendResponse({ closePopup: true })
    }
    if (request.addToHide === true) {
        hideByUrl(request.linkUrl)
        sendResponse({ closePopup: true })
    }
	// from options
	if (request === 'updated') {
        removeAll()
		startUpd()
	}
	// from popup
	if (request.notesShouldWork != null) {
		request.notesShouldWork ? startUpd() : removeAll()
	}

	return true
})
