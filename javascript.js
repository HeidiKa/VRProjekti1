//PAIKANNETAAN OMA SIJAINTI HETI SIVULLE PÄÄSTÄESSÄ (ALEKSI)
paikanna();

//ASETETAAN SIVULLE TULTAESSA NYKYINEN PÄIVÄMÄÄRÄ JA AIKA NIILLE KUULUVIIN KENTTIIN (ALEKSI JA HEIDI)
var nykyaika;

function asetaAikaJaPaivamaara() {
    var aika = new Date();

    if (aika.getHours() < 10) {
        if (aika.getMinutes() === 00) {
            nykyaika = "00"
        } else {
            nykyaika = "0" + aika.getHours();
        }
    } else {
        nykyaika = aika.getHours();
    }
    console.dir(nykyaika);
    if (aika.getMinutes() < 10) {
        if (aika.getMinutes() === 00) {
            nykyaika += ":00"
        } else {
            nykyaika += ":0" + aika.getMinutes();
        }
    } else {
        nykyaika += ":" + aika.getMinutes();
    }
    console.dir(nykyaika);

    document.getElementById("kellonaika").value = nykyaika;

    if (aika.getMonth() < 10) {
        var paivamaara = "" + aika.getFullYear() + "-0" + (aika.getMonth() + 1) + "-" + aika.getDate();
    } else {
        var paivamaara = "" + aika.getFullYear() + "-" + (aika.getMonth() + 1) + "-" + aika.getDate();
    }

    document.getElementById("paivamaara").value = paivamaara;
}

asetaAikaJaPaivamaara();

// ALEKSI JA VELLU ----

// -------------  JUNA-ASEMATIETOJEN HAKEMINEN ------------
// Koodi hakee asemien asemakoodit käyttäjän haun perusteella

var asemaArray;
var xhr1 = new XMLHttpRequest();
var asematHaettu;

function asematiedot() {
    xhr1.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations");
    xhr1.send(null);
}

// Funktio hakee asemien tiedot muuttujaksi
// Käytetään asemien nimien lyhytkoodien hakemiseen käyttäjän haun perusteella

if (asematHaettu == null) {
    asematiedot();
    asematHaettu = true;
}

xhr1.onreadystatechange = tilavaihtu1;
var asemienSijainnit = [];

function tilavaihtu1() {
    if (xhr1.readyState == 4) {
        jsonAsemat = xhr1.responseText;
        asemaArray = JSON.parse(jsonAsemat);

        //console.dir(asemaArray);
        for (var i = 0; i < asemaArray.length; i++) {
            asemienSijainnit.push(asemaArray[i].latitude + ";" + asemaArray[i].longitude);
        }
        console.dir(asemienSijainnit);
    }
}

// SEURAAVASSA PÄTKÄSSÄ SUORITETAAN PAIKANNA FUNKTIO JA ASETETAAN LAT JA LON (ALEKSI)
var lyhinEtaisyys = 1000000;
var lyhinEtaisuusLat;
var lyhinEtaisyysLon;
var lat1;
var lon1;

function paikanna() {
    navigator.geolocation.getCurrentPosition(success, failure, {enableHighAccuracy: true});
}

function success(data) {
    lat1 = data.coords.latitude;
    lon1 = data.coords.longitude;
    console.dir(lat1);
    console.dir(lon1);
}

function failure(error) {
    console.dir(error);
}

//lASKETAAN LÄHIN ASEMA, KUN KÄYTTÄJÄ PAINAA BUTTONIA LÄHIN ASEMA. LÄHIN ASEMA
// SIJOITETAAN AUTOMAATTISESTI LÄHTÖPAIKKA KENTTÄÄN (ALEKSI)
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
}

function lahinAsema() {
    for (var i = 0; i < asemienSijainnit.length; i++) {
        var koordinaatit = asemienSijainnit[i].split(";");
        var R = 6371e3;
        var lat2 = koordinaatit[0];
        var lon2 = koordinaatit[1];
        var radLat1 = Math.radians(lat1);
        var radLat2 = Math.radians(lat2);
        var deltaLat = Math.radians(lat2 - lat1);
        var deltaLon = Math.radians(lon2 - lon1);

        var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        if (d < lyhinEtaisyys) {
            lyhinEtaisyys = d;
            console.dir(d)
            lyhinEtaisuusLat = koordinaatit[0];
            lyhinEtaisyysLon = koordinaatit[1];
        }
    }
    for (var i = 0; i < asemaArray.length; i++) {
        if (asemaArray[i].latitude == lyhinEtaisuusLat && asemaArray[i].longitude == lyhinEtaisyysLon) {
            document.getElementById("mista").value = asemaArray[i].stationName;
        }
    }
}

//--------------- JUNA-AIKATAULUJEN HAKEMINEN KÄYTTÄJÄN HAUN PERUSTEELLA -------------
// validointi: kirjoituksen koko,

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = tilavaihtu;

