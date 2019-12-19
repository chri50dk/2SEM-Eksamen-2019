//Her definerer vi globale variabler, som vi kan snakke til i hele scriptet
let result = [];
let pastEvents = [];
let venuesPlayed = [];
let comingEventCount;
let burgerKnap = document.querySelector("#burger_knap");
let loadIterator = 0;

//Nedenstående kode bruger vi til at få dagens dato, som vi bruger senere i scriptet.
let today = new Date();
let todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let todayDateFormat = new Date(todayDate).getTime();

const venueUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/venue?per_page=100";
const aboutUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/about/58";
const djschoolUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/djschool/74";

//Nedenstående er det dynamiske array, som bliver brugt i funktionen loadContent(). I arrayet definerer vi URL'en fra WP, og hvilken funktion der skal kaldes.
const loadArray = [{
    theUrl: aboutUrl,
    theFunction: showAbout
}, {
    theUrl: venueUrl,
    theFunction: showVenues
}, {
    theUrl: djschoolUrl,
    theFunction: showDjschool
}];

document.addEventListener("DOMContentLoaded", start);

function start() {
    //I vores start funktion kalder vi forskellige funktioner, og gør vores burgermenu klikbar, så den kan åbnes.
    contactType();
    loader();

    //Vi kalder loadContent() med loadArray som parameter. Vi bruger [loadIterator], for at få plads nummer 0 i arrayet først. Når funktionen er kørt igennem, bruger vi loadIterator++, så vi kan køre funktionen med næste plads i arrayet. På den måde kører vi funktionen X antal gange (X = længde på array), med hvert objekt i arrayet.
    loadContent(loadArray[loadIterator]);

    burgerKnap.addEventListener("click", openMenu);
}

function contactType() {
    let contactType = document.querySelector("#contact_type");
    let businessField = document.querySelector("#business_field");
    let venueField = document.querySelector("#venue_field");

    //I denne funktion lytter vi til hvilken valgmulighed der bliver valgt i vores kontaktformular. Hvis der bliver valgt en ting, skal der ske en ting, og hvis der bliver valgt en anden, skal der ske noget andet.
    contactType.addEventListener("change", () => {
        if (contactType.value === "Booking Request") {
            console.log("BOOKING");
            businessField.style.display = "none";
            venueField.style.display = "block";

        } else if (contactType.value === "Business Inquiry") {
            console.log("BUSINESS");
            businessField.style.display = "block";
            venueField.style.display = "none";
        } else if (contactType.value === "DJ-School Inquiry") {
            console.log("SCHOOL");
            businessField.style.display = "none";
            venueField.style.display = "none";
        } else {
            businessField.style.display = "none";
            venueField.style.display = "none";
        }
    })
}

//Globale variabler, som vi bruger i loader() funktionen.
//timer variablen er et interval, som betyder at den kalder funktionen loader() hver 5. millisekund.
let width = 0;
let timer = setInterval(loader, 5);

function loader() {
    let loaderScreen = document.querySelector("#loader");
    let progress = document.querySelector("#progress");
    let main = document.querySelector("main");
    let footer = document.querySelector("footer");

    //Hver gang funktionen bliver kaldt, hver 5. millisekund, bliver width variablen tilføjet 0.2. Loaderen er altså ikke en rigtig loader, da den altid vil være loadet efter 2.5 sekunder, men man får fornemmelsen af det.
    width = width + 0.23;

    progress.style.width = width + "%";

    //Når width rammer 100 bliver if sætningen true, og den bliver kørt - preloaderen forsvinder og sidens indhold kommer til syne.
    if (width > 100) {
        //        console.log("LOAD DONE");
        clearInterval(timer);
        loaderScreen.style.animationName = "removeLoader";

        loaderScreen.addEventListener("animationend", () => {
            main.style.display = "block";
            footer.style.display = "block";
        })
    }
}

