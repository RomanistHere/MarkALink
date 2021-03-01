const getStorageData = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            browser.runtime.lastError
            ? reject(Error(browser.runtime.lastError.message))
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

const syncStore = (key, objectToStore, callback) => {
    const lengthInUtf8Bytes = (str) => {
        const m = encodeURIComponent(str).match(/%[89ABab]/g)
        return str.length + (m ? m.length : 0)
    }

    let jsonstr = JSON.stringify(objectToStore), i = 0, storageObj = {},
        maxBytesPerItem = 8192,
        maxValueBytes, index, segment, counter

    while (jsonstr.length > 0) {
        index = key + "_" + i++
        maxValueBytes = maxBytesPerItem - lengthInUtf8Bytes(index)

        counter = maxValueBytes
        segment = jsonstr.substr(0, counter)
        while ((lengthInUtf8Bytes(JSON.stringify(segment)) + key.length) > maxValueBytes)
            segment = jsonstr.substr(0, --counter)

        storageObj[index] = segment
        jsonstr = jsonstr.substr(counter)
    }

    storageObj[key] = i

	chrome.storage.sync.clear(function(){
        chrome.storage.sync.set(storageObj, callback)
    })
}

const getStorageDataLocal = key =>
	new Promise((resolve, reject) =>
		chrome.storage.local.get(key, result =>
			browser.runtime.lastError
				? reject(Error(browser.runtime.lastError.message))
				: resolve(result)
		)
	)

const setStorageDataLocal = data =>
	new Promise((resolve, reject) =>
		chrome.storage.local.set(data, () =>
			browser.runtime.lastError
				? reject(Error(browser.runtime.lastError.message))
				: resolve()
		)
	)

export {
	getData,
	syncStore,
    getStorageDataLocal,
    setStorageDataLocal
}
