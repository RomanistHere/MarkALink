const sectTempl = (grpName) =>
	`<h2 class="title">
		${grpName}
		${
			(grpName === 'Hide' || grpName === 'Marked')
				? ''
				: `<a href="#" title="Delete '${grpName}' group and all the Marks" class="title__remove">x</a>`
		}
	</h2>
	<ul class="list">

	</ul>`

const markTempl = (url, mark) =>
    `<li class="list__item" tabindex="0">
		<div class="list__glitch_wrap">
			<a href="${url}" title="${url}" class="list__link">${url}</a>
			<a href="${url}" title="${url}" class="list__link list__link-glitch" tabindex="-1">${url}</a>
		</div>
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
	const grpNames = Object.keys(groups).sort((a, b) => {
		const nameA = a.toLowerCase()
		const nameB = b.toLowerCase()

		if (nameA < nameB)
			return -1

		if (nameA > nameB)
			return 1

		return 0;
	});

	// console.log(customSettings)
	// console.log(data)
	// console.log(groups)
	// console.log(pairs)
	// console.log(grpNames)

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
			const listItem = list.querySelector('.list__item')
			listItem.addEventListener('click', e => {
				console.log('click')
				if (e.target.nodeName !== 'A') {
					e.preventDefault()
					initPopUp(url, e.currentTarget)
				}
			})

			listItem.addEventListener("keyup", e => {
				if (e.keyCode === 13)
					listItem.click()
			})
		}

		initSettings(grpName, customSettings, pairs)
		document.body.appendChild(section)

		const deleteGrp = section.querySelector('.title__remove')
		if (!deleteGrp)
			continue

		deleteGrp.addEventListener('click', e => {
			e.preventDefault()

			removeGrp(grpName)
		})
	}
}

const showError = e => {
	console.log(e)
	alert('Error')
}

const removeGrp = async (grpName) => {
	let { pairs } = await getStorageDataLocal('pairs')
	let data = await getData()

	for (const prop in data) {
        const grp = data[prop]['grp']

        if (grp === grpName) {
			delete data[prop]
			delete pairs[grpName]
        }
    }

	try {
		await setStorageDataLocal({ pairs: { ...pairs } })
		await syncStore('na', data)
		defCallBack()
		location.reload()
	} catch (e) {
		showError(e)
	}
}

init()

const settingsTempl = (grpName, customSettings, defSetting = 'None') =>
	`<div class="MarkALink_popup__grp">
		<span class="MarkALink_popup__label">${grpName}:</span>
		<div class="MarkALink_popup__menu">
			<span class="MarkALink_popup__menu_default">${defSetting}</span>
			<div class="MarkALink_popup__submenu">
				${
					customSettings.map(item => `<a href="#" id="${item}" class="MarkALink_popup__menu_item">${item}</a>`).join('')
					// <a href="#" class="MarkALink_popup__menu_item-add">Add new group</a>
				}
			</div>
		</div>
		<input value="New group" class="MarkALink_popup__menu_default MarkALink_popup__menu_default-input MarkALink_popup__menu_default-hide">
	</div>`

const defCallBack = () => {
    chrome.tabs.query({ url: null }, resp => {
        Object.values(resp).forEach(item => {
            chrome.tabs.sendMessage(item.id, 'updated')
        })
    })
}

const initSettings = (grpName, customSettings, pairs) => {
	if (grpName === 'Hide') {
		return
	}

	const settingsWrap = document.querySelector('.settings__wrap')
	const customKeys = Object.keys(customSettings)
	const settings = document.createElement('div')
	settings.classList.add('MarkALink_popup__grp')
	const settingsHTML = settingsTempl(grpName, customKeys, pairs[grpName])

	settings.insertAdjacentHTML('afterbegin', settingsHTML)

	// groups
    const name = settings.querySelector('.MarkALink_popup__menu_default')
    const groupBtns = settings.querySelectorAll('.MarkALink_popup__menu_item')
    groupBtns.forEach(item => item.addEventListener('click', async (e) => {
        e.preventDefault()

		let { pairs } = await getStorageDataLocal('pairs')

        item.parentNode.classList.add('MarkALink_popup__submenu-hide')
        setTimeout(() => item.parentNode.classList.remove('MarkALink_popup__submenu-hide'), 400)

		delete pairs[grpName]

		const newCustSet = item.id
		const newPairs = { ...pairs, [grpName]: newCustSet }

		try {
			name.textContent = newCustSet
			await setStorageDataLocal({
				pairs: { ...newPairs }
			})
			defCallBack()
		} catch (e) {
			showError(e)
		}
    }))

    // const addGrp = grp => {
    //     if (state.existingGroups.includes(grp)) {
    //         console.log('existing')
    //         alert('Try different name!')
    //         return
    //     }
	//
    //     name.textContent = grp
    //     state = {
    //         ...state,
    //         grp: grp,
    //         existingGroups: [...state.existingGroups, grp]
    //     }
	//
    //     menu.classList.remove('MarkALink_popup__menu_default-hide')
    //     newGrpInput.classList.add('MarkALink_popup__menu_default-hide')
    //     name.classList.remove('MarkALink_popup__menu_default-hide')
	//
    //     submenu.insertAdjacentHTML('afterbegin', `<a href="#" id="${grp}" class="MarkALink_popup__menu_item">${grp}</a>`)
    // }
	//
    // const newGrpInput = settings.querySelector('.MarkALink_popup__menu_default-input')
    // const menu = settings.querySelector('.MarkALink_popup__menu')
    // const submenu = settings.querySelector('.MarkALink_popup__submenu')
    // const addNewGrpBtn = settings.querySelector('.MarkALink_popup__menu_item-add')
    // addNewGrpBtn.addEventListener('click', e => {
    //     e.preventDefault()
	//
    //     addNewGrpBtn.parentNode.classList.add('MarkALink_popup__submenu-hide')
    //     setTimeout(() => addNewGrpBtn.parentNode.classList.remove('MarkALink_popup__submenu-hide'), 400)
	//
    //     menu.classList.add('MarkALink_popup__menu_default-hide')
    //     name.classList.add('MarkALink_popup__menu_default-hide')
    //     newGrpInput.classList.remove('MarkALink_popup__menu_default-hide')
	//
    //     newGrpInput.focus()
    //     newGrpInput.select()
    // })
	//
    // newGrpInput.addEventListener('blur', e => {
    //     addGrp(e.currentTarget.value.trim())
    // })
	//
    // newGrpInput.addEventListener('keyup', e => {
    //     if (e.keyCode === 13) {
    //         e.preventDefault()
    //         newGrpInput.blur()
    //     }
    // })

	settingsWrap.appendChild(settings)
}