function hae() {

    var lahtopaikka = "";
    var maaranpaa = "";
    var paivamaara;
    var hakuaVastaavatLahtoAsemat = [];
    var hakuaVastaavatSaapumisasemat = [];

    // Hakee käyttäjän syöttämän lähtöaseman perusteella aseman lyhytkoodin
    for (var i = 0; i < asemaArray.length; i++) {


        var asemanimi = asemaArray[i].stationName;

        // ETSII HAKUA VASTAAVAT ASEMAT JA LISTAA NE. esim. Helsinki > Helsinki asema
        if (asemaArray[i].stationName.toUpperCase().includes(document.getElementById("mista").value.toUpperCase())) { // /* matchaa aseman nimeen jollain tavalla
            hakuaVastaavatLahtoAsemat.push(asemaArray[i].stationName);
            //console.log(asemaArray[i].stationName);
        }

        if (document.getElementById("mista").value.toUpperCase() == asemaArray[i].stationName.toUpperCase()) {
            lahtopaikka = asemaArray[i].stationShortCode;
        }

    }

    // TULOSTAA VIRHEILMOITUKSEN JOS ASEMAA EI LÖYDU TAI LÖYTYY USEITA VAIHTOEHTOJA
    if (hakuaVastaavatLahtoAsemat.length > 1) {
        alert("Kirjoita tarkempi lähtöasematieto seuraavista vaihtoehdoista: " + hakuaVastaavatLahtoAsemat);
        return;
    }
    if (hakuaVastaavatLahtoAsemat.length == 0) {
        alert("Kirjoittamaasi lähtöasemaa eikä vastaavia löytynyt");
        return;
    }


    // Hakee käyttäjän syöttämän saapumisaseman perusteella aseman lyhytkoodin
    for (var i = 0; i < asemaArray.length; i++) {

        // ETSII HAKUA VASTAAVAT ASEMAT JA LISTAA NE. esim. Helsinki > Helsinki asema
        if (asemaArray[i].stationName.toUpperCase().includes(document.getElementById("minne").value.toUpperCase())) { // /* matchaa aseman nimeen jollain tavalla
            hakuaVastaavatSaapumisasemat.push(asemaArray[i].stationName);
        }

        // MÄÄRITTÄÄ URLIIN TULEVAN LYHYEN ASEMAKOODIN
        if (document.getElementById("minne").value.toUpperCase() == asemaArray[i].stationName.toUpperCase()) {
            maaranpaa = asemaArray[i].stationShortCode;
        }
    }


    // TULOSTAA VIRHEILMOITUKSEN JOS ASEMAA EI LÖYDU TAI LÖYTYY USEITA VAIHTOEHTOJA
    if (hakuaVastaavatSaapumisasemat.length > 1) {
        alert("Kirjoita tarkempi saapumisasematieto seuraavista vaihtoehdoista: " + hakuaVastaavatSaapumisasemat);
        return;
    }
    if (hakuaVastaavatSaapumisasemat.length == 0) {
        alert("Kirjoittamaasi saapumisasemaa eikä vastaavia löytynyt");
        return;
    }


    // paivamaara URLiin haun perusteella
    paivamaara = document.getElementById("paivamaara").value;


    // URLIN RAKENTAMINEN
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/" + lahtopaikka +
        "/" + maaranpaa + "?departure_date=" + paivamaara);
    xhr.send(null);

    // Käytetään suosikkipaikan tallennuksessa
    suosikkiLahtoPaikka = document.getElementById("mista").value;
    suosikkiKohdeAsema = document.getElementById("minne").value;


    // REITTI- JA PÄIVÄMÄÄRÄTIEDOT TULOSTUKSEN ALKUUN (ALEKSI JA HEIDI)
    document.getElementById("reitti").innerHTML = lahtopaikka + "-" + maaranpaa + " " + paivamaara;
}

/// ---------------- >>>>>>>>>>>>>>
//  SUOSIKKIREITIN TALLENNUS
// Johanna ja Vellu

var suosikkiLahtoPaikka;
var suosikkiKohdeAsema;

function tallennaSuosikkiReittiFunktio() {
    console.log("toimii");
    localStorage.setItem("suosikkiLahtoAsema", suosikkiLahtoPaikka);
    localStorage.setItem("suosikkiKohdeAsema", suosikkiKohdeAsema);
    paivitaSuosikkiasemat();
    //  document.getElementById("suosikkiReitti").innerHTML = "" + suosikkiLahtoPaikka + "-" + suosikkiKohdeAsema;
}


function kaytaSuosikkiReittia() {
    var tallennettuLahtoasema = localStorage.getItem("suosikkiLahtoAsema");
    var tallennettuKohdeasema = localStorage.getItem("suosikkiKohdeAsema");

    document.getElementById("mista").value = tallennettuLahtoasema;
    document.getElementById("minne").value = tallennettuKohdeasema;

}


