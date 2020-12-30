const loopThorugh = (links, data) => {
    console.log(data)
    links.forEach(item => {
        const url = item.href
        if (url in data) {
            item.classList.add('NotaWay__blocked')
        }
    })
}

const init = async () => {
    const data = await getData()
    const links = document.querySelectorAll('a')

    loopThorugh(links, data)
}

init()

const debInit = debounce(init, 300)
const domObserver = new MutationObserver(mutations => {
    debInit()
})

domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
})
