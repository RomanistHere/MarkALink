import {
	getData,
	syncStore,
    getStorageDataLocal,
    setStorageDataLocal
} from '../modules/helpers.js'

const sectTempl = (grpName) =>
	`<h2 class="title">
		${grpName}
	</h2>
	<ul class="list">

	</ul>`

const markTempl = (url, mark) =>
    `<li class="list__item">
		<a href="${url}" title="${url}" class="list__link">${url}</a>
		<p class="list__text">${mark}</p>
	</li>`

const sortByGrps = (data) => {
    let obj = {}
    let curMax = 0
    let mostGrp = ''

    for (const prop in data) {
        const grp = data[prop]['grp']

        if (grp in obj) {
            obj[grp] = [...obj[grp], { ...data[prop], url: prop}]
        } else {
            obj[grp] = [{ ...data[prop], url: prop}]
        }
    }

    return obj
}

let state = {
	grpNamesAndClasses: {}
}

const init = async () => {
	const { customSettings, pairs } = await getStorageDataLocal(['customSettings', 'pairs'])
	const data = await getData()
	const groups = sortByGrps(data)
	const grpNames = Object.keys(groups)

	console.log(customSettings)
	console.log(data)
	console.log(groups)
	console.log(pairs)

	for (let i = 0; i < grpNames.length; i++) {
		const section = document.createElement('section')
		const grpName = grpNames[i]
		const sectionHTML = sectTempl(grpName)
		const grpClass = grpName.split(' ').join('_')

		section.classList.add('section', grpClass)
	    section.innerHTML = sectionHTML
		state = {
			...state,
			grpNamesAndClasses: {
				...state.grpNamesAndClasses,
				[grpName]: grpClass
			}
		}

		const list = section.querySelector('.list')
		for (let k = 0; k < groups[grpName].length; k++) {
			const { url, mark } = groups[grpName][k]
			const itemHTML = markTempl(url, mark)

		    list.insertAdjacentHTML('afterbegin', itemHTML)
		}

		initSettings(grpName, customSettings, pairs)
		document.body.appendChild(section)
	}
}

init()

const settingsTempl = (grpName, customSettings, defSetting = 'None') =>
	`<div class="MarkALink_popup__grp">
		<span class="MarkALink_popup__label">${grpName}</span>
		<div class="MarkALink_popup__menu">
			<span class="MarkALink_popup__menu_default">${defSetting}</span>
			<div class="MarkALink_popup__submenu">
				${
					customSettings.map(item => `<a href="#" id="${item}" class="MarkALink_popup__menu_item">${item}</a>`).join('')
				}
				<a href="#" class="MarkALink_popup__menu_item-add">Add new group</a>
			</div>
		</div>
		<input value="New group" class="MarkALink_popup__menu_default MarkALink_popup__menu_default-input MarkALink_popup__menu_default-hide">
	</div>`

const initSettings = (grpName, customSettings, pairs) => {
	// if (grpName === 'Hide') {
	// 	return
	// }
	const settings = document.querySelector('.settings__wrap')
	const customKeys = Object.keys(customSettings)
	const settingsHTML = settingsTempl(grpName, customKeys, pairs[grpName])

	settings.insertAdjacentHTML('afterbegin', settingsHTML)
}
