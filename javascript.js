var xhr = new XMLHttpRequest();


xhr.onreadystatechange = tilavaihtu;

function hae() {
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/LH");
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


