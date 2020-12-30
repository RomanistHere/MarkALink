const debounce = (func, wait, immediate) => {
	var timeout
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

const getStorageData = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
            ? reject(Error(chrome.runtime.lastError.message))
            : resolve(result)
        )
    )

const getData = async () => {
    let resp = await getStorageData(null)
    let string = ''

    delete resp['na']
    Object.values(resp).forEach(item => {
        string = string + item
    })

	if (string.length === 0) {
		return {}
	}

	try {
	    const obj = JSON.parse(string)
	    return obj
	} catch (e) {
		console.log(e)
	}
}
