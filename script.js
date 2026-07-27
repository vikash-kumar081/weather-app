const apiKey = "f415e706f1db6b4fc436f9e499e4959f";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const voiceBtn = document.getElementById("voice-btn");
const floatingMic = document.getElementById("floatingMic");

const previousData = {
    temp: 0,
    humidity: 0,
    wind: 0,
    visibility: 0,
    feelsLike: 0
};
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
    searchBtn.disabled = true;
    searchBtn.classList.add("loading");
    searchBtn.innerHTML =
    '<span class="loader"></span>Loading...';
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
            animateElement("cityName");

        animateValue(
"temperature",
previousData.temp,
Math.round(data.main.temp),
"°C"
);

previousData.temp =
Math.round(data.main.temp);

        document.getElementById("description").innerHTML =
            data.weather[0].description;
        animateElement("description");
            animateValue(
"humidity",
previousData.humidity,
data.main.humidity,
"%"
);

previousData.humidity =
data.main.humidity;
        

        animateValue(
"wind",
previousData.wind,
data.wind.speed,
"m/s"
);

previousData.wind =
data.wind.speed;

        animateValue(
"visibility",
previousData.visibility,
data.visibility/1000,
"km"
);

previousData.visibility =
data.visibility/1000;

     animateValue(
"feelsLike",
previousData.feelsLike,
Math.round(data.main.feels_like),
"°C"
);

previousData.feelsLike =
Math.round(data.main.feels_like);
        
        changeBackground(
            data.main.temp,
            data.weather[0].main
        );
        
        getForecast(city);
        searchBtn.disabled = false;
searchBtn.classList.remove("loading");
searchBtn.innerHTML = "Search";
    }
   catch(error){

    console.log(error);
    alert("Something went wrong");
    searchBtn.disabled = false;
    searchBtn.classList.remove("loading");
    searchBtn.innerHTML = "Search";
}
}

/* =====================
   DYNAMIC BACKGROUND
========================= */

function changeBackground(temp, condition){

    if(
        condition === "Rain" ||
        condition === "Drizzle" ||
        condition === "Thunderstorm"||
        condition === "moderate rain"||
        condition === "light rain"
        
    ){
        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("rainy.jpeg")';
    }

    else if(
       condition === "Fog" ||
        condition === "Mist" ||
        condition === "Haze"
    ){
        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("winter.jpeg")';
    }

    else if(temp >= 35){
        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("summer.jpeg")';
    }
else if(temp > 25 && temp < 30){
        document.body.style.backgroundImage =
    'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("normal.jpeg")';
}

        else if(temp <= 20){
    document.body.style.backgroundImage =
   'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("winter.jpeg")';
}

    else{
        document.body.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("normal.jpeg")';
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
function animateValue(id, start, end, suffix = "") {

    const el = document.getElementById(id);

    const duration = 800;

    let startTime = null;

    function update(time){

        if(!startTime) startTime = time;

        const progress =
        Math.min((time-startTime)/duration,1);

       const ease =
1 - Math.pow(1 - progress,3);

const value =
start+(end-start)*ease;

        if(suffix==="m/s"){
            el.innerHTML =
            `${value.toFixed(2)} ${suffix}`;
        }
        else if(suffix==="km"){
            el.innerHTML =
            `${Math.round(value)} ${suffix}`;
        }
        else{
            el.innerHTML =
            `${Math.round(value)}${suffix}`;
        }
        if(progress < 1){
    requestAnimationFrame(update);
}
else{

    if(suffix==="m/s"){
        el.innerHTML =
        `${end.toFixed(2)} ${suffix}`;
    }
    else if(suffix==="km"){
        el.innerHTML =
        `${Math.round(end)} ${suffix}`;
    }
    else{
        el.innerHTML =
        `${Math.round(end)}${suffix}`;
    }

}
    }

    requestAnimationFrame(update);
}
function animateElement(id){

    const el = document.getElementById(id);

    if(!el) return;

    el.classList.remove("weather-update");

    void el.offsetWidth;

    el.classList.add("weather-update");

}
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


    icon.classList.remove("weather-update");
    void icon.offsetWidth;
    icon.classList.add("weather-update");
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
      const pm25 = Math.round(
data.list[0].components.pm2_5
);

let text = "";

if(pm25 <= 50){
    text = "🟢 Good";
}
else if(pm25 <= 100){
    text = "🟡 Moderate";
}
else if(pm25 <= 150){
    text = "🟠 Unhealthy";
}
else{
    text = "🔴 Poor";
}

       document.getElementById("aqi").innerHTML =
`${pm25} (${text})`;

    }
    catch(error){
        console.log(error);
    }
}

async function getForecast(city){
    try{
        const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
updateRainChance(data);
updateChart(data);
updateForecastCards(data);
    }
    catch(error){
        console.log(error);
    }
}

function updateRainChance(data){
    const rainChance =
    Math.round(
        (data.list[0].pop || 0) * 100
    );
    document.getElementById("rainChance")
    .innerHTML =
    `${rainChance}%`;
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
    weatherChart.update({
    duration: 800,
    easing: "easeOutQuart"
});

}
const aboutBtn = document.getElementById("aboutBtn");
const modal = document.getElementById("aboutModal");
const closeBtn = document.querySelector(".close-btn");

aboutBtn.addEventListener("click", function(e){
    e.preventDefault();
    modal.style.display = "block";
});

closeBtn.addEventListener("click", function(){
    modal.style.display = "none";
});

window.addEventListener("click", function(e){
    if(e.target === modal){
        modal.style.display = "none";
    }
});
function updateForecastCards(data){

    const forecastContainer =
    document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    const dailyForecast = {};
    data.list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];

        if(!dailyForecast[date]){
            dailyForecast[date] = {
                min: item.main.temp_min,
                max: item.main.temp_max,
                condition: item.weather[0].main
            };
        }
        else{
            dailyForecast[date].min =
            Math.min(
                dailyForecast[date].min,
                item.main.temp_min
            );

            dailyForecast[date].max =
            Math.max(
                dailyForecast[date].max,
                item.main.temp_max
            );
        }
    });

    Object.keys(dailyForecast)
    .slice(0,6)
    .forEach((date,index)=>{

        const dayName =
        index===0
        ? "Today"
        : new Date(date)
        .toLocaleDateString("en-US",{
            weekday:"short"
        });

        const weather =
        dailyForecast[date];

        let icon = "🌤️";

        if(weather.condition==="Clear") icon="☀️";
        else if(weather.condition==="Clouds") icon="☁️";
        else if(weather.condition==="Rain") icon="🌧️";
        else if(weather.condition==="Thunderstorm") icon="⛈️";
        else if(weather.condition==="Snow") icon="❄️";

        forecastContainer.innerHTML += `
        <div class="forecast-card ${index===0 ? 'active' : ''}">
            <h4>${dayName}</h4>
            <div>${icon}</div>
            <p>
                ${Math.round(weather.max)}°
                /
                ${Math.round(weather.min)}°
            </p>
        </div>
        `;
    });
    const firstDay = Object.values(dailyForecast)[0];

document.getElementById("maxTemp").innerHTML =
`⬆ ${Math.round(firstDay.max)}°C`;

document.getElementById("minTemp").innerHTML =
`⬇ ${Math.round(firstDay.min)}°C`;
}
document.getElementById("locationBtn")
.addEventListener("click", getCurrentLocation);

function getCurrentLocation(){

    if(!navigator.geolocation){
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position)=>{

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            cityInput.value = data.name;
            getWeather();

        },
        ()=>{
            alert("Location access denied");
        }
    );
}