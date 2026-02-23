// text box fetching
const ahnmetarbox = document.getElementById("ahnmetar")
const cnimetarbox = document.getElementById("cnimetar")
const ffcdiscussbox = document.getElementById("ffcdiscussion")
const ffchwobox = document.getElementById("ffchwo")
const ahncli = document.getElementById("ahncli")
const atlcli = document.getElementById("atlcli")
const alertbox = document.getElementById("alertbox")
const statewide = document.getElementById('alertstatewide');
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
    // pretty up the metars cause they are in csv
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?data=metar&station=AHN&hours=24').then(response => response.text())
        .then(metarText => {
            const rows = metarText.trim().split('\n');
            const metar = rows.map(row => {
                const columns = row.split(',');
                return columns[2] ? columns[2].trim():'';
            });
            const metardata = metar.join('\n')
            ahnmetarbox.textContent = metardata
        })
    } catch (error) {
        ahnmetarbox.textContent = "AHN METAR failed to load. :-("
    }
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?data=metar&station=CNI&hours=24').then(response => response.text())
        .then(metarText => {
            const rows = metarText.trim().split('\n');
            const metar = rows.map(row => {
                const columns = row.split(',');
                return columns[2] ? columns[2].trim():'';
            });
            const metardata = metar.join('\n')
            cnimetarbox.textContent = metardata
        })
    } catch (error) {
        cninmetarbox.textContent = "CNI METAR failed to load. :-("
    }
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=CLIAHN').then(response => response.text()).then(data => {ahncli.textContent = data})
    } catch (error) {
        ahncli.textContent = "AHN Climate Summary failed to load. :-("
    }
    try {
        fetch('https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=CLIATL').then(response => response.text()).then(data => {atlcli.textContent = data})
    } catch (error) {
        atlcli.textContent = "ATL Climate Summary failed to load. :-("
    }
}
async function updateAlertBox() {
    try {
        if (statewide.checked == true) {
            var url = 'https://api.weather.gov/alerts/active?area=GA'
        }
        else {
            var url = 'https://api.weather.gov/alerts/active?point=33.94872107111243,-83.3752234533988'
        }
        const response = await fetch(url)
        const data = await response.json();
        if (data.features.length > 0) {
        let alertMessages = data.features.map(alert => {
            const properties = alert.properties;
            return `<strong>${properties.event}</strong>: ${properties.parameters.NWSheadline}<br><details><summary>More:</summary><p class="alertdetail">Issuing office: ${properties.senderName}<br>${properties.description}</p></details>`;
        });
        alertbox.innerHTML = alertMessages.join('<br>');
        } else {
            alertbox.innerHTML = 'Nothing is happening! ...Really? That\'s boring.';
        }
    }
    catch (error) {
        alertbox.textContent = "Alerts failed to load. I sure hope nothing is happening today..."
        console.log(`alertbox failure: ${error}`)
    }
}
statewide.addEventListener('click', updateAlertBox)

// day selector for wpc stuff
const wpcimage = document.getElementById("wpcimage")
const wpc1 = document.getElementById("wpc1")
wpc1.addEventListener('click', event => {event.preventDefault(); wpcimage.src = 'https://www.wpc.ncep.noaa.gov/NationalForecastChart/staticmaps/noaad1.png'})
const wpc2 = document.getElementById("wpc2")
wpc2.addEventListener('click', event => {event.preventDefault(); wpcimage.src = 'https://www.wpc.ncep.noaa.gov/NationalForecastChart/staticmaps/noaad2.png'})
const wpc3 = document.getElementById("wpc3")
wpc3.addEventListener('click', event => {event.preventDefault(); wpcimage.src = 'https://www.wpc.ncep.noaa.gov/NationalForecastChart/staticmaps/noaad3.png'})

// forecast generator
const forecastForm = document.getElementById('forecastForm')
forecastForm.addEventListener('submit', function (event){
    event.preventDefault();
    
    const floc = document.getElementById('floc')
    const flo = document.getElementById('flo')
    const fopop = document.getElementById('fopop')
    const fhi = document.getElementById('fhi')
    const fapop = document.getElementById('fapop')
    const fstory = document.getElementById('fstory')

    const submittedforecast = document.getElementById("submittedforecast")
    submittedforecast.innerHTML = `Forecast for ${floc.value}<br>Lo: ${flo.value}<br>Early PoP: ${fopop.value}<br>Hi: ${fhi.value}<br>Late PoP: ${fapop.value}<br>${fstory.value}`
})

// autoplot refresh
const iemrefreshbutton = document.getElementById('iemrefresher')
const wwamap = document.getElementById('iemwwa')
const wwasemap = document.getElementById('iemwwase')
const tempmap = document.getElementById('iemtemp')
const dewpmap = document.getElementById('iemdewp')
iemrefreshbutton.addEventListener('click', function(event) {
    console.log('refreshing iem plots')
    wwamap.src = ""
    wwasemap.src = ""
    tempmap.src = ""
    dewpmap.src = ""
    wwamap.src = "https://mesonet.agron.iastate.edu/plotting/auto/plot/247/opt:active::csector:nws::add:stats::sc:yes::dpi:100::_cb:1.png"
    wwasemap.src = "https://mesonet.agron.iastate.edu/plotting/auto/plot/247/opt:active::csector:southeast::add:stats::sc:yes::dpi:100::_cb:1.png"
    tempmap.src = "https://mesonet.agron.iastate.edu/plotting/auto/plot/192/t:state::network:WFO::wfo:DMX::state:GA::v:tmpf::cmap:RdYlBu_r::_r:t::dpi:100::_cb:1.png"
    dewpmap.src = "https://mesonet.agron.iastate.edu/plotting/auto/plot/192/t:state::network:WFO::wfo:DMX::state:GA::v:dwpf::below:-20::cmap:jet::_r:t::dpi:100::_cb:1.png"
})

// top button
let mybutton = document.getElementById("topBtn");
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function toTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
} 

// start page
window.onload = function () {
    updateTextBoxes()
    updateAlertBox()
}
setTimeout(function() { window.location.reload(); }, 600000)