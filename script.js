const ffcdiscussbox = document.getElementById("ffcdiscussion")
const ffchwobox = document.getElementById("ffchwo")
async function updateTextBoxes() {
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=AFDFFC').then(response => response.text()).then(data => {ffcdiscussbox.textContent = data})
    } catch (error) {
        ffcdiscussbox.textContent = "Discussion failed to load. Maybe that's not a bad thing :-)"
    }
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=HWOFFC').then(response => response.text()).then(data => {ffchwobox.textContent = data})
    } catch (error) {
        ffchwobox.textContent = "HWO failed to load. Maybe that's not a bad thing :-)"
    }
}

window.onload = function () {
    updateTextBoxes()
}