const getPopupHTML = (linkUrl, groups, defGroup = 'Add new group') =>
    `<div class="MarkALink_popup__wrap">
        <div class="MarkALink_popup__logo"></div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label">Url: </span>
            <input value=${linkUrl} type="text" class="MarkALink_popup__inp">
        </div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label">Group: </span>
            <div class="MarkALink_popup__menu">
                <span class="MarkALink_popup__menu_default">${defGroup}</span>
                <input class="MarkALink_popup__menu_default MarkALink_popup__menu_default-input">
                <div class="MarkALink_popup__submenu">
                    ${
                        groups.map(item => `<a href="#" id="${item}" class="MarkALink_popup__menu_item">${item}</a>`).join('')
                    }
                    <a href="#" class="MarkALink_popup__menu_item-add">Add new group</a>
                </div>
            </div>
        </div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label">Type: </span>
            <div class="MarkALink_popup__types">
                <a href="#" id="Mark" class="MarkALink_popup__types_item MarkALink_popup__types_item-active">Mark</a>
                <a href="#" id="Reminder" class="MarkALink_popup__types_item">Reminder</a>
            </div>
        </div>
        <div class="MarkALink_popup__grp MarkALink_popup__grp-flex">
            <textarea class="MarkALink_popup__textarea" placeholder="Type your Mark here..."></textarea>
        </div>
        <div class="MarkALink_popup__btns">
            <a href="#" class="MarkALink_popup__save">Save</a>
            <a href="#" class="MarkALink_popup__close">Close</a>
            <a href="#" class="MarkALink_popup__unmark">Unmark</a>
        </div>
    </div>`

const getGrps = async (data) => {
    let obj = {}
    let curMax = 0
    let mostGrp = ''

    for (const prop in data) {
        const grp = data[prop]['grp']

        if (grp in obj) {
            obj[grp]++
        } else {
            obj[grp] = 1
        }

        if (obj[grp] > curMax) {
            curMax = obj[grp]
            mostGrp = grp
        }
    }

    const { defCategories } = await getStorageDataLocal()

    console.log(obj)

    if (curMax === 0) {
        return {
            arr: [...defCategories],
            grp: defCategories[0]
        }
    }

    return {
        arr: [...new Set([...defCategories, ...Object.keys(obj)])],
        grp: mostGrp
    }
}

const initPopUp = async (linkUrl) => {
    const data = await getData()
    console.log(data)
    const { arr, grp } = await getGrps(data)
    console.log(arr, grp)

    let state = {
        url: linkUrl,
        grp: grp,
        type: 'Mark',
        mark: ''
    }

    const popup = document.createElement('div')
    const popupHTML = getPopupHTML(linkUrl, arr, grp)
    popup.classList.add('MarkALink_popup')
    popup.innerHTML = popupHTML
    popup.setAttribute('data-PopUpOFF', 'notification')

    // mark
    const textArea = popup.querySelector('.MarkALink_popup__textarea');
    textArea.addEventListener('input', () => {
        state = { ...state, mark: textArea.value }
    })

    // groups
    const groupBtns = popup.querySelectorAll('.MarkALink_popup__menu_item')
    groupBtns.forEach(item => item.addEventListener('click', e => {
        e.preventDefault()

        item.parentNode.classList.add('MarkALink_popup__submenu-hide')
        setTimeout(() => item.parentNode.classList.remove('MarkALink_popup__submenu-hide'), 400)

        popup.querySelector('.MarkALink_popup__menu_default').textContent = item.id
        state = { ...state, grp: item.id }
    }))

    const addNewGrpBtn = popup.querySelector('.MarkALink_popup__menu_item-add')
    addNewGrpBtn.addEventListener('click', e => {
        e.preventDefault()
        
        const newGrpInput = popup.querySelector('.MarkALink_popup__menu_default-input')
    })

    // type
    const typeBtns = popup.querySelectorAll('.MarkALink_popup__types_item')
    typeBtns.forEach(item => item.addEventListener('click', e => {
        e.preventDefault()

        typeBtns.forEach(btn => btn.classList.remove('MarkALink_popup__types_item-active'))
        item.classList.add('MarkALink_popup__types_item-active')
        state = { ...state, type: e.currentTarget.id }
    }))


    // save and close
    const saveBtn = popup.querySelector('.MarkALink_popup__save')
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        console.log(state)
        try {
            const { url, grp, type, mark } = state
            const data = await getData()
            const newData = {
                ...data,
                [url]: {
                    grp: grp,
                    type: type,
                    mark: mark
                }
            }
            await syncStore('na', newData)
            popup.classList.add('MarkALink_popup-hidden')
        } catch (e) {
            console.log(e)
        }
    })

    const closeBtn = popup.querySelector('.MarkALink_popup__close')
    closeBtn.addEventListener('click', e => {
        e.preventDefault()

        popup.classList.add('MarkALink_popup-hidden')
    })

    document.body.appendChild(popup)
}
