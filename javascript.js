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


    // URLIN RAKENTAMINEN
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/" + lahtopaikka +
        "/" + maaranpaa + "?departure_date=" + paivamaara);
    xhr.send(null);

    // REITTI- JA PÄIVÄMÄÄRÄTIEDOT TULOSTUKSEN ALKUUN (ALEKSI JA HEIDI)
    document.getElementById("reitti").innerHTML = lahtopaikka + "-" + maaranpaa + " " + paivamaara;
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

        for (var i = 0; i < jsonData.length; i++) {
            lahtoaikaSplit = nykyaika.split(":");
            aika = new Date(jsonData[i].timeTableRows[0].scheduledTime).toLocaleTimeString().split(":");
            //console.log(lahtoaikaSplit[0] < aika[0]);

            if (lahtoaikaSplit[0] < aika[0] || (lahtoaikaSplit[0]==aika[0] && lahtoaikaSplit[1]<aika[1])) {
                taulu.push(jsonData[i]);
            }
        }

        for (var i = 0; i < taulu.length; i++){
            document.getElementById("hakutulokset").innerHTML = "Hakutulokset";
            document.getElementById("junatunnus").innerHTML = "Junatunnus";
            document.getElementById("lahtoaika").innerHTML = "Lähtöaika";
            document.getElementById("saapumisaika").innerHTML = "Saapumisaika";

            //luodaan tr-elementti
            var lista = document.createElement("tr");
            lista.setAttribute("id", i + "sarake");
            console.dir(taulu[0]);

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
            for (var j=0;j<taulu[i].timeTableRows.length;j++){
                asemat.push(taulu[i].timeTableRows[j].stationShortCode);
                ajat.push(taulu[i].timeTableRows[j].scheduledTime);
            }
            console.dir(asemat);

            var junanTiedot = document.createElement("tr");
            junanTiedot.innerHTML = "<a id=juna" + i + ">" + "" + "</a>";
            junalista.appendChild(junanTiedot);

            for (var k = 0; k < asemat.length; k += 2) {
                junanTiedot.innerHTML += asemat[k] + " " + ajat[k] + "<br>";
                //junanTiedot.append("<br>");
            }
            junanTiedot.innerHTML += asemat[asemat.length-1] + " " + ajat[ajat.length-1] + "<br>";
        }
    }
}


