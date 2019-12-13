let result = [];
let pastEvents = [];
let venuesPlayedSet;
let venuesPlayed = [];
let eventCount;
let comingEventCount;
let burgerKnap = document.querySelector("#burger_knap");

//Nedenstående kode bruger vi til at få dagens dato, som vi bruger senere i scriptet.
var today = new Date();
var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var todayDateFormat = new Date(todayDate).getTime();

//Nedenstående er det dynamiske array, som bliver brugt i funktionen loadContent(). I arrayet definerer vi URL'en fra WP, og hvilken funktion der skal kaldes.
const venueUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/venue?per_page=100";
const aboutUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/about/58";
const djschoolUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/djschool/74";

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

let loadIterator = 0;

document.addEventListener("DOMContentLoaded", start);

function start() {
    loader();

    burgerKnap.addEventListener("click", openMenu);

    //Vi kalder loadContent() med loadArray som parameter. Vi bruger [loadIterator], for at få plads nummer 0 i arrayet først. Når funktionen er kørt igennem, bruger vi loadIterator++, så vi kan køre funktionen med næste plads i arrayet. På den måde kører vi funktionen X antal gange (X = længde på array), med hvert objekt i arrayet.
    loadContent(loadArray[loadIterator]);
    contactType();

    //Vi lytter på hele vinduets scroll, og ser efter hvornår vi scroller ned til vores headline. Når toppen af skærmen rammer toppen af headlinen, får den position: sticky; som gør at den "klistrer" til skærmens top. Når vi så rammer næste headline, er det den der bliver sticky.
    window.addEventListener("scroll", () => {
        let elementTarget = document.querySelectorAll(".headlines");

        elementTarget.forEach(headline => {
            if (window.scrollY - window.innerHeight > headline.offsetTop) {
                console.log("SCROLL PAST");
                headline.style.position = "sticky";
            }
        });
    })
}

function contactType() {
    let contactType = document.querySelector("#contact_type");
    let businessField = document.querySelector("#business_field");
    let venueField = document.querySelector("#venue_field");

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

let loaderScreen = document.querySelector("#loader");
let main = document.querySelector("main");
let footer = document.querySelector("footer");

let progress = document.querySelector("#progress");

let width = 0;

let timer = setInterval(loader, 5);

function loader() {
    width = width + 0.2;

    main.style.display = "none";
    footer.style.display = "none";

    progress.style.width = width + "%";

    if (width > 100) {
        console.log("100");
        clearInterval(timer);
        loaderScreen.style.animationName = "removeLoader";
        loaderScreen.addEventListener("animationend", () => {
            main.style.display = "block";
            footer.style.display = "block";
        })
    }
}

//I denne funktion loader vi alt JSON data fra WordPress i en asynkron funktion,
//og kalder den valgte funktionen (i arrayet), med indholdet som parameter.
async function loadContent(contentToLoad) {
    //Vi henter dataen fra filen som er defineret i variablen theUrl.
    let jsonData = await fetch(contentToLoad.theUrl);
    let content;

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
    console.log(content);

    document.querySelector("#about p").textContent = content.about_1;
    /*  document.querySelector("#about p + p").textContent = content.about_2;*/
}

function showDjschool(content) {
    console.log(content);

    document.querySelector("#dj_school h2").textContent = content.djschool_overskrift;
    document.querySelector("#dj_school p").textContent = content.djschool_1;
    document.querySelector("#dj_school p + p").textContent = content.djschool_2;
}


function showVenues(content) {
    console.log(content);

    eventCount = 0;
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

    console.log(content);

    //Her køres hvert event igennem forEach loopet, som viser dem i DOM'en.
    content.forEach(event => {
        eventCount++;
        const klon = upcomingTemp.cloneNode(true).content;

        //Her skrives navnet på venuet og tidspunktet ind i templaten
        klon.querySelector(".event h2 + h2").textContent = event.title.rendered;
        klon.querySelector(".event h3 + h3").textContent = event.start_time + " - " + event.end_time;

        //Her formaterer vi datoen, så vi kan skrive den i dd/mm/yyyy i stedet for yyyy-mm-dd
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
        //Her indsætter vi alle gamle events i et array der hedder pastEvents.
        //For at få de 3 første events ud som de highlightede events, bruger vi en variable til at holde styr på det
        //De 3 første events bliver skrevet ud i destComing.

        if (todayDateFormat > eventDate) {

            pastEvents.push(event.title.rendered);
        } else if (comingEventCount < 3) {

            comingEventCount++;
            if (comingEventCount === 1) {
                klon.querySelector(".event").id = "first_event";
            }

            destComing.appendChild(klon);

        } else {
            //Resten af events'ene bliver stylet her, og  skrevet ud i destComingScroll
            klon.querySelector(".event h2 + h2").textContent = day + '/' + month + '/' + year;
            klon.querySelector(".event h2 + h2").style.fontSize = "2rem";
            klon.querySelector(".event h3").textContent = event.title.rendered;
            klon.querySelector(".event h3").style.fontSize = "3rem";
            klon.querySelector(".event").style.height = "50px";
            klon.querySelector(".event").style.flexDirection = "row";
            klon.querySelector(".event").style.marginTop = "5px";
            klon.querySelector(".event").style.justifyContent = "flex-start";
            klon.querySelector(".event").style.paddingLeft = "15px";
            klon.querySelector(".event h3 + h3").textContent = "";
            klon.querySelector(".event h3").style.marginLeft = "15px";
            klon.querySelector(".venue_headline").textContent = "";

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

    //Det nye array med alle de unikke spillesteder bliver kørt igennem et forEach loop, og skrevet ud i destPast
    venuesPlayed.forEach(venuePlayed => {
        const klon = venueTemp.cloneNode(true).content;
        klon.querySelector(".venue_art h3").textContent = venuePlayed;
        destPast.appendChild(klon);
    })
}


function openMenu() {
    console.log("openMenu");

    burgerKnap.classList.toggle("open");

    document.querySelector("#menu").classList.toggle("toggle_menu");

    let links = document.querySelectorAll(".menu_links a");

    links.forEach(link => {
        link.addEventListener("mouseup", toggleMenu);
    })
}

function toggleMenu() {
    console.log("toggleMenu");
    burgerKnap.classList.toggle("open");
    document.querySelector("#menu").classList.toggle("toggle_menu");
}
