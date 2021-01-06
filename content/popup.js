const getPopupHTML = (linkUrl, groups, defGroup = 'new group 1') =>
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
                    <a href="#" class="MarkALink_popup__menu_item MarkALink_popup__menu_item-add">Add new</a>
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

const initPopUp = async (linkUrl) => {
    let groups = ['grp1', 'grp2', 'grp3', 'grp4']

    const popup = document.createElement('div')
    const popupHTML = getPopupHTML(linkUrl, groups)
    popup.classList.add('MarkALink_popup')
    popup.innerHTML = popupHTML
    popup.setAttribute('data-PopUpOFF', 'notification')

    document.body.appendChild(popup)

    console.log(linkUrl)
}

// initPopUp('hello')
