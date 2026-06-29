const apiKey = "f415e706f1db6b4fc436f9e499e4959f";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const voiceBtn = document.getElementById("voice-btn");
const floatingMic = document.getElementById("floatingMic");

/* =========================
   LIVE CLOCK
========================= */

function updateClock(){

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString();

    document.getElementById("date").innerHTML =
        now.toDateString();

}

setInterval(updateClock,1000);
updateClock();

/* =========================
   SEARCH WEATHER
========================= */

searchBtn.addEventListener("click", getWeather);

async function getWeather(){

    const city = cityInput.value.trim();

    if(city === ""){
        alert("Please enter city name");
        return;
    }

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{

        const response = await fetch(url);
        const data = await response.json();
        /* =========================
   MODIFY getWeather()
========================= */

document.getElementById("sunrise").innerHTML =
formatTime(data.sys.sunrise);

document.getElementById("sunset").innerHTML =
formatTime(data.sys.sunset);

updateWeatherIcon(
data.weather[0].main
);

getAQI(
data.coord.lat,
data.coord.lon
);

        if(data.cod != 200){
            alert("City not found");
            return;
        }

        document.getElementById("cityName").innerHTML =
            `📍 ${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").innerHTML =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("description").innerHTML =
            data.weather[0].description;

        document.getElementById("humidity").innerHTML =
            `${data.main.humidity}%`;

        document.getElementById("wind").innerHTML =
            `${data.wind.speed} m/s`;

        document.getElementById("visibility").innerHTML =
            `${data.visibility/1000} km`;

        document.getElementById("feelsLike").innerHTML =
            `${Math.round(data.main.feels_like)}°C`;

        changeBackground(
            data.main.temp,
            data.weather[0].main
        );
        getForecast(city);

    }
    catch(error){

        console.log(error);
        alert("Something went wrong");

    }

}

/* =========================
   DYNAMIC BACKGROUND
========================= */

function changeBackground(temp, condition){

    if(
        condition === "Fog" ||
        condition === "Mist" ||
        condition === "Haze"
    ){

        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("fog.jpeg")';

    }

    else if(
        condition === "Rain" ||
        condition === "Drizzle" ||
        condition === "Thunderstorm"
    ){

        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("forest.jpeg")';

    }

    else if(temp >= 35){

        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("hotest.jfif")';

    }

    else{

        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("mountain.jpeg")';

    }

}

/* =========================
   VOICE RECOGNITION
========================= */

function startVoice(){

    const recognition =
    new(window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event){

        const city =
        event.results[0][0].transcript;

        cityInput.value = city;

        getWeather();

    };

}

voiceBtn.addEventListener(
    "click",
    startVoice
);

if(floatingMic){

    floatingMic.addEventListener(
        "click",
        startVoice
    );

}

/* =========================
   ENTER KEY SEARCH
========================= */

cityInput.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            getWeather();

        }

    }
);

/* =========================
   CHART JS
========================= */
const ctx = document.getElementById("weatherChart");

let weatherChart = new Chart(ctx, {

    type: "line",

    data: {
        labels: ["2AM","5AM","8AM","11AM","2PM","5PM","8PM","11PM"],

        datasets: [{
            label: "Temperature",
            data: [24,26,29,31,35,33,30,27],
            tension: 0.4,
            fill: true
        }]
    },

    options: {
    responsive: true,
        plugins: {
    legend: {
        labels: {
            color: "rgba(255,255,255,0.85)",
            font: {
                size: 14,
                weight: "600"
            }
        }
    }
},
    scales: {
        x: {
            ticks: {
                color: "rgba(255,255,255,0.75)"
            }
        },
        y: {
            ticks: {
                color: "rgba(255,255,255,0.75)"
            }
        }
    }
}

});

/* =========================
   SUNRISE & SUNSET
========================= */

function formatTime(unixTime){

    const date = new Date(unixTime * 1000);

    return date.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

}

/* =========================
   WEATHER ICON CHANGE
========================= */

function updateWeatherIcon(condition){

    const icon =
    document.querySelector(".weather-icon");

    switch(condition){

        case "Clear":
            icon.innerHTML = "☀️";
            break;

        case "Clouds":
            icon.innerHTML = "☁️";
            break;

        case "Rain":
            icon.innerHTML = "🌧️";
            break;

        case "Drizzle":
            icon.innerHTML = "🌦️";
            break;

        case "Thunderstorm":
            icon.innerHTML = "⛈️";
            break;

        case "Snow":
            icon.innerHTML = "❄️";
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            icon.innerHTML = "🌫️";
            break;

        default:
            icon.innerHTML = "🌤️";
    }

}

/* =========================
   AIR QUALITY INDEX
========================= */

async function getAQI(lat, lon){

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        const aqiValue =
        data.list[0].main.aqi;

        let text = "";

        switch(aqiValue){

            case 1:
                text = "Good";
                break;

            case 2:
                text = "Fair";
                break;

            case 3:
                text = "Moderate";
                break;

            case 4:
                text = "Poor";
                break;

            case 5:
                text = "Very Poor";
                break;
        }

        document.getElementById("aqi").innerHTML =
        `${aqiValue} (${text})`;

    }

    catch(error){

        console.log(error);

    }

}



/* =========================
   RAIN CHANCE (DEMO)
========================= */

const rainChance =
Math.floor(Math.random()*100);

document.getElementById("rainChance")
.innerHTML =
`${rainChance}%`;
async function getForecast(city){

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

      updateChart(data);

    }

    catch(error){

        console.log(error);

    }

}
function updateChart(data){

    const labels = [];
    const temps = [];

    data.list.slice(0,8).forEach(item=>{

        const time =
        new Date(item.dt_txt)
        .toLocaleTimeString([],{
            hour:"numeric"
        });

        labels.push(time);

        temps.push(
            Math.round(item.main.temp)
        );

    });

    weatherChart.data.labels = labels;

    weatherChart.data.datasets[0].data = temps;

    weatherChart.update();

}
