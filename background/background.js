import {
	getData,
	syncStore
} from '../modules/helpers.js'

chrome.runtime.onInstalled.addListener(async (details) => {
	const { previousVersion, reason } = details

    if (reason == 'install') {
		chrome.storage.sync.get(['na_1'], resp => {
            if (!resp.it_1) {
                chrome.storage.sync.set({
					na_1: ''
                })
            }
        })
    } else if (reason == 'update') {
		// chrome.storage.sync.clear()
		if (previousVersion === '0.0.1') {

		} else {

		}
    }
})

const setContMenu = () => {
	chrome.contextMenus.removeAll()
	chrome.contextMenus.create({
		title: 'MarkALink',
		contexts: ['link'],
		documentUrlPatterns: ["http://*/*", "https://*/*", "http://*/", "https://*/"],
		onclick: async ({ linkUrl }, tabs) => {
			// const data = await getData()
			// const newData = { ...data, [linkUrl]: item.mode }

			const tabID = tabs.id
			chrome.tabs.sendMessage(tabID, {
				linkUrl: linkUrl,
				openPopUp: true,
			})

			// syncStore('na', newData)
		}
	})
}

setContMenu()
