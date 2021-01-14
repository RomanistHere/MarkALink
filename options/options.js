import {
	getData,
	syncStore
} from '../modules/helpers.js'

const sectTempl = (grpName) =>
	`<h2 class="title">
		${grpName}
	</h2>
	<ul class="list">

	</ul>`

const markTempl = (url, mark) =>
    `<li class="list__item">
		<a href="${url}" class="list__link">${url}</a>
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
	const data = await getData()
	const groups = sortByGrps(data)
	const grpNames = Object.keys(groups)

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

		document.body.appendChild(section)
		console.log(state)
	}
}

init()
