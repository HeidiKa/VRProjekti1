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

function tilavaihtu1() {
    if (xhr1.readyState == 4) {
        jsonAsemat = xhr1.responseText;
        asemaArray = JSON.parse(jsonAsemat);
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

        // MÄÄRITTÄÄ URLIIN TULEVAN LYHYEN ASEMAKOODIN
        if (document.getElementById("mista").value.toUpperCase() == asemaArray[i].stationName.toUpperCase()) {
            lahtopaikka = asemaArray[i].stationShortCode;
        }

    }

    // TULOSTAA VIRHEILMOITUKSEN JOS ASEMAA EI LÖYDU TAI LÖYTYY USEITA VAIHTOEHTOJA
    if (hakuaVastaavatLahtoAsemat.length > 1) {
        alert("Kirjoita tarkempi lähtöasematieto seuraavista vaihtoehdoista: " + hakuaVastaavatLahtoAsemat);
    }
    if (hakuaVastaavatLahtoAsemat.length == 0) {
        alert("Kirjoittamaasi lähtöasemaa eikä vastaavia löytynyt");
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
    }
    if (hakuaVastaavatSaapumisasemat.length == 0) {
        alert("Kirjoittamaasi saapumisasemaa eikä vastaavia löytynyt");
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
    if (xhr.readyState === 4) {
        var jsonData = JSON.parse(xhr.responseText);

        for (var i = 0; i < jsonData.length; i++) {
            var taulu = jsonData[i];

            //luodaan tr-elementti
            var lista = document.createElement("tr");
            lista.setAttribute("id", i + "sarake");
            //console.dir(junaArray);


            //document.getElementById("junalista").innerHTML ="";

            //luodaan muuttujat (junantyyppi, pvm yms.)
            var tunnus = taulu.trainType + taulu.trainNumber;
            var ajanEsitys = {hour: '2-digit', minute: '2-digit', hour12: false};
            var lahtoAika = new Date(taulu.timeTableRows[0].scheduledTime).toLocaleTimeString("fi", ajanEsitys);
            var saapumisAika = new Date(taulu.timeTableRows[taulu.timeTableRows.length - 1].scheduledTime).toLocaleTimeString("fi", ajanEsitys);
            var pvm = taulu.departureDate;


            // tulostetaam tiedot tauluun
            lista.innerHTML = tunnus;

            //luodaan td-elementtejä ja lisätään ne luotuun tr-elementtiin
            var lahto = document.createElement("td");
            lahto.innerHTML = lahtoAika;
            lista.appendChild(lahto);

            var saapuu = document.createElement("td");
            saapuu.innerHTML = saapumisAika;
            lista.appendChild(saapuu);

            var paiva = document.createElement("td");
            paiva.innerHTML = pvm;
            lista.appendChild(paiva);

            //hakee id perusteella html tiedostosta ja yhdistää haetut tiedot listaan
            document.getElementById("junalista").appendChild(lista);

        }

    }
}


