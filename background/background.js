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
		defCategories: ['Hide', 'Favorite'],
		customSettings: {
			'Favorite': {
				name: 'Yellow border',
				styleLeft: 'border-bottom',
				styleRight: '4px dashed yellow'
			},
			'custom grp': {
				name: 'Red border',
				styleLeft: 'border-bottom',
				styleRight: '4px dashed red'
			},
			'NewGrp1': {
				name: 'Black border',
				styleLeft: 'border-bottom',
				styleRight: '4px dashed black'
			},
			'NewGrp2': {
				name: 'Green border',
				styleLeft: 'border-bottom',
				styleRight: '4px dashed green'
			},
			'Hide': {
				name: 'Transparent',
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