// JOHANNA JA HEIDI -----------------------------------
// HEATUN REITTITIEDON TULOSTAMINEN SIVULLE


function tilavaihtu() {
    // document.getElementById("hakutulos").innerHTML ="";

    if (xhr.readyState === 4) {
        var jsonData = JSON.parse(xhr.responseText);
        var taulu = [];
        var aika;
        var lista = [];

        document.getElementById("tallennaSuosikkiReitti").style.display = 'block' // Asettaa suosikkireitin tallennusnapin näkyväksi kun on tehty eka haku


        // KÄYTTÄÄKÖ ESIASETETTU NYKYAIKAA VAI KÄYTTÄJÄN KRIJOTITAMAA MYÖHÄISEMPÄÄ AIKAA
        if (document.getElementById("kellonaika").value > nykyaika) {

            //console.log("ISOMPI!")
            // console.log(document.getElementById("kellonaika").value);
            // console.log(document.getElementById("kellonaika").value);

            //console.log(document.getElementById("kellonaika").value.substring(2,3));
            // document.getElementById("kellonaika").value.substring(2,3) = ",";

            lahtoaikaSplit = document.getElementById("kellonaika").value.split(":");


        } else {

           // console.log("PIEMENPI!")
            lahtoaikaSplit = nykyaika.split(":");
            //console.log(lahtoaikaSplit);

        }

        console.log(lahtoaikaSplit);
        console.log("Tätä käytetään" + lahtoaikaSplit);

        for (var i = 0; i < jsonData.length; i++) {

            aika = new Date(jsonData[i].timeTableRows[0].scheduledTime).toLocaleTimeString().split(":");
            //console.log(lahtoaikaSplit[0] < aika[0]);

            if (lahtoaikaSplit[0] < aika[0] || (lahtoaikaSplit[0] == aika[0] && lahtoaikaSplit[1] < aika[1])) {
                taulu.push(jsonData[i]);
                //  console.log(jsonData[i]);
            }
        }

        for (var i = 0; i < taulu.length; i++) {
            document.getElementById("hakutulokset").innerHTML = "Hakutulokset";
            document.getElementById("junatunnus").innerHTML = "Junatunnus";
            document.getElementById("lahtoaika").innerHTML = "Lähtöaika";
            document.getElementById("saapumisaika").innerHTML = "Saapumisaika";

            //luodaan tr-elementti
            var lista = document.createElement("tr");
            lista.setAttribute("id", i + "sarake");


            //luodaan muuttujat (junantyyppi, pvm yms.)
            var tunnus = taulu[i].trainType + taulu[i].trainNumber;
            var ajanEsitys = {hour: '2-digit', minute: '2-digit', hour12: false};
            var lahtoAika = new Date(taulu[i].timeTableRows[0].scheduledTime).toLocaleTimeString("fi", ajanEsitys);
            var saapumisAika = new Date(taulu[i].timeTableRows[taulu[i].timeTableRows.length - 1].scheduledTime).toLocaleTimeString("fi", ajanEsitys);

            // tulostetaam tiedot tauluun
            lista.innerHTML = "<a href=" + "#juna" + i + ">" + tunnus + "</a>";
            //console.log("https://rata.digitraffic.fi/trains/" + taulu[i].trainNumber);

            //luodaan td-elementtejä ja lisätään ne luotuun tr-elementtiin
            var lahto = document.createElement("td");
            lahto.innerHTML = lahtoAika;
            lista.appendChild(lahto);

            var saapuu = document.createElement("td");
            saapuu.innerHTML = saapumisAika;
            lista.appendChild(saapuu);

            //hakee id perusteella html tiedostosta ja yhdistää haetut tiedot listaan
            junalista.appendChild(lista);

            var asemat = [];
            var ajat = [];
            for (var j = 0; j < taulu[i].timeTableRows.length; j++) {
                asemat.push(taulu[i].timeTableRows[j].stationShortCode);
                //ajat.push(taulu[i].timeTableRows[j].scheduledTime);
                var aika = new Date(taulu[i].timeTableRows[j].scheduledTime).toLocaleTimeString("fi", ajanEsitys);
                ajat.push(aika);
            }
            console.dir(asemat);

            var junanTiedot = document.createElement("tr");
            junanTiedot.innerHTML = "<a id=juna" + i + ">" + "" + "</a>";
            junalista.appendChild(junanTiedot);

            for (var k = 0; k < asemat.length; k += 2) {
                junanTiedot.innerHTML += asemat[k] + " " + ajat[k] + "<br>";
                //junanTiedot.append("<br>");
            }
            junanTiedot.innerHTML += asemat[asemat.length - 1] + " " + ajat[ajat.length - 1] + "<br>";
        }
    }
}

