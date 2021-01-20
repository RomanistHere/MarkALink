const removeAll = () => {
    domObserver.disconnect()
    document.querySelectorAll('.MarkALink__marked').forEach(item => {
        item.classList.remove('MarkALink__marked')
        item.classList.remove('MarkALink__tooltiped')
        item.removeAttribute("style")
        item.removeEventListener('mouseenter', showTooltip)
        item.removeEventListener('mousemove', moveTooltip)
        item.removeEventListener('mouseleave', hideTooltip)
    })
    document.querySelectorAll('.MarkALink__blocked').forEach(item => {
        item.classList.remove('MarkALink__blocked')
        item.classList.remove('MarkALink__tooltiped')
        item.removeEventListener('mouseenter', showTooltip)
        item.removeEventListener('mousemove', moveTooltip)
        item.removeEventListener('mouseleave', hideTooltip)
    })
    document.querySelectorAll('.MarkALink__tooltiped').forEach(item => {
        item.classList.remove('MarkALink__tooltiped')
        item.removeEventListener('mouseenter', showTooltip)
        item.removeEventListener('mousemove', moveTooltip)
        item.removeEventListener('mouseleave', hideTooltip)
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

const loopThorugh = (links, data, customSettings, pairs) => {
    initSideElements()
    // console.log(data)
    links.forEach(item => {
        const url = item.href
        if (url in data) {
            // console.log(data[url])

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
