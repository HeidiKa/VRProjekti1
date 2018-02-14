
// -------------  JUNA-ASEMATIETOJEN HAKEMINEN ------------

// Koodi hakee asemien asemakoodit käyttäjän haun perusteella

var asemaArray;
var xhr1 = new XMLHttpRequest();

function asematiedot() {
    xhr1.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations");
    xhr1.send(null);
}
// Funktio hakee asemien tiedot muuttujaksi
// Käytetään asemien nimien lyhytkoodien hakemiseen käyttäjän haun perusteella
asematiedot();

xhr1.onreadystatechange = tilavaihtu1;

function tilavaihtu1() {
    if (xhr1.readyState == 4) {
        jsonAsemat = xhr1.responseText;
        asemaArray = JSON.parse(jsonAsemat);
        //console.dir(asemaArray);
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
    var kellonaika;
    var hakuaVastaavatLahtoAsemat = [];

    // Hakee käyttäjän syöttämän lähtöaseman perusteella aseman lyhytkoodin
    for (var i = 0; i < asemaArray.length; i++) {

       // var asemanimi = asemaArray[i].stationName;
/*
        if(document.getElementById("mista").value.toUpperCase() ) { // /* matchaa aseman nimeen jollain tavalla
            hakuaVastaavatLahtoAsemat.add(asemaArray[i].stationName);
        }
*/
        if (document.getElementById("mista").value.toUpperCase() == asemaArray[i].stationName.toUpperCase()) {
            lahtopaikka = asemaArray[i].stationShortCode;

        } else {
            // tähän vain tulostus
        }
    }

    // Hakee käyttäjän syöttämän saapumisaseman perusteella aseman lyhytkoodin
    for (var i = 0; i < asemaArray.length; i++) {
        if (document.getElementById("minne").value.toUpperCase() == asemaArray[i].stationName.toUpperCase()) {
            maaranpaa = asemaArray[i].stationShortCode;
        }
    }
    // paivamaara URLiin haun perusteella
    paivamaara = document.getElementById("paivamaara").value;

    console.log(document.getElementById("kellonaika").value);

    // URLIN RAKENTAMINEN
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/" + lahtopaikka +
        "/" + maaranpaa + "?departure_date=" + paivamaara);
    xhr.send(null);
}

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
            var lahtoAika = new Date(taulu.timeTableRows[0].scheduledTime).toLocaleTimeString("fi",ajanEsitys);
            var saapumisAika = new Date(taulu.timeTableRows[taulu.timeTableRows.length-1].scheduledTime).toLocaleTimeString("fi",ajanEsitys);
            var pvm = taulu.departureDate;

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

            //hakee id perusteella html tiedostosta
            document.getElementById("junalista").appendChild(lista);
        }
    }
}


