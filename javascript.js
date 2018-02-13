var xhr = new XMLHttpRequest();


xhr.onreadystatechange = tilavaihtu;

function hae() {
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/LH");
    xhr.send(null);
}


function tilavaihtu() {
    if (xhr.readyState == 4) {

        console.log("haku OK");
        var jsonData = xhr.responseText;
        var junaArray = JSON.parse(jsonData);

        console.dir(junaArray[1]);


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