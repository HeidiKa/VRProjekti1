// VELLU JA JOHANNA
// Tallennetaan käyttäjänimi ja salasana local storageen


// Annettujen tietojen tallentaminen muuttujiiin lomakkeelta
var nimi = document.getElementById("kayttajatunnusLuotunnus");
var salasana = document.getElementById("salasanaLuotunnus");
var kirjautunut;

// Siirretään tiedot local storageen
function varastoi() {
    localStorage.setItem("nimi", nimi.value);
    localStorage.setItem("salasana", salasana.value);
    document.location.replace("kirjaudu.html");
}

function tarkista() {
    // haetaan local storageen tallennetut tiedot
    var varastoNimi = localStorage.getItem("nimi");
    var varastoSalasana = localStorage.getItem("salasana");

    // Haetaan käyttäjän kirjautumistiedot
    var kirjauduNimi = document.getElementById("kayttajatunnusKirjautuminen");
    var kirjauduSalasana = document.getElementById("salasanaKirjautuminen");

    // Tarkista on rekisteröitymistiedot samat kun syötetyt
    if (kirjauduNimi.value !== varastoNimi || kirjauduSalasana.value !== varastoSalasana) {
        alert('Tarkista käyttäjätunnus ja salasana!');
    } else {
        sessionStorage.setItem("kirjautunut", "true");
        document.location.replace("VR.html");
    }
}

