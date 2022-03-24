const keyAPI = '8770d91a5e39581cbe0f8b6be7c75f33';

let long;
let lat;
let cityName = "rouen"
let numberOfDays = 6


// document.addEventListener("keyup", function(event) {
//     if (event.key === "Enter" && document.getElementById("cityName").is(":focus")) {
//         // Do work
//     }
// });


function search() {
    let valueCityName = document.getElementById('cityName').value;
    console.log(valueCityName);
    callVilleApiSearch(valueCityName);

}



function searchlocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
    
            // console.log(position);
            // long = position.coords.longitude;
            // lat = position.coords.latitude;
            // console.log(long, lat)
    
            let coordList = [{lon:-0.1257,lat:51.5085}, {lon:-47.9297,lat:-15.7797}, {lon:116.3972,lat:39.9075}, {lon:11.5167,lat:3.8667}]
            function random(mn, mx) {
                return Math.random() * (mx - mn) + mn;
            }
            villeRandom = coordList[Math.floor(random(1, 4))-1];
            long = villeRandom.lon;
            lat = villeRandom.lat;
            callVilleApiLocation();
    
        }, () => {
            alert(`Vous devez activer la géolocalisation pour pouvoir utiliser cette fonctionnalité !`)
        })
    }

}


function callVilleApiLocation() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${keyAPI}`)
	.then(function(resp2) { return resp2.json() }) // Convert data to json
    .then(function(dataVille) {
        callWeatherApi(dataVille);
    })
    
}


function callVilleApiSearch(valueCityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valueCityName}&appid=${keyAPI}`)
	.then(function(resp2) { return resp2.json() }) // Convert data to json
    .then(function(dataVille) {
        callWeatherApi(dataVille);
    })
    
}


function callWeatherApi(dataVille) {
    long = dataVille.coord.lon;
    lat = dataVille.coord.lat;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&lang=fr&units=metric&appid=${keyAPI}`)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(dataWeather) {
        console.log(dataWeather);
        console.log(dataVille);
        appWeather(dataWeather, dataVille);
    })
}

function appWeather(dataWeather, dataVille) {

    // Intégration de ville et pays
    let countryCode = dataVille.sys.country;
    let countryName = new Intl.DisplayNames(['fr'], {type: 'region'}).of(countryCode)
    document.querySelector('#ville-label').innerHTML = `${dataVille.name} - ${countryName}`;

    // Intégration des données du jour
    // Ajout de la température
    document.querySelector('.temps-principal > p').innerHTML = `${Math.round(dataWeather.current.temp)}°C`;
    // Ajout icone
    document.querySelector('.temps-principal > div > img').src = `./assets/img/day/${dataWeather.current.weather[0].icon}.svg`
    // Ajout du descriptif
    let descriptionWeather = dataWeather.current.weather[0].description;
    document.querySelectorAll('.temps-principal > p')[1].innerHTML = `${descriptionWeather.charAt(0).toUpperCase() + descriptionWeather.substr(1)}`;
    


    
    // Intégration des données des jours suivants
    for(let i = 1; i < numberOfDays+1; i++){
        let daily = dataWeather.daily[i];

        // Ajout de la date
        let weatherDate = new Date(daily.dt*1000);
        document.querySelector(`#temps-j${i} > h3`).innerHTML =  weatherDate.toLocaleString("fr-FR",{month: "short", day: "numeric"});
        // Ajout de la température
        document.querySelector(`#temps-j${i} > p`).innerHTML = `${Math.round(daily.temp.day)}°C`;
        // Ajout icone
        document.querySelector(`#temps-j${i} > div > img`).src = `./assets/img/day/${daily.weather[0].icon}.svg`

        // Ajout du descriptif
        let descriptionWeather = daily.weather[0].description;
        document.querySelectorAll(`#temps-j${i} > p`)[1].innerHTML = `${descriptionWeather.charAt(0).toUpperCase() + descriptionWeather.substr(1)}`;
        
    }

    
    // Affichage du block
    document.querySelector("#hidden").style.display = "block";

}

