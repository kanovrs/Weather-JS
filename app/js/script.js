"use strict";

const temp = document.getElementById("temp");
const date = document.getElementById("date-time");
const currentLocation = document.getElementById("location");
const cloudy = document.getElementById("cloudy");
const rain = document.getElementById("rain");
const weatherIcon = document.getElementById("icon");
const uvIndex = document.getElementById("uv-index");
const windSpeed = document.getElementById("wind");
const sunRise = document.getElementById("sunrise");
const sunSet = document.getElementById("sunset");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const airQality = document.getElementById("air-qality");
const uvText = document.getElementById("uv-text");
const humidityText = document.getElementById("humidity-txt");
const visibilityText = document.getElementById("visibility-text");
const airQalityText = document.getElementById("air-qality-txt");
const mainIcon = document.getElementById("icon"); 
const dayCards = document.getElementById("day-cards");
const celsiusBtn = document.getElementById("units-c");
const fahrenheitBtn = document.getElementById("units-f");
const hourlyBtn = document.getElementById("hourly");
const weekBtn = document.getElementById("week");
const typeUnits = document.querySelectorAll(".temperature__unit");
const body = document.body;
const inputCity = document.getElementById("curent");
const searchBtn = document.getElementById("searchBtn");


let currentCity = "";
let currentUnit = "c";
let hourlyourWeek = "hourly";

function getDeteTime(time) {
    let now = new Date(),
        hour = time;

    let days = [
         "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    
    let dayString = days[now.getDay()];
    return `${dayString}, Update time: ${hour}`;
};

date.innerText = getDeteTime();


function getPublickIp() {
    fetch("https://ipinfo.io/json?token=3acb5bbde53cd0", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            getWeatherData(currentCity, currentUnit, hourlyourWeek);
        })
        .catch((error) => {
            console.error("Error while retrieving location data:", error);
        });
};

getPublickIp();

function getWeatherData(city, unit, hourlyourWeek) {
    const apiKey = "KBADLE56K3UTXMBQVEHXL8A43";

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp.toFixed(0);
                if (today.temp > 0) {
                    temp.innerText = "+" + today.temp.toFixed(0);
                }
            } else {
                temp.innerText = celsiusToFahrenheit(today.temp.toFixed(0));
            };
            currentLocation.innerText = data.resolvedAddress;
            cloudy.innerText = today.conditions;
            rain.innerText = `Rain :${today.precip} %`;
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = `${today.humidity} %`;
            visibility.innerText = today.visibility;
            airQality.innerText = today.winddir;
            date.innerText = getDeteTime(today.datetime);
            measurveUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQality(today.winddir);
            sunRise.innerText = convertTimeTo24Format(today.sunrise);
            sunSet.innerText = convertTimeTo24Format(today.sunset);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            if (hourlyourWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
        })
        .catch((error) => {
            console.error("Error while retrieving weather data:", error);
        });
};

function celsiusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(0);
};
    
function measurveUvIndex(uvIndex) {
    if (uvIndex < 2) {
        uvText.innerText = "low";
    } else if (uvIndex < 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex < 7) {
        uvText.innerText = "Hight";
    } else if (uvIndex < 10) {
        uvText.innerText = "Very hight";
    } else {
        uvText.innerText = "Exreme";
    }
};



function updateHumidityStatus(humidity) {
        if (humidity < 30) {
        humidityText.innerText = "low";
    } else if (humidity < 60) {
        humidityText.innerText = "Moderate";
    } else {
        humidityText.innerText = "Hight";
    }
};

function updateVisibilityStatus(visibility) {
    if (!visibility) {
        visibilityText.innerText = "Not Data";
    } else {
        if (visibility < 0.3) {
            visibilityText.innerText = "Dense fog";
        } else if (visibility < 0.6) {
            visibilityText.innerText = "Moderate fog";
        } else if (visibility < 0.35) {
            visibilityText.innerText = "Light fog";
        } else if (visibility < 1.13) {
            visibilityText.innerText = "Very light fog";
        } else if (visibility < 2.16) {
            visibilityText.innerText = "Light mist";
        } else if (visibility < 5.4) {
            visibilityText.innerText = "Very light mist";
        } else if (visibility < 10.8) {
            visibilityText.innerText = "Clear air";
        } else {
            visibilityText.innerText = "Very clear air";
        }
    }
};

