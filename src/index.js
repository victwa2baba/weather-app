import "./style.css";
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import { format } from "date-fns";
import cloudy from './img/cloud_weather_icon.png';
import heavyRain from './img/cloud_heavy rain_rain_storm_thunderbolt_icon.png';
import rain from './img/cloud_heavy rain_rain_weather_icon.png';
import shinny from './img/hot_sun_weather_icon.png';
import partly from './img/partly-cloudy.png';





// Variables
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const headerForm = document.querySelector('.headerForm');
const content = document.querySelector("#content");
const locationJs = document.querySelector('.locationJs');
const dateJs = document.querySelector('.dateJs');
let place = 'Lagos';
// const apiKey = 'AR8GR5GKW8YE47AU3PM2DC98H';
const apiKey1 = 'SCGKA8BRAZGSUNMAZK8ZACEHX';




// set theme
function setTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    toggleButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    body.classList.remove("dark-mode");
    toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  if (body.classList.contains("dark-mode")) {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

toggleButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleTheme();
});

// On page load, set theme from localStorage or system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}


async function getWeatherData (location, result) {
  try {
    const data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&include=days%2Calerts%2Chours&key=${apiKey1}&contentType=json`, {mode: "cors"});
    result = await data.json();
    return result;
  } 
  catch (err) {
    alert('Please input an address' + err);
  } 
}

async function collectNeededData () {
  const data = await getWeatherData(place);
   // Collect needed Data
    const neededData = { 
      address: data.resolvedAddress,
      days: data.days, 
      timezone: data.timezone
    }
    locationJs.innerText = neededData.address ? neededData.address  : 'Api error';
    return neededData;
}
 

function getCurrentDateTime() {
  const now = new Date();
  const dayName = format(now, "EEEE"); // Full day name, e.g., "Monday"
  const monthName = format(now, "MMMM"); // Full month name, e.g., "January"
  const date = format(now, "d"); // Day of the month
  const currentDateTime = `(${dayName} ${monthName} ${date})`;
  dateJs.innerText = currentDateTime;
  return currentDateTime;
}
getCurrentDateTime();
collectNeededData();

// Convert fahren to Celsius

function fahToCel (fah) {
  return (fah - 32) * 5 / 9;
}

// Header
async function header () {
    const form = document.createElement('form');
    form.setAttribute('class', 'd-flex');
    const container = document.createElement('div');
    container.setAttribute('class', 'align-items-center justify-content-center input-group');
    const input = document.createElement('input');
    input.setAttribute('class', 'form-control');
    input.type = 'search';
    input.name =  'search';
    const button = document.createElement('button');
    button.type = 'submit';
    button.setAttribute('class', 'btn btn-light border');
    button.innerHTML = '<i class="bi bi-binoculars"></i>';

    // Appendchildren
    headerForm.prepend(form);
    form.appendChild(container);
    container.appendChild(input);
    container.appendChild(button);
    // Add event listener
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      content.innerText = '';
      place = input.value;
      await collectNeededData();
      await displayContent();
      console.log(place);
    })
}
 header();
// Create the view for the content
async function displayContent () {
 
  const data = await getWeatherData(place);
  const neededData = { 
      address: data.resolvedAddress,
      days: data.days, 
      timezone: data.timezone
    }
  // Create grid container
  const containerGrid = document.createElement('div');
  containerGrid.setAttribute('class', 'container content-grid pt-100 pb-5');
  // Create grid for first container
  const firstSubContainer = document.createElement('div');
  firstSubContainer.setAttribute('class', 'd-grid');
  const firstSubp1 = document.createElement('div');
  firstSubp1.setAttribute('class', 'display-2 degree');
  firstSubp1.innerHTML = `${fahToCel(neededData.days[0].temp).toFixed(2)}<span><sup class="fs-07">o</sup><sup class="fs-08">c</sup></span>`
  const firstSubp2 = document.createElement('div');
  firstSubp2.setAttribute('class', 'display-6 description');
  firstSubp2.innerHTML = `${neededData.days[0].description}`;
  const firstDetailsContainer = document.createElement('div');
  firstDetailsContainer.setAttribute('class', 'd-grid py-5');
  firstDetailsContainer.style.gridTemplateColumns = '1fr 1fr';
  // Wind
  const windDetails = document.createElement('div');
  windDetails.setAttribute('class', 'd-grid')
  const windP1 = document.createElement('p');
  windP1.innerHTML = '<i class="bi bi-fan"></i> Wind';
  const windP2 = document.createElement('p');
  windP2.setAttribute('class', 'fs-3');
  windP2.innerHTML = `${neededData.days[0].windspeed}Km/h`;
  // Humidity
  const humidityDetails = document.createElement('div');
  humidityDetails.setAttribute('class', 'd-grid')
  const humidityP1 = document.createElement('p');
  humidityP1.innerHTML = '<i class="bi bi-moisture"></i> Humidity';
  const humidityP2 = document.createElement('p');
  humidityP2.setAttribute('class', 'fs-3');
  humidityP2.innerHTML = `${neededData.days[0].humidity}%`;
  // Create grid for second container
  const secondSubContainer = document.createElement('div');
  secondSubContainer.setAttribute('class', 'd-grid');
  const bgImage = document.createElement('img');
  const desc = neededData.days[0].description.toLowerCase();
  bgImage.setAttribute('width', '300px');
  bgImage.setAttribute('alt', `weather image`);
  if (desc.includes("sun")) {
    bgImage.src = shinny;
  } else if (desc.includes("storms")) {
    bgImage.src = heavyRain;
  } else if (desc.includes("partly")) {
    bgImage.src = partly;
  } else if (desc.includes("rain")) {
    bgImage.src = rain;
  } else if (desc.includes("heavy")) {
    bgImage.src = heavyRain;
  } else if (desc.includes("possible")) {
    bgImage.src = rain;
  } else {
    bgImage.src = cloudy;
  }

  // Create grid for third container
  const thirdSubContainer = document.createElement('div');
  thirdSubContainer.setAttribute('class', 'p-3 blur2 weekdays');
  let weekDaysIcon = '';
neededData.days.forEach((element, index ) => {
  if (index < 5) {
    const condition = element.conditions.toLowerCase();
    if (condition.includes('rain')) {
      weekDaysIcon = '<i class="bi bi-cloud fs-2"></i>';
    } else if (condition.includes('sun')) {
      weekDaysIcon = '<i class="bi bi-sun-fill fs-2"></i>';
    } else if (condition.includes('cloudy')) {
      weekDaysIcon = '<i class="bi bi-cloud-sun fs-2"></i>';
    } else if (condition.includes('clear')) {
      weekDaysIcon = '<i class="bi bi-brightness-alt-high-fill fs-2"></i>';
    } else {
      weekDaysIcon = '<i class="bi bi-brightness-alt-high-fill fs-2"></i>'
    }
    const weekdaysInner = document.createElement('div');
    weekdaysInner.setAttribute('class', 'weekdays-inner gap-3 align-grid-center');
    weekdaysInner.innerHTML = ` <div class="icon ps-2">${weekDaysIcon}</div> <div class="d-grid self-center" style="justify-self: self-start;"><span>${format(new Date(element.datetime), "EEEE")}</span><span class="lead fs-08">${element.conditions}</span></div> <span class="self-baseline">${fahToCel(element.temp).toFixed(2)}<sup>o</sup></span>`

    thirdSubContainer.appendChild(weekdaysInner);
  }
});
  
  // Below the containerGrid
  const hourContainer = document.createElement('div');
  hourContainer.setAttribute('class', 'd-grid shape pb-100');
  
  
  // Append children
  content.appendChild(containerGrid);
  containerGrid.appendChild(firstSubContainer);
  firstSubContainer.appendChild(firstSubp1);
  firstSubContainer.appendChild(firstSubp2);
  firstSubContainer.appendChild(firstDetailsContainer);
  firstDetailsContainer.appendChild(windDetails);
  windDetails.appendChild(windP1);
  windDetails.appendChild(windP2);
  firstDetailsContainer.appendChild(humidityDetails);
  humidityDetails.appendChild(humidityP1);
  humidityDetails.appendChild(humidityP2);

  containerGrid.appendChild(secondSubContainer);
  secondSubContainer.appendChild(bgImage);

  containerGrid.appendChild(thirdSubContainer);
  
  content.appendChild(hourContainer);
}

displayContent();