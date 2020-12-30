const getStorageData = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
            ? reject(Error(chrome.runtime.lastError.message))
            : resolve(result)
        )
    )
// const resp = await getStorageData(null)

const lengthInUtf8Bytes = (str) => {
    const m = encodeURIComponent(str).match(/%[89ABab]/g)
    return str.length + (m ? m.length : 0)
}

const syncStore = (key, objectToStore, callback) => {
    let jsonstr = JSON.stringify(objectToStore), i = 0, storageObj = {},
        maxBytesPerItem = chrome.storage.sync.QUOTA_BYTES_PER_ITEM,
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