//I denne funktion henter vi alt JSON data fra WordPress i en asynkron funktion, og kalder den valgte funktionen (i arrayet), med indholdet som parameter.
async function loadContent(contentToLoad) {
    let content;

    //Vi henter dataen fra filen som er defineret i variablen theUrl.
    let jsonData = await fetch(contentToLoad.theUrl);

    //Vi siger at den hentede data skal tolkes som JSON format.
    content = await jsonData.json();

    //Til sidst kalder vi funktionen der skal vise dataen i DOM'en.
    contentToLoad.theFunction(content);

    loadIterator++;
    if (loadIterator < loadArray.length) {
        loadContent(loadArray[loadIterator]);
    }
}

function showAbout(content) {
    //Her bruger vi indholdet som vi lige har hentet fra JSON, og skriver det ud i DOM'en det valgte sted.
    document.querySelector("#about h2").textContent = content.about_overskrift;
    document.querySelector("#about h2 + p").textContent = content.about_1;
}

function showDjschool(content) {
    //Her bruger vi indholdet som vi lige har hentet fra JSON, og skriver det ud i DOM'en det valgte sted.
    document.querySelector("#dj_school h2").textContent = content.djschool_overskrift;
    document.querySelector("#dj_school p").textContent = content.djschool_1;
    document.querySelector("#dj_school p + p").textContent = content.djschool_2;
}

