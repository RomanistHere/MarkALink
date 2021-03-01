const init = async () => {
    console.log('init')
    const data = await getData()
    const links = document.querySelectorAll('a:not([href="#"])')
    const { customSettings, pairs, notesOn } = await getStorageDataLocal(['customSettings', 'pairs', 'notesOn'])

    if (notesOn)
        loopThorugh(links, data, customSettings, pairs)
}

const debInit = debounce(init, 300)
const domObserver = new MutationObserver(mutations => {
    console.log(mutations)

    // if (mutations[0].addedNodes[0].classList.includes('MarkALink__tooltip')) {
    //     console.log('idle')
    //     return
    // }

    debInit()
})

const startUpd = () => {
    domObserver.disconnect()
	init()
	domObserver.observe(document.documentElement, {
	    childList: true,
	    subtree: true
	})
}

startUpd()

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // from bg or popup
    if (request.openPopUp === true) {
        initPopUp(request.linkUrl)
        sendResponse({ closePopup: true })
    }
    if (request.addToHide === true) {
        hideByUrl(request.linkUrl)
        sendResponse({ closePopup: true })
    }
    if (request.addToHideSite === true) {
        hideByUrl(request.linkUrl)
        sendResponse({ closePopup: true })
    }
    if (request.asideMinimized === true || request.asideMinimized === false) {
        updateAside(request.asideMinimized)
    } else if (request.asideCompleted === true) {
        initAside()
    }

	// from options
	if (request === 'updated' || request.updated === true) {
        removeAll()
		startUpd()
	}
	// from popup
	if (request.notesShouldWork != null) {
		request.notesShouldWork ? startUpd() : removeAll()
	}

	return true
})

const checkIsPageHidden = async () => {
    const { shouldShowNotification } = await getStorageDataLocal('shouldShowNotification')
    if (!shouldShowNotification)
        return

    const data = await getData()
    const pageUrl = window.location.href
    const pureUrl = pageUrl.substring(pageUrl.lastIndexOf("//") + 2, pageUrl.indexOf("/", 8))

    if (pageUrl in data) {
        showNotification('page')
    } else if (pureUrl in data) {
        showNotification('website')
    }
}

checkIsPageHidden()
