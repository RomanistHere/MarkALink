import {
	getData,
	syncStore,
	getStorageDataLocal,
    setStorageDataLocal
} from '../modules/helpers.js'

chrome.runtime.onInstalled.addListener(async (details) => {
	const { previousVersion, reason } = details

    if (reason == 'install') {
		chrome.storage.sync.get(['na_1'], async (resp) => {
            if (!resp.it_1) {
                chrome.storage.sync.set({
					na_1: ''
                })
            }
        })

		await setStorageDataLocal({
			asideMinimized: false,
			shouldShowNotification: true,
			notesOn: true,
			defCategories: ['Hide', 'Marked'],
			pairs: {
				'Hide': 'Transparent',
				'Marked': 'Yellow border'
			},
			customSettings: {
				'Yellow border': {
					styleLeft: 'border-bottom',
					styleRight: '4px dashed yellow'
				},
				'Red border': {
					styleLeft: 'border-bottom',
					styleRight: '4px dashed red'
				},
				'Black border': {
					styleLeft: 'border-bottom',
					styleRight: '4px dashed black'
				},
				'Green border': {
					styleLeft: 'border-bottom',
					styleRight: '4px dashed green'
				},
				'Yellow background': {
					styleLeft: 'background',
					styleRight: 'yellow'
				},
				'Red background': {
					styleLeft: 'background',
					styleRight: 'red'
				},
				'Black background': {
					styleLeft: 'background',
					styleRight: 'black'
				},
				'Green background': {
					styleLeft: 'background',
					styleRight: 'green'
				},
				'Transparent': {
					styleLeft: 'opacity',
					styleRight: '0'
				}
			}
		})

		chrome.tabs.create({ url: 'https://marka.link/#about' })
    } else if (reason == 'update') {
		// chrome.storage.sync.clear()
		if (previousVersion === '0.0.1') {
			await setStorageDataLocal({ shouldShowNotification: true })
		} else {

		}
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// resend message to all the tabs
    if (message.toAllTheTabs === true) {
		const { toAllTheTabs, ...rest } = message

		chrome.tabs.query({ url: null }, resp => {
	        Object.values(resp).forEach(item => {
	            chrome.tabs.sendMessage(item.id, rest)
	        })
	    })
    }
})

const setContMenu = () => {
	chrome.contextMenus.removeAll()
	chrome.contextMenus.create({
		title: 'Mark',
		contexts: ['link'],
		documentUrlPatterns: ["http://*/*", "https://*/*", "http://*/", "https://*/"],
		onclick: ({ linkUrl }, tabs) => {
			const tabID = tabs.id
			chrome.tabs.sendMessage(tabID, {
				linkUrl: linkUrl,
				openPopUp: true,
			})
		}
	})
	chrome.contextMenus.create({
		title: '"Hide" the page',
		contexts: ['link'],
		documentUrlPatterns: ["http://*/*", "https://*/*", "http://*/", "https://*/"],
		onclick: ({ linkUrl }, tabs) => {
			const tabID = tabs.id
			chrome.tabs.sendMessage(tabID, {
				linkUrl: linkUrl,
				addToHide: true,
			})
		}
	})
	chrome.contextMenus.create({
		title: '"Hide" whole website',
		contexts: ['link'],
		documentUrlPatterns: ["http://*/*", "https://*/*", "http://*/", "https://*/"],
		onclick: ({ linkUrl }, tabs) => {
			const tabID = tabs.id
			const pureUrl = linkUrl.substring(linkUrl.lastIndexOf("//") + 2, linkUrl.indexOf("/", 8))
			chrome.tabs.sendMessage(tabID, {
				linkUrl: pureUrl,
				addToHide: true,
			})
		}
	})
}

setContMenu()
