chrome.runtime.onInstalled.addListener(async (details) => {
	const { previousVersion, reason } = details

    if (reason == 'install') {
        
    } else if (reason == 'update') {
		if (previousVersion === '0.1.16') {

		} else {

		}
    }
})
