import {
	getData,
	syncStore
} from '../modules/helpers.js'

const sectTempl = (grpName) =>
	`<section class="${grpName} section">
		<h2 class="title">
			${grpName}
		</h2>
		<ul class="list">

		</ul>
	</section>`

const markTempl = (url, mark) =>
    `<li class="list__item">
		<a href="${url}" class="list__link">${url}</a>
		<p class="list__text">${mark}</p>
	</li>`

const sortByGrps = async (data) => {
    let obj = {}
    let curMax = 0
    let mostGrp = ''

    for (const prop in data) {
        const grp = data[prop]['grp']

        if (grp in obj) {
            obj[grp] = [...obj[grp], data[prop]]
        } else {
            obj[grp] = [data[prop]]
        }
    }

    return obj
}

const prepareItems = (arr = []) => {
	const arrOfLinks = arr.map(href =>
		markTempl(href))

	return arrOfLinks.join('')
}

const init = async () => {
	const data = await getData()
	const groups = sortByGrps(data)
	const grpNames = Object.keys(groups)
	let dataToRender = []

	for (let i = 0; i < grpNames.length; i++) {

	}

	// let marked = []
	// let hidden = []
	//
	// for (let i = 0; i < length; i++) {
	// 	const key = keys[i]
	// 	if (data[key] === 'mark')
	// 		marked = [...marked, key]
	// 	else if (data[key] === 'hide')
	// 		hidden = [...hidden, key]
	// }
	//
	// const markedLinks = prepareItems(marked)
	// document.querySelector('.marked').innerHTML = markedLinks
	//
	// const hiddenLinks = prepareItems(hidden)
	// document.querySelector('.hidden').innerHTML = hiddenLinks
}

init()
