import {
	getData,
	syncStore
} from '../modules/helpers.js'

const linkTemplate = (href) =>
    `<a class="link" title="Open link in the new tab" target="_blank" href="${href}">
        ${href}
    </a>`

const prepareItems = (arr = []) => {
	const arrOfLinks = arr.map(href =>
		linkTemplate(href))

	return arrOfLinks.join('')
}

const init = async () => {
	const data = await getData()
	const keys = Object.keys(data)
	const length = keys.length

	let marked = []
	let hidden = []

	for (let i = 0; i < length; i++) {
		const key = keys[i]
		if (data[key] === 'mark')
			marked = [...marked, key]
		else if (data[key] === 'hide')
			hidden = [...hidden, key]
	}

	const markedLinks = prepareItems(marked)
	document.querySelector('.marked').innerHTML = markedLinks

	const hiddenLinks = prepareItems(hidden)
	document.querySelector('.hidden').innerHTML = hiddenLinks
}

init()
