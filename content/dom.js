const removeEventListeners = elem => {
    elem.removeEventListener('mouseenter', showTooltip)
    elem.removeEventListener('mousemove', moveTooltip)
    elem.removeEventListener('mouseleave', hideTooltip)
}

const removeAll = () => {
    try {
        domObserver.disconnect()
    } catch (e) {
        console.log(e)
    }
    document.querySelectorAll('.MarkALink__marked').forEach(item => {
        item.classList.remove('MarkALink__marked')
        item.classList.remove('MarkALink__tooltiped')
        item.removeAttribute("style")
        removeEventListeners(item)
    })
    document.querySelectorAll('.MarkALink__blocked').forEach(item => {
        item.classList.remove('MarkALink__blocked')
        item.classList.remove('MarkALink__tooltiped')
        removeEventListeners(item)
    })
    document.querySelectorAll('.MarkALink__tooltiped').forEach(item => {
        item.classList.remove('MarkALink__tooltiped')
        removeEventListeners(item)
    })
    document.querySelectorAll('.MarkALink__tooltip').forEach(item => item.remove())
}

const fillData = (tooltip, tooltipData) => {
    const data = tooltipData.dataset
    const grp = data.markalink_grp
    const mark = data.markalink_mark

    tooltip.querySelector('.MarkALink__tooltip_text-grp').textContent = grp
    tooltip.querySelector('.MarkALink__tooltip_text-mark').textContent = mark

    tooltip.classList.add('MarkALink__tooltip-show')
}

const showTooltip = (e) => {
    const tooltipData = e.target.classList.contains('MarkALink__tooltip-hidden')
        ? e.target
        : e.target.querySelector(':scope .MarkALink__tooltip-hidden')

    const tooltip = document.querySelector('.MarkALink__tooltip')

    if (!tooltipData || !tooltip)
        return

    fillData(tooltip, tooltipData)
}

const moveTooltip = (e) => {
    const tooltip = document.querySelector('.MarkALink__tooltip')

    if (!tooltip)
        return

    tooltip.style.left = (e.clientX + tooltip.clientWidth + 10 < document.body.clientWidth)
        ? (e.clientX + 10 + 'px')
        : (document.body.clientWidth + 5 - tooltip.clientWidth + 'px')
    tooltip.style.top = (e.clientY + tooltip.clientHeight + 10 < document.body.clientHeight)
        ? (e.clientY + 10 + 'px')
        : (document.body.clientHeight + 5 - tooltip.clientHeight + 'px')
}

const hideTooltip = (e) => {
    const tooltip = document.querySelector('.MarkALink__tooltip')

    tooltip.querySelector('.MarkALink__tooltip_text-grp').textContent = null
    tooltip.querySelector('.MarkALink__tooltip_text-mark').textContent = null

    tooltip.classList.remove('MarkALink__tooltip-show')
}

const getTooltipHdn = ({ grp, mark, type }) =>
    `<span data-MarkALink_grp="${grp}" data-MarkALink_mark="${mark}"" class="MarkALink__tooltip-hidden"></span>`

const getTooltip = () =>
    `<div data-PopUpOFF="notification" class="MarkALink__tooltip">
        <span class="MarkALink__tooltip_text MarkALink__tooltip_text-grp">grp</span>
        <span class="MarkALink__tooltip_text MarkALink__tooltip_text-mark">mark</span>
    </div>`

const initSideElements = () => {
    const tooltipHTML = getTooltip()
    document.body.insertAdjacentHTML('beforeend', tooltipHTML)
}

const getNotification = (text = 'page') =>
    `<span class="MarkALink__tooltip_text MarkALink__notification_text">This ${text} was Hidden by you.</span>
    <div class="MarkALink_aside__btns">
        <a
            href="#"
            title="Close the notification"
            class="MarkALink_aside__btn MarkALink__notification__btn-close">Okay</a>
        <a
            href="#"
            title="Don't show this notification again"
            class="MarkALink_aside__btn MarkALink__notification__btn-remember">Don't show again</a>
    </div>`

const showNotification = text => {
    const notification = document.createElement('div')
    const notificationHTML = getNotification(text)

    notification.classList.add('MarkALink__notification')
    notification.innerHTML = notificationHTML
    notification.setAttribute('data-PopUpOFF', 'notification')

    const closeBtn = notification.querySelector('.MarkALink__notification__btn-close')
    closeBtn.addEventListener('click', e => {
        e.preventDefault()
        notification.remove()
    })

    const closeBtnRemember = notification.querySelector('.MarkALink__notification__btn-remember')
    closeBtnRemember.addEventListener('click', async (e) => {
        e.preventDefault()
        notification.remove()

        try {
            await setStorageDataLocal({ shouldShowNotification: false })
        } catch (e) {
            console.log(e)
        }
    })

    document.body.appendChild(notification)
}

const markLinks = (url, data, customSettings, pairs, item) => {
    // tooltip
    if (!item.classList.contains('MarkALink__tooltiped')) {
        const tooltipHTML = getTooltipHdn(data[url])
        item.insertAdjacentHTML('beforeend', tooltipHTML)
        item.classList.add('MarkALink__tooltiped')
        item.addEventListener('mouseenter', showTooltip)
        item.addEventListener('mousemove', moveTooltip)
        item.addEventListener('mouseleave', hideTooltip)
    }

    const grpName = data[url].grp
    if (grpName === 'Hide') {
        item.classList.add('MarkALink__blocked')
        return
    }

    const { styleLeft, styleRight } = customSettings[pairs[grpName]]

    item.classList.add('MarkALink__marked')
    item.style[styleLeft] = styleRight
}

const loopThorugh = (links, data, customSettings, pairs) => {
    if (!document.querySelector('.MarkALink__tooltip'))
        initSideElements()

    // console.log(data)
    links.forEach(item => {
        const url = item.href
        const pureUrl = url.substring(url.lastIndexOf("//") + 2, url.indexOf("/", 8))
        if (url in data) {
            markLinks(url, data, customSettings, pairs, item)
        } else if (pureUrl in data) {
            markLinks(pureUrl, data, customSettings, pairs, item)
        }
    })
}