function showVenues(content) {
    console.log("Venue indhold direkte fra JSON:")
    console.log(content);

    comingEventCount = 0;

    //Her definerer vi vores templates og destinationer
    const upcomingTemp = document.querySelector("#upcoming_temp");
    const venueTemp = document.querySelector("#venue_temp");

    const destComing = document.querySelector("#coming_events");
    const destComingScroll = document.querySelector("#coming_events_scroll");
    const destPast = document.querySelector("#past_events");

    //Her sorteres arrayet efter dato, så ligemeget hvilken rækkefølge events bliver oprettet i, bliver de sorteret her.
    content.sort((a, b) => {
        if (a.dato > b.dato) {
            return 1
        } else {
            return -1
        }
    })

    //Her køres hvert objekt i arrayet igennem forEach loopet, som viser dem i DOM'en.
    content.forEach(event => {
        //Her laver vi en klon, som er lig med vores template, som vi bruger til at skrive hvert event ud i.
        const klon = upcomingTemp.cloneNode(true).content;

        //Her skrives navnet på venuet og tidspunktet ind i templaten.
        klon.querySelector(".event h2 + h2").textContent = event.title.rendered;
        klon.querySelector(".event h3 + h3").textContent = event.start_time + " - " + event.end_time;

        //Når vi får datoen fra WP Rest API får vi den i formatet yyyy-mm-dd. For at kunne skrive den i formatet dd/mm/yyyy skal vi "skille den ad", i år, måned og dag. Derfor kører vi funktionen formatDate med eventets dato som parameter.
        let datePart, year, month, day;
        formatDate(event.dato);

        function formatDate(input) {
            //Her dekonstruerer vi datoen, så vi får den i formatet (yyyy, mm, dd), og derefter sætter vi year, month og day til at være lig med de respektive pladser, hvorefter vi kan skrive datoen i DOM'en som vi vil.
            datePart = input.match(/\d+/g);
            year = datePart[0];
            month = datePart[1];
            day = datePart[2];

            //Her skrives datoen ind i templaten
            klon.querySelector(".event h3").textContent = day + '/' + month + '/' + year;
        }

        //Her laver vi datoen om med getTime() funktionen, som giver os tiden mellem den 1. januar 1970 kl. 00:00 og den dato vi vælger, i millisekunder. Derved kan vi sammenligne eventets dato med dagens dato, og pushe de gamle events ind i sit eget array.
        let eventDate = new Date(event.dato).getTime();

        //Her indsætter vi titlen på alle gamle events i et array der hedder pastEvents.
        //For at få de 3 første events ud som de highlightede events, bruger vi variblen comingEventCount til at holde styr på det
        //De 3 første events bliver skrevet ud i destComing.
        if (todayDateFormat > eventDate) {
            pastEvents.push(event.title.rendered.toLowerCase());
        } else if (comingEventCount < 3) {
            comingEventCount++;
            if (comingEventCount === 1) {
                klon.querySelector(".event").id = "first_event";
            }

            //De 3 første bliver skrevet ud i destComing destinationen.
            destComing.appendChild(klon);
        } else {
            comingEventCount++;

            //Resten af events'ene bliver stylet her, og  skrevet ud i destComingScroll
            klon.querySelector(".event h2 + h2").textContent = day + '/' + month + '/' + year;
            klon.querySelector(".event h2 + h2").style.fontSize = "2rem";
            klon.querySelector(".event h3").textContent = event.title.rendered;
            klon.querySelector(".event h3").style.fontSize = "2.2rem";
            klon.querySelector(".event").style.height = "50px";
            klon.querySelector(".event").style.flexDirection = "row";
            klon.querySelector(".event").style.marginTop = "5px";
            klon.querySelector(".event").style.justifyContent = "flex-start";
            klon.querySelector(".event").style.paddingLeft = "15px";
            klon.querySelector(".event h3 + h3").textContent = "";
            klon.querySelector(".event h3").style.marginLeft = "15px";
            klon.querySelector(".venue_headline").textContent = "";

            //Det første event i destComingScroll skal ikke have margin i toppen, den fjerner vi her.
            if (comingEventCount === 4) {
                klon.querySelector(".event").style.marginTop = "0";
            }

            //Her lytter vi på om bredden på vinduet er over 430px, og så laver vi skriftstørrelsen større. Det er en media query i javascript.
            if (window.innerWidth > 430) {
                klon.querySelector(".event h3").style.fontSize = "2.8rem";
            }

            //Til sidst bliver de skrevet ud i den rette destination.
            destComingScroll.append(klon);
        }
    })

    //Her kalder vi funktionen removeDup, for at fjerne duplikerede spillesteder
    //Kilde: https://stackoverflow.com/questions/54757902/remove-duplicates-in-an-array-using-foreach

    removeDup(pastEvents);

    function removeDup(arr) {
        arr.forEach((item, index) => {
            if (arr.indexOf(item) == index) venuesPlayed.push(item)
        });
    }

    console.log(venuesPlayed);

    //Det nye array med alle de unikke spillesteder bliver kørt igennem et forEach loop, og skrevet ud i destPast
    venuesPlayed.forEach(venuePlayed => {
        const klon = venueTemp.cloneNode(true).content;

        //Her tilføjer vi (RESIDENT) på de steder hvor Lisa er resident DJ
        if (venuePlayed === "rust" || venuePlayed === "mau mau 5" || venuePlayed === "medusa" || venuePlayed === "kimia") {
            klon.querySelector(".venue_art h3").textContent = venuePlayed + " (RESIDENT)";
        } else {
            klon.querySelector(".venue_art h3").textContent = venuePlayed;
        }

        destPast.appendChild(klon);
    })
}

function openMenu() {
    //Hver gang der klikkes på burgerKnap bliver denne funktion kaldt.
    console.log("openMenu");

    //Knappen, selve menuen og overlayet toggler de klasser der viser dem og skjuler dem. Toggle betyder, at hvis klassen allerede er på, fjerner den den, og hvis den ikke er på, tilføjer den den.
    burgerKnap.classList.toggle("open");
    document.querySelector("#menu").classList.toggle("toggle_menu");
    document.querySelector(".menu_overlay").classList.toggle("overlay_on_off");

    let links = document.querySelectorAll(".menu_links a");

    //Da det er en one-pager, bliver vi nødt til at lytte på hvert link, efter et tryk. Så når man løfter musen eller fingeren fra et link, bliver funktionen toggleMenu kaldt, hvilket lukker menuen.
    links.forEach(link => {
        link.addEventListener("mouseup", toggleMenu);
    })
}

function toggleMenu() {
    console.log("toggleMenu");
    burgerKnap.classList.toggle("open");
    document.querySelector("#menu").classList.toggle("toggle_menu");
    document.querySelector(".menu_overlay").classList.toggle("overlay_on_off");
}
