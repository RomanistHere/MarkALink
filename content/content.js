const loopThorugh = (links, data) => {
    console.log(data)
    links.forEach(item => {
        const url = item.href
        if (url in data) {
            if (data[url] === 'block') {
                item.classList.remove('NotaWay__marked')
                item.classList.add('NotaWay__blocked')
            } else if (data[url] === 'mark') {
                item.classList.remove('NotaWay__blocked')
                item.classList.add('NotaWay__marked')
            } else if (data[url] === 'show') {
                item.classList.remove('NotaWay__marked', 'NotaWay__blocked')
            }
        }
    })
}

const init = async () => {
    const data = await getData()
    const links = document.querySelectorAll('a')

    loopThorugh(links, data)
}

init()

const debInit = debounce(init, 300)
const domObserver = new MutationObserver(mutations => {
    debInit()
})

domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// from options
	if (request === 'updated') {
		debInit()
	}
	// // from popup
	// if (request.notesShouldWork != null) {
	// 	request.notesShouldWork ? startUpd() : removeAll()
	// }

	return true
})
