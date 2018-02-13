
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
    if (xhr.readyState == 4) {

        console.log("haku OK");
        var jsonData = xhr.responseText;
        var junaArray = JSON.parse(jsonData);

        //console.dir(junaArray);


        document.getElementById("junalista").innerHTML ="";

        var junalista = document.getElementById("junalista").innerHTML;

        for (var i = 0; i < junaArray.length; i++) {
            var junantiedot = "";

            //junantiedot += (junaArray[i].departureDate);
            junantiedot += "Junatyyppi: ";
            junantiedot += (junaArray[i].trainType + junaArray[i].trainNumber);
            junantiedot += " Aikataulu: ";
            junantiedot += (junaArray[i].timeTableRows[0].scheduledTime);

            // uusi lista elementti
            var x = document.createElement("li");

            // haetaan JSONista haluttu data
            var t = document.createTextNode(junantiedot);

            x.appendChild(t);
            document.getElementById("junalista").appendChild(x);


        }

    }
}