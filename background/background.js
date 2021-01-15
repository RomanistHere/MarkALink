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
    } else if (reason == 'update') {
		// chrome.storage.sync.clear()
		if (previousVersion === '0.0.1') {

		} else {

		}
    }

	await setStorageDataLocal({
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
