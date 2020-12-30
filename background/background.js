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

const subMenu = [
	{
		title: `Show`,
		mode: 'show'
	},{
		title: `Mark`,
		mode: 'mark'
	},{
		title: `Hide`,
		mode: 'block'
	}
]

const subMenuStore = {
	show: null,
	mark: null,
	block: null,
}

const setContMenu = () => {
	chrome.contextMenus.removeAll()
	subMenu.map((item, index) => {
	 	subMenuStore[Object.keys(subMenuStore)[index]] = chrome.contextMenus.create({
			title: item.title,
			type: 'normal',
			contexts: ['link'],
			documentUrlPatterns: ["http://*/*", "https://*/*", "http://*/", "https://*/"],
			onclick: async ({ linkUrl }) => {
				const data = await getData()
				const newData = { ...data, [linkUrl]: item.mode }

				chrome.tabs.query({ url: null }, resp => {
			        Object.values(resp).forEach(item => {
			            chrome.tabs.sendMessage(item.id, 'updated')
			        })
			    })

				syncStore('na', newData)
			}
		})
	})
}

setContMenu()
