const showTooltip = (e) => {
    const tooltip = e.target.classList.contains('MarkALink__tooltip')
        ? e.target
        : e.target.querySelector(':scope .MarkALink__tooltip')

    if (!tooltip)
        return

    tooltip.style.left = (e.clientX + tooltip.clientWidth + 10 < document.body.clientWidth)
        ? (e.clientX + 10 + 'px')
        : (document.body.clientWidth + 5 - tooltip.clientWidth + 'px')
    tooltip.style.top = (e.clientY + tooltip.clientHeight + 10 < document.body.clientHeight)
        ? (e.clientY + 10 + 'px')
        : (document.body.clientHeight + 5 - tooltip.clientHeight + 'px')
}

const removeAll = () => {
    domObserver.disconnect()
    document.querySelectorAll('.MarkALink__marked').forEach(item => {
        item.classList.remove('MarkALink__marked')
        item.classList.remove('MarkALink__tooltiped')
        item.removeAttribute("style")
        item.removeEventListener('mousemove', showTooltip)
    })
    document.querySelectorAll('.MarkALink__blocked').forEach(item => {
        item.classList.remove('MarkALink__blocked')
        item.classList.remove('MarkALink__tooltiped')
        item.removeEventListener('mousemove', showTooltip)
    })
    document.querySelectorAll('.MarkALink__tooltiped').forEach(item => {
        item.classList.remove('MarkALink__tooltiped')
        item.removeEventListener('mousemove', showTooltip)
    })
    document.querySelectorAll('.MarkALink__tooltip').forEach(item => item.remove())
}

const getTooltip = ({ grp, mark, type }) =>
    `<span data-PopUpOFF="notification" class="MarkALink__tooltip">${mark}</span>`

const loopThorugh = (links, data, customSettings, pairs) => {
    // console.log(data)
    links.forEach(item => {
        const url = item.href
        if (url in data) {
            // console.log(data[url])

            // tooltip
            if (!item.classList.contains('MarkALink__tooltiped')) {
                const tooltipHTML = getTooltip(data[url])
                item.insertAdjacentHTML('beforeend', tooltipHTML)
                item.classList.add('MarkALink__tooltiped')
                item.addEventListener('mousemove', showTooltip)
            }

            const grpName = data[url].grp
            if (grpName === 'Hide') {
                item.classList.add('MarkALink__blocked')
                return
            }

            // console.log(customSettings[pairs[grpName]])
            const { styleLeft, styleRight } = customSettings[pairs[grpName]]

            item.classList.add('MarkALink__marked')
            item.style[styleLeft] = styleRight
        }
    })

    const keys = Object.keys(data)
    keys.forEach(async (key) => {
        const item = data[key]
        if (item.type === 'Reminder' && item.shown === false) {
            const date = getDateWithoutTime(item.date)
            const curDate = getDateWithoutTime(new Date)
            if (curDate >= date) {
                // TODO: show template
                alert(`Url: ${key}, Mark: ${item.mark}`)

                let newKey = { ...data[key] }
                delete newKey['shown']

                const newData = { ...data, [key]: newKey }
                await syncStore('na', newData)
            }
        }
    })
}

const init = async () => {
    const data = await getData()
    const links = document.querySelectorAll('a')
    const { customSettings, pairs } = await getStorageDataLocal(['customSettings', 'pairs'])

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
    // from bg
    if (request.openPopUp === true) {
        initPopUp(request.linkUrl)
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