function updateAirQality(airQality) {
    if (airQality < 50) {
        airQalityText.innerText = "Good";
    } else if (airQality < 100) {
        airQalityText.innerText = "Moderate";
    } else if (airQality < 150) {
        airQalityText.innerText = "Unhealthy for sensetive group";
    } else if (airQality < 200) {
        airQalityText.innerText = "Unhealthy";
    } else if (airQality < 250) {
        airQalityText.innerText = "Very Unhealthy";
    }else {
        airQalityText.innerText = "Hazardous";
    }
};

function convertTimeTo24Format(time) {
    if (time) {
        let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    hour = hour % 24;
    hour = hour ? hour : 24;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    return hour + ":" + minute;
    } else {
        return "00:00"; 
    }
};

function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "images/pcloudy-day.png";
    } else if (condition === "partly-cloudy-night") {
        return "images/pcloudy-night.png";
    } else if (condition === "snow") {
        return "images/snow.png";
    } else if (condition === "rain") {
        return "images/rain.png";
    } else if (condition === "clear-day") {
        return "images/sun.png";
    } else if (condition === "clear-night") {
        return "images/clear-night.png";
    } else if (condition === "cloudy") {
        return "images/cloudy.png";
    } else {
        return "images/storm.png";
    }
};

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    return `${hour} : ${min}`;
};

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
};

function updateForecast(data, unit, type) {
    dayCards.innerHTML = "";

    let day = 0;
    let numCards = 0;

    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp.toFixed(0);
        if (unit === "f") {
            dayTemp = celsiusToFahrenheit((data[day].temp).toFixed(0));
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
         <div class="cards__item">
        <h1 class="cards__name">${dayName}</h1>
        <img src="${iconSrc}" class="cards__img" alt="img" />
        <div class="cards__temp">
            <span class="cards__temp-bold">${dayTemp}</span>
            <span class="cards__unit">${tempUnit}</span>
        </div>
    </div>
        `;
        dayCards.appendChild(card);
        day++;
    }
};

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});

celsiusBtn.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit; 
        typeUnits.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celsiusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            fahrenheitBtn.classList.add("active");
            celsiusBtn.classList.remove("active");
        }

        getWeatherData(currentCity, currentUnit, hourlyourWeek);
    }
};

hourlyBtn.addEventListener("click", () => {
    changeTime("hourly");
});

weekBtn.addEventListener("click", () => {
    changeTime("week");
});

function changeBackground(condition) {
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "images/cloudy-day_bg.jpg";
    } else if (condition === "partly-cloudy-night") {
        bg = "images/cloudy-night_bg.jpg";
    } else if (condition === "snow") {
        bg = "images/snow.jpg";
    } else if (condition === "rain") {
        bg = "images/night-rain_bg.jpg";
    } else if (condition === "clear-day") {
        bg = "images/day_bg.jpg";
    } else if (condition === "clear-night") {
        bg = "images/night_bg.jpg";
    } else if (condition === "cloudy") {
        bg = "images/cloudy-day_bg.jpg";
    } else {
        bg = "images/cloudy-day_bg.jpg";
    }
    let img = new Image();
    img.onload = function() {
        body.style.backgroundImage = `linear-gradient(
      to top,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.3)
    ),
    url(${bg})`;
    }; 
img.onerror = function() {
    console.error("Ошибка при загрузке изображения:", bg);
};
img.src = bg;
};

function changeTime(unit) {
    if (hourlyourWeek !== unit) {
        hourlyourWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData (currentCity, currentUnit, hourlyourWeek)
    }
};

function chanageCity(event) {
    event.preventDefault();
    const newCity = inputCity.value.trim();
    const cities = ["киев", "Київ", "Киев", "київ"];
    
    if (cities.includes(newCity)) {
        currentCity = "Kyiv";
        getWeatherData(currentCity, currentUnit, hourlyourWeek);
    } else if (currentCity !== newCity) {
        currentCity = newCity;
        getWeatherData(currentCity, currentUnit, hourlyourWeek);
    }
};

inputCity.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        chanageCity(event);
    }
});

searchBtn.addEventListener("click", function (event) {
    chanageCity(event);
});