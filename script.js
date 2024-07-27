const weather_API_key = "JA37U6KZ57RP94XM8SJ5528TV";
const submit = document.querySelector(".submit");
let weatherData;

getWeatherReport("Rome");

submit.addEventListener("click", () => {
  const locationInput = document.querySelector(".city");
  const location = locationInput.value;
  getWeatherReport(location);
});

async function getWeatherReport(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${weather_API_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    weatherData = data;
  } catch (e) {
    console.error(e.message);
  }

  UpdateWeatherUI(weatherData);
}
/*conditions, datetime, temp */

function UpdateWeatherUI(weatherData) {
  const condition = document.createElement("p");
  condition.textContent = weatherData.currentConditions.conditions;
  const dateTime = document.createElement("p");
  dateTime.textContent = weatherData.currentConditions.datetime;
  const temp = document.createElement("p");
  temp.textContent = weatherData.currentConditions.temp;
  /*
  const weatherInfo = document.querySelector(".weatherInfo");
  weatherInfo.appendChild(condition);
  weatherInfo.appendChild(dateTime);
  weatherInfo.appendChild(temp);
  */
}
