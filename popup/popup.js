let state = {
    notesOn: true
}

const optBtn = document.querySelector('.popup_opt')
const notesBtn = document.querySelector('.popup_notes')
const markBtn = document.querySelector('.popup_mark')
const hideBtn = document.querySelector('.popup_hide')

const configNotes = (shouldWork) => {
    browser.tabs.query({ url: null }, resp => {
        Object.values(resp).forEach(item => {
            browser.tabs.sendMessage(item.id, { notesShouldWork: shouldWork })
        })
    })
}

const activateBtn = (parentNode) => {
    parentNode.querySelector('.button_toggle_text').textContent = 'Enable'
    parentNode.classList.add('popup__button-active')
}

const deactivateBtn = (parentNode) => {
    parentNode.querySelector('.button_toggle_text').textContent = 'Disable'
    parentNode.classList.remove('popup__button-active')
}

const setBtn = (node, flag) =>
    flag ? activateBtn(node) : deactivateBtn(node)

const getData = async () => {
    chrome.storage.local.get(['notesOn'], resp => {
        const { notesOn } = resp
        if (notesOn == null) {
            return
        }

        state = {
            ...state,
            notesOn: notesOn,
        }

        setBtn(notesBtn, !state.notesOn)
    })
}

getData()

optBtn.addEventListener('click', e => {
    e.preventDefault()
    browser.runtime.openOptionsPage(() => {
        window.close()
    })
})

notesBtn.addEventListener('click', e => {
    e.preventDefault()
    // state
    chrome.storage.local.set({ notesOn: !state.notesOn })
    state = {
        ...state,
        notesOn: !state.notesOn,
    }
    // viz
    setBtn(notesBtn, !state.notesOn)
    configNotes(state.notesOn)
})

markBtn.addEventListener('click', (e) => {
    e.preventDefault()

    browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { openPopUp: true, linkUrl: tabs[0].url }, resp => {
            if (resp && resp.closePopup === true) {
                window.close()
            }
        })
    })
})

hideBtn.addEventListener('click', (e) => {
    e.preventDefault()

    browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { addToHide: true, linkUrl: tabs[0].url }, resp => {
            if (resp && resp.closePopup === true) {
                window.close()
            }
        })
    })
})
