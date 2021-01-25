const getAside = () =>
    `<ul class="MarkALink_aside__list"></ul>
    <a href="#" class="MarkALink_aside__expand"></a>`

const getAsideItem = (link, text) =>
    `<a href="${link}" title="${link}" class="MarkALink_aside__link">${link}</a>
    <a href="#" title="Click to edit" class="MarkALink_aside__mark">${text}</a>
    <div class="MarkALink_aside__btns">
        <a
            href="#"
            title="We will store your notification as completed after"
            class="MarkALink_aside__btn MarkALink_aside__btn-complete">Complete</a>
        <a
            href="#"
            title="It will be shown in the edge of your screen"
            class="MarkALink_aside__btn MarkALink_aside__btn-hide">Minimize</a>
    </div>`

const setBtnHandlers = (parent, list, aside) => {
    const complete = parent.querySelector('.MarkALink_aside__btn-complete')
    const minimize = parent.querySelector('.MarkALink_aside__btn-hide')

    complete.addEventListener('click', async (e) => {
        e.preventDefault()

        parent.classList.add('MarkALink_aside__item-del')
        setTimeout(() => {
            parent.remove()
            if (!list.hasChildNodes()) {
                aside.remove()
                initAside()
            }
        }, 900)
    })

    minimize.addEventListener('click', e => {
        e.preventDefault()

        parent.classList.add('MarkALink_aside__item-min')
        setTimeout(() => {
            parent.remove()
            if (!list.hasChildNodes()) {
                aside.remove()
                initAside()
            }
        }, 900)
    })
}

const addExpand = (aside = document) => {
    const expand = aside.querySelector('.MarkALink_aside__expand')

    expand.addEventListener('click', e => {
        e.preventDefault()
        aside.classList.remove('MarkALink_aside-hidden')
    })
}

const initAside = () => {
    if (document.querySelector('.MarkALink_aside'))
        document.querySelector('.MarkALink_aside').remove()

    const arr = [{
        link: 'https://music.youtube.com/browse/MPREb_IXSUnzxwa2X',
        text: 'some text written in hand (not) asd as asd asd as das dsa asd ssome text written in hand (not) asd asd asd as dsasd asd asd as ds ome text written in hand (not) asd as asd asd as das dsa asd ssome text written in hand (not) asd asd asd as dsasd asd asd as ds'
    },
    {
        link: 'https://music.youtube.com/browse/MPREb_IXSUnzxwa2X',
        text: 'some text written in hand (not)some text written in hand (not) asd asd asd as dsasd asd asd as ds'
    }]

    const aside = document.createElement('ASIDE')
    const asideHTML = getAside()
    aside.classList.add('MarkALink_aside', 'MarkALink_aside-hidden')
    aside.insertAdjacentHTML('beforeend', asideHTML)

    const list = aside.querySelector('.MarkALink_aside__list')
    for (let i = 0; i < arr.length; i++) {
        const { link, text } = arr[i]
        const listItem = document.createElement('LI')
        listItem.classList.add('MarkALink_aside__item')

        const listItemHTML = getAsideItem(link, text)
        listItem.insertAdjacentHTML('beforeend', listItemHTML)

        setBtnHandlers(listItem, list, aside)

        list.append(listItem)
    }

    addExpand(aside)

    document.body.append(aside)
}

initAside()
