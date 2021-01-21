const getPopupHTML = (linkUrl, groups, defGroup = 'Add new group', textArea = '', isMark = true) =>
    `<div class="MarkALink_popup__wrap">
        <div class="MarkALink_popup__logo_wrap">
            <div class="MarkALink_popup__logo">
                <section class="MarkALink_logo_wrap MarkALink_logo_wrap-basic">
                    <div class="MarkALink_logo MarkALink_logo-based">
                        <span class="MarkALink_logo__neon">Mark</span>
                        <span class="MarkALink_logo__neon MarkALink_logo__neon-bot">ALink</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift">
                        <span class="MarkALink_logo__neon">Mark</span>
                        <span class="MarkALink_logo__neon MarkALink_logo__neon-bot">ALink</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-1">
                        <span class="MarkALink_logo__neon">Mark</span>
                        <span class="MarkALink_logo__neon MarkALink_logo__neon-bot">ALink</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-2">
                        <span class="MarkALink_logo__neon">Mark</span>
                        <span class="MarkALink_logo__neon MarkALink_logo__neon-bot">ALink</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-3">
                        <span class="MarkALink_logo__neon">Mark</span>
                        <span class="MarkALink_logo__neon MarkALink_logo__neon-bot">ALink</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-glitch">
                        <div class="MarkALink_logo__neon">
                            M<span class="MarkALink_logo-invis">a</span>rk
                        </div>
                        <div class="MarkALink_logo__neon MarkALink_logo__neon-bot">
                            <span class="MarkALink_logo-invis">A</span>Link
                            <span class="MarkALink_logo-trick">A</span>
                        </div>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-glitch-shift">
                        <div class="MarkALink_logo__neon">
                            M<span class="MarkALink_logo-invis">a</span>rk
                        </div>
                        <div class="MarkALink_logo__neon MarkALink_logo__neon-bot">
                            <span class="MarkALink_logo-invis">A</span>Link
                            <span class="MarkALink_logo-trick">A</span>
                        </div>
                    </div>
                </section>
                <section class="MarkALink_logo_wrap MarkALink_logo_wrap-hidden MarkALink_logo_wrap-success MarkALink_logo_wrap-success_one">
                    <div class="MarkALink_logo MarkALink_logo-based">
                        <span class="MarkALink_logo__neon">Success</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift">
                        <span class="MarkALink_logo__neon">Success</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-1">
                        <span class="MarkALink_logo__neon">Success</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-2">
                        <span class="MarkALink_logo__neon">Success</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-3">
                        <span class="MarkALink_logo__neon">Success</span>
                    </div>
                </section>
                <section class="MarkALink_logo_wrap MarkALink_logo_wrap-hidden MarkALink_logo_wrap-err MarkALink_logo_wrap-success">
                    <div class="MarkALink_logo MarkALink_logo-based">
                        <span class="MarkALink_logo__neon">Error</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift">
                        <span class="MarkALink_logo__neon">Error</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-1">
                        <span class="MarkALink_logo__neon">Error</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-2">
                        <span class="MarkALink_logo__neon">Error</span>
                    </div>
                    <div class="MarkALink_logo MarkALink_logo-shift MarkALink_logo-shift-3">
                        <span class="MarkALink_logo__neon">Error</span>
                    </div>
                </section>
            </div>
        </div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label MarkALink_popup__glow">Url: </span>
            <input value=${linkUrl} type="text" class="MarkALink_popup__inp">
        </div>
        <div class="MarkALink_popup__grp">
            <span class="MarkALink_popup__label MarkALink_popup__glow">Group: </span>
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
            <span class="MarkALink_popup__label MarkALink_popup__glow">Type: </span>
            <div class="MarkALink_popup__types">
                <a href="#" id="Mark" class="MarkALink_popup__types_item ${isMark ? `MarkALink_popup__types_item-active` : ``}">Mark</a>
                <a href="#" id="Reminder" class="MarkALink_popup__types_item ${!isMark ? `MarkALink_popup__types_item-active` : ``}">Reminder</a>
            </div>
        </div>
        <div class="MarkALink_popup__calendar ${!isMark ? `MarkALink_popup__calendar-show` : ``}">
            <input class="MarkALink_popup__calendar_input MarkALink_popup__inp" placeholder="Click to pick date">
        </div>
        <div class="MarkALink_popup__grp MarkALink_popup__grp-flex MarkALink_popup__textarea_wrap">
            <textarea class="MarkALink_popup__textarea" placeholder="Type your Mark here...">${textArea}</textarea>
        </div>
        <div class="MarkALink_popup__btns">
            <a href="#" data-text="Save" class="MarkALink_popup__btn MarkALink_popup__save">
                <span class="MarkALink_popup__text">Save</span>
                <span class="MarkALink_popup__btns-trick"></span>
                <span class="MarkALink_popup__btns-trick MarkALink_popup__btns-trick_2"></span>
            </a>
            <a href="#" data-text="Unmark" class="MarkALink_popup__btn MarkALink_popup__unmark">
                <span class="MarkALink_popup__text">Unmark</span>
                <span class="MarkALink_popup__btns-trick"></span>
                <span class="MarkALink_popup__btns-trick MarkALink_popup__btns-trick_2"></span>
            </a>
            <a href="#" data-text="Close" class="MarkALink_popup__btn MarkALink_popup__close">
                <span class="MarkALink_popup__text">Close</span>
                <span class="MarkALink_popup__btns-trick"></span>
                <span class="MarkALink_popup__btns-trick MarkALink_popup__btns-trick_2"></span>
            </a>
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

const onSuccess = (popup, query = false) => {
	const hideClass = 'MarkALink_logo_wrap-hidden'
	const glitchClass = 'MarkALink_logo_wrap-glitch'
	const logo = popup.querySelector('.MarkALink_logo_wrap-basic')
	const success = popup.querySelector(query ? '.MarkALink_logo_wrap-err' : '.MarkALink_logo_wrap-success_one')

	logo.classList.add(glitchClass)

	setTimeout(() => {
		logo.classList.add(hideClass)
		logo.classList.remove(glitchClass)
		success.classList.remove(hideClass)
	}, 500)

    // setTimeout(closePopUp, 3000)

	setTimeout(() => {
		success.classList.add(hideClass)
		logo.classList.remove(hideClass)
		logo.classList.add(glitchClass)
	}, 5500)

	setTimeout(() => {
		logo.classList.remove(glitchClass)
	}, 6000)
}

const onError = (popup) =>
    onSuccess(popup, true)

const closePopUp = () => {
    document.querySelectorAll('.MarkALink_popup').forEach(item => item.remove())
    document.querySelectorAll('.flatpickr-calendar').forEach(item => item.remove())
    document.removeEventListener('keydown', handleEsc)
}

const handleEsc = event => {
    const { key } = event
    if (key === "Escape") {
        closePopUp()
    }
}

const initPopUp = async (linkUrl) => {
    const data = await getData()
    // console.log(data)
    const { arr, grp } = await getGrps(data)
    const isExists = linkUrl in data
    const isMark = isExists && data[linkUrl].type === 'Reminder' ? false : true

    let state = {
        url: linkUrl,
        grp: grp,
        type:  isExists ? data[linkUrl].type : 'Mark',
        mark: isExists ? data[linkUrl].mark : '',
        existingGroups: [...arr],
        isGrpNew: false,
        datepicker: false,
        date: !isMark ? new Date(data[linkUrl].date) : new Date().fp_incr(7)
    }

    const popup = document.createElement('div')
    const popupHTML = getPopupHTML(linkUrl, arr, grp, state.mark, isMark)
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
            existingGroups: [...state.existingGroups, grp],
            isGrpNew: true
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
            const { url, grp, type, mark, date, isGrpNew } = state
            const data = await getData()
            const newData = {
                ...data,
                [url]: type === 'Mark' ? {
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
            // console.log(newData)
            if (isGrpNew) {
                const { pairs } = await getStorageDataLocal('pairs')
                // TODO: add not used yet customSetting if possible
                const defSetting = 'Yellow border'

                await setStorageDataLocal({
    				pairs: { ...pairs, [grp]: defSetting }
    			})
            }
            await syncStore('na', newData)
            onSuccess(popup)
        } catch (e) {
            console.log(e)
            onError(popup)
        }
    })

    const closeBtn = popup.querySelector('.MarkALink_popup__close')
    closeBtn.addEventListener('click', e => {
        e.preventDefault()

        closePopUp()
    })

    const unmarkBtn = popup.querySelector('.MarkALink_popup__unmark')
    unmarkBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        try {
            let data = await getData()

            delete data[state.url]

            await syncStore('na', data)
            onSuccess(popup)
        } catch (e) {
            console.log(e)
            onError(popup)
        }
    })

    // TODO: close on Esc
    document.addEventListener('keydown', handleEsc)

    // datepicker
    if (!state.datepicker) {
        const calendarInput = popup.querySelector('.MarkALink_popup__calendar_input')
        const datepicker = flatpickr(calendarInput, {
            minDate: new Date().fp_incr(1),
            defaultDate: state.date,
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr, instance) => {
                const date = selectedDates[0]
                state = { ...state, date: date }
            }
        })
    }

    document.body.appendChild(popup)
}
