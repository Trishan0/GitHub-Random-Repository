async function getLanguages() {
    const url = "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    const parentEl = document.getElementById('lang')

    try {
        const response = await fetch(url)
        if (!response.ok) {
           console.error(`Response status : ${response.status}`)
        }

        const json = await response.json();

        for (const language of json.slice(1)) {
            const opt = document.createElement('option')
            opt.innerText = language.value
            opt.value = language.value
            parentEl.append(opt)
        }
    } catch (error) {
        console.error(error.message)
    }

}
getLanguages()

