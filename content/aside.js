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

const setBtnHandlers = (parent, list, aside, key) => {
    const complete = parent.querySelector('.MarkALink_aside__btn-complete')
    const minimize = parent.querySelector('.MarkALink_aside__btn-hide')

    complete.addEventListener('click', async (e) => {
        e.preventDefault()
        const data = await getData()

        let newKey = { ...data[key] }
        delete newKey['shown']

        const newData = { ...data, [key]: newKey }
        try {
            await syncStore('na', newData)

            parent.classList.add('MarkALink_aside__item-del')
            setTimeout(() => {
                parent.remove()
                if (!list.hasChildNodes()) {
                    aside.remove()
                    sendMsgToAllTabs({ asideCompleted: true })
                }
            }, 900)
        } catch (e) {
            console.log(e)
        }
    })

    minimize.addEventListener('click', e => {
        e.preventDefault()

        parent.classList.add('MarkALink_aside__item-min')
        setTimeout(async () => {
            parent.remove()
            if (!list.hasChildNodes()) {
                aside.remove()
                await setStorageDataLocal({ asideMinimized: true })
                sendMsgToAllTabs({ asideMinimized: true })
                initAside()
            }
        }, 900)
    })
}

const addExpand = (aside = document) => {
    const expand = aside.querySelector('.MarkALink_aside__expand')

    expand.addEventListener('click', async (e) => {
        e.preventDefault()

        await setStorageDataLocal({ asideMinimized: false })
        sendMsgToAllTabs({ asideMinimized: false })
        aside.classList.remove('MarkALink_aside-hidden')
    })
}

const updateAside = (asideMinimized) => {
    const aside = document.querySelector('.MarkALink_aside')

    if (!aside)
        return

    asideMinimized
        ? aside.classList.add('MarkALink_aside-hidden')
        : aside.classList.remove('MarkALink_aside-hidden')
}

const getAsideData = async () => {
    const data = await getData()
    const keys = Object.keys(data)
    let notifArr = []

    keys.forEach(async (key) => {
        const item = data[key]
        if (item.type === 'Reminder' && item.shown === false) {
            // console.log(data[key])
            const date = getDateWithoutTime(item.date)
            const curDate = getDateWithoutTime(new Date)
            if (curDate >= date) {
                const notif = {
                    link: key,
                    text: item.mark
                }
                notifArr = [...notifArr, notif]
            }
        }
    })

    return notifArr
}

const initAside = async () => {
    if (document.querySelector('.MarkALink_aside')) {
        // return
        document.querySelector('.MarkALink_aside').remove()
    }

    const arr = await getAsideData()
    const { asideMinimized } = await getStorageDataLocal('asideMinimized')

    const aside = document.createElement('ASIDE')
    const asideHTML = getAside()
    asideMinimized
        ? aside.classList.add('MarkALink_aside', 'MarkALink_aside-hidden')
        : aside.classList.add('MarkALink_aside')

    aside.insertAdjacentHTML('beforeend', asideHTML)
    const list = aside.querySelector('.MarkALink_aside__list')

    for (let i = 0; i < arr.length; i++) {
        const { link, text } = arr[i]
        const listItem = document.createElement('LI')
        listItem.classList.add('MarkALink_aside__item')

        const listItemHTML = getAsideItem(link, text)
        listItem.insertAdjacentHTML('beforeend', listItemHTML)

        setBtnHandlers(listItem, list, aside, link)

        list.append(listItem)
    }

    addExpand(aside)

    document.body.append(aside)
}

initAside()
