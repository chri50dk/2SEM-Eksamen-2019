const mixUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/mixes";
const packageUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/packages";
const venueUrl = "https://viktorkjeldal.dk/kea/2sem/eksamen/wordpress/wp-json/wp/v2/venue";

let loadIterator = 0;

var today = new Date();
var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

var todayDateFormat = new Date(todayDate).getTime();

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

document.addEventListener("DOMContentLoaded", start);

function start() {
    loadContent(loadArray[loadIterator]);
    setTimeout(loadDone, 2000);
}

async function loadContent(contentToLoad) {
    console.log("loadContent");

    //Henter data i filen som er defineret ovenfor
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

function showVenues(content) {
    console.log(content);

    const temp = document.querySelector("#events template");
    const destComing = document.querySelector("#coming_events");
    const destPast = document.querySelector("#past_events");

    content.sort((a, b) => {
        if (a.dato > b.dato) {
            return 1
        } else {
            return -1
        }
    })

    content.forEach(event => {
        const klon = temp.cloneNode(true).content;

        let datePart, year, month, day;

        formatDate(event.dato);

        function formatDate(input) {
            datePart = input.match(/\d+/g);
            year = datePart[0].substring(2); // get only two digits
            month = datePart[1];
            day = datePart[2];

            klon.querySelector(".event h3").textContent = day + '/' + month + '/' + '20' + year;
        }

        klon.querySelector(".event h2").textContent = event.title.rendered;


        let eventDate = new Date(event.dato).getTime();



        if (todayDateFormat > eventDate) {
            console.log(event.title.rendered);
            klon.querySelector(".event h3").textContent = "";


            destPast.appendChild(klon);
        } else {
            destComing.appendChild(klon);
        }
    })
}

//function loadDone() {
//    console.log("loadDone");
//    document.querySelector("#loader").style.display = "none";
//}
