const mixUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/mixes";
const packageUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/packages";
const venueUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/venue?per_page=100";

let result = [];
let pastEvents = [];
const destComing = document.querySelector("#coming_events");

//Nedenstående kode bruger vi til at få dagens dato, som vi bruger senere i scriptet.
var today = new Date();
var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var todayDateFormat = new Date(todayDate).getTime();

let logo = document.querySelector(".logo");


//Nedenstående er det dynamiske array, som bliver brugt i funktionen loadContent(). I arrayet definerer vi URL'en fra WP, og hvilken funktion der skal kaldes.
const loadArray = [{
    theUrl: mixUrl,
    theFunction: showMixes
}, {
    theUrl: packageUrl,
    theFunction: showPackages
}, {
    theUrl: venueUrl,
    theFunction: showVenues
}];

let loadIterator = 0;

document.addEventListener("DOMContentLoaded", start);

function start() {
    //Vi kalder loadContent() med loadArray som parameter. Vi bruger [loadIterator], for at få plads nummer 0 i arrayet først. Når funktionen er kørt igennem, bruger vi loadIterator++, så vi kan køre funktionen med næste plads i arrayet. På den måde kører vi funktionen X antal gange (X = længde på array), med hvert objekt i arrayet.
    loadContent(loadArray[loadIterator]);
    bookingOption();
    loadMore();

    //Vi lytter på hele vinduets scroll, og ser efter hvornår vi scroller ned til vores headline. Når toppen af skærmen rammer toppen af headlinen, får den position: sticky; som gør at den "klistrer" til skærmens top. Når vi så rammer næste headline, er det den der bliver sticky.
    window.addEventListener("scroll", () => {
        var elementTarget = document.querySelectorAll(".headlines");

        elementTarget.forEach(headline => {
            if (window.scrollY - window.innerHeight > headline.offsetTop) {
                console.log("SCROLL PAST");
                headline.style.position = "sticky";
            }
        });
    })

}



async function loadContent(contentToLoad) {
    console.log("loadContent");

    //I denne funktion loader vi alt JSON data fra WordPress, og kalder den valgte funktionen (i arrayet), med indholdet som parameter.
    let jsonData = await fetch(contentToLoad.theUrl);
    let content;

    content = await jsonData.json();

    contentToLoad.theFunction(content);
    loadIterator++;

    if (loadIterator < loadArray.length) {
        loadContent(loadArray[loadIterator]);
    }
}

function showMixes(content) {
    console.log(content);
}

function showPackages(content) {
    console.log(content);
}

let eventCount;


function showVenues(content) {
    console.log(content);

    eventCount = 0;

    const temp = document.querySelector("#events template");

    const destPast = document.querySelector("#past_events");

    //Her sorteres arrayet efter dato, så ligemeget hvilken rækkefølge events bliver oprettet i, bliver de sorteret her.
    content.sort((a, b) => {
        if (a.dato > b.dato) {
            return 1
        } else {
            return -1
        }
    })

    //Her køres hvert event igennem forEach loopet, som viser dem i DOM'en.
    content.forEach(event => {
        eventCount++;
        const klon = temp.cloneNode(true).content;

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

            klon.querySelector(".event h3").textContent = day + '/' + month + '/' + year;
        }

        //Her laver vi datoen om med getTime() funktionen, som giver os tiden mellem den 1. januar 1970 kl. 00:00 og den dato vi vælger, i millisekunder. Derved kan vi sammenligne eventets dato med dagens dato, og pushe de gamle events ind i sit eget array.

        let eventDate = new Date(event.dato).getTime();

        if (todayDateFormat > eventDate) {
            console.log(event.title.rendered);
            pastEvents.push(event.title.rendered);
        } else {
            destComing.appendChild(klon);
        }





        //Nu kalder vi en funktion removeDup med vores gamle events som parameter. Denne funktionen sorterer alle duplikerede events fra. Dette gør vi for ikke at vise "Rumors" to gange for eksempel. Vi sætter så alle de unikke spillesteder ind i et nyt array (result[]).

        //Kilde: https://stackoverflow.com/questions/54757902/remove-duplicates-in-an-array-using-foreach

        removeDup(pastEvents);

        function removeDup(arr) {
            arr.forEach((item, index) => {
                if (arr.indexOf(item) == index) result.push(item)
            });

        }

        //Det nye array kører vi nu igennem et forEach loop, og viser dem i DOM'en.
        //    result.forEach(pastEvent => {
        //        const klon = temp.cloneNode(true).content;
        //        klon.querySelector(".event h2 + h2").textContent = pastEvent;
        //        destPast.appendChild(klon);
        //    })
    })
}

function loadMore() {
    console.log("loadMore");
    document.querySelector("#load_more").addEventListener("click", () => {
        console.log("CLICK LOAD MORE");
        destComing.classList.add("load_more_toggle");
        document.querySelector("#load_more").style.display = "none";
    })
}



function loadDone() {
    console.log("loadDone");


    let logoContatiner = document.querySelector("#loader");
    let containerWrapper = document.querySelector("#loader_wrapper");

    logo.classList.add("logo_loaded");
    logoContatiner.classList.add("loader_loaded");
    logoContatiner.style.backgroundColor = "transparent";
    containerWrapper.classList.add("wrapper_loaded");
}


function bookingOption() {
    console.log("bookingOption");
    let picker = document.querySelector("#contact_type");
    let bookingForm = document.querySelector("#contact_booking");
    let businessForm = document.querySelector("#contact_business");

    picker.addEventListener("change", () => {
        if (picker.value === "booking") {
            console.log("booking");
            bookingForm.style.display = "block";
            businessForm.style.display = "none";
        } else if (picker.value === "business") {
            console.log("business");
            bookingForm.style.display = "none";
            businessForm.style.display = "block";
        } else {
            console.log("none");
            bookingForm.style.display = "none";
            businessForm.style.display = "none";
        }
    })

}
