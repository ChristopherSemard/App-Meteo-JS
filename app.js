const keyAPI = '8770d91a5e39581cbe0f8b6be7c75f33';

let long;
let lat;
let cityName = "rouen"


if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        // console.log(position);
        long = position.coords.longitude;
        lat = position.coords.latitude;
        console.log(long, lat)
        callVilleApi()

    }, () => {
        alert(`Vous avez refusé la géolocalisation, l'application ne peur pas fonctionner, veuillez l'activer.!`)
    })
}

function callVilleApi() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${keyAPI}`)
	.then(function(resp2) { return resp2.json() }) // Convert data to json
    .then(function(dataVille) {
        callWeatherApi(dataVille);
    })
    
}

function callWeatherApi(dataVille) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&lang=fr&units=metric&appid=${keyAPI}`)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(dataWeather) {
        console.log(dataWeather);
        console.log(dataVille);
        appWeather(dataWeather, dataVille);
    })
}

function appWeather(dataWeather, dataVille) {
    console.log(dataWeather.current.weather[0].main)
    console.log(dataVille.name)
    console.log(dataVille.sys.country)
    let countryCode = dataVille.sys.country;
    let countryName = new Intl.DisplayNames(['fr'], {type: 'region'}).of(countryCode)
    console.log(countryName)

    document.querySelector('#ville-label').innerHTML = `${dataVille.name} - ${countryName}`;
    document.querySelector('.temps-principal > p').innerHTML = `${Math.round(dataWeather.current.temp)}°C`;
    let descriptionWeather = dataWeather.current.weather[0].description;
    document.querySelectorAll('.temps-principal > p')[1].innerHTML = `${descriptionWeather.charAt(0).toUpperCase() + descriptionWeather.substr(1)}`;
    


}