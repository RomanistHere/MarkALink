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
                <div class="MarkALink_popup__submenu">
                    ${
                        groups.map(item => `<a href="#" id="${item}" class="MarkALink_popup__menu_item">${item}</a>`).join('')
                    }
                    <a href="#" class="MarkALink_popup__menu_item-add">Add new group</a>
                </div>
            </div>
            <input value="New group" class="MarkALink_popup__menu_default MarkALink_popup__menu_default-input MarkALink_popup__menu_default-hide">
        </div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label">Type: </span>
            <div class="MarkALink_popup__types">
                <a href="#" id="Mark" class="MarkALink_popup__types_item MarkALink_popup__types_item-active">Mark</a>
                <a href="#" id="Reminder" class="MarkALink_popup__types_item">Reminder</a>
            </div>
        </div>
        <div class="MarkALink_popup__calendar">
            <input class=MarkALink_popup__calendar_input placeholder="Click to pick date">
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
        mark: '',
        existingGroups: [...arr],
        datepicker: false,
        date: new Date().fp_incr(7)
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
    const name = popup.querySelector('.MarkALink_popup__menu_default')
    const groupBtns = popup.querySelectorAll('.MarkALink_popup__menu_item')
    groupBtns.forEach(item => item.addEventListener('click', e => {
        e.preventDefault()

        item.parentNode.classList.add('MarkALink_popup__submenu-hide')
        setTimeout(() => item.parentNode.classList.remove('MarkALink_popup__submenu-hide'), 400)

        name.textContent = item.id
        state = { ...state, grp: item.id }
    }))

    const addGrp = grp => {
        if (state.existingGroups.includes(grp)) {
            console.log('existing')
            alert('Try different name!')
            return
        }

        name.textContent = grp
        state = {
            ...state,
            grp: grp,
            existingGroups: [...state.existingGroups, grp]
        }

        menu.classList.remove('MarkALink_popup__menu_default-hide')
        newGrpInput.classList.add('MarkALink_popup__menu_default-hide')
        name.classList.remove('MarkALink_popup__menu_default-hide')

        submenu.insertAdjacentHTML('afterbegin', `<a href="#" id="${grp}" class="MarkALink_popup__menu_item">${grp}</a>`)
    }

    const newGrpInput = popup.querySelector('.MarkALink_popup__menu_default-input')
    const menu = popup.querySelector('.MarkALink_popup__menu')
    const submenu = popup.querySelector('.MarkALink_popup__submenu')
    const addNewGrpBtn = popup.querySelector('.MarkALink_popup__menu_item-add')
    addNewGrpBtn.addEventListener('click', e => {
        e.preventDefault()

        addNewGrpBtn.parentNode.classList.add('MarkALink_popup__submenu-hide')
        setTimeout(() => addNewGrpBtn.parentNode.classList.remove('MarkALink_popup__submenu-hide'), 400)

        menu.classList.add('MarkALink_popup__menu_default-hide')
        name.classList.add('MarkALink_popup__menu_default-hide')
        newGrpInput.classList.remove('MarkALink_popup__menu_default-hide')

        newGrpInput.focus()
        newGrpInput.select()
    })

    newGrpInput.addEventListener('blur', e => {
        addGrp(e.currentTarget.value.trim())
    })

    newGrpInput.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            e.preventDefault()
            newGrpInput.blur()
        }
    })

    // type
    const typeBtns = popup.querySelectorAll('.MarkALink_popup__types_item')
    typeBtns.forEach(item => item.addEventListener('click', e => {
        e.preventDefault()

        typeBtns.forEach(btn => btn.classList.remove('MarkALink_popup__types_item-active'))
        item.classList.add('MarkALink_popup__types_item-active')
        state = { ...state, type: e.currentTarget.id }

        const calendarWrap = popup.querySelector('.MarkALink_popup__calendar')
        if (state.type === 'Reminder') {
            calendarWrap.classList.add('MarkALink_popup__calendar-show')
        } else {
            calendarWrap.classList.remove('MarkALink_popup__calendar-show')
        }
    }))


    // save and close
    const saveBtn = popup.querySelector('.MarkALink_popup__save')
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        try {
            const { url, grp, type, mark, date } = state
            const data = await getData()
            const newData = {
                ...data,
                [url]: type === 'mark' ? {
                    grp: grp,
                    type: type,
                    mark: mark
                } : {
                    grp: grp,
                    type: type,
                    mark: mark,
                    date: date,
                    shown: false
                }
            }
            console.log(newData)
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

    // datepicker
    if (!state.datepicker) {
        const calendarInput = popup.querySelector('.MarkALink_popup__calendar_input')
        const datepicker = flatpickr(calendarInput, {
            minDate: new Date().fp_incr(1),
            defaultDate: state.date,
            onChange: (selectedDates, dateStr, instance) => {
                const date = selectedDates[0]
                state = { ...state, date: date }
            }
        })
    }

    document.body.appendChild(popup)
}
