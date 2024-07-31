const weather_API_key = "JA37U6KZ57RP94XM8SJ5528TV";
const submit = document.querySelector(".submit");
let weatherData;

getWeatherReport("Rome");

submit.addEventListener("click", () => {
  const locationInput = document.querySelector(".city");
  const location = locationInput.value;
  getWeatherReport(location);
});

const input = document.querySelector(".city");
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submit.click();
  }
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

function UpdateWeatherUI(weatherData) {
  const dataCity = weatherData.resolvedAddress;

  const dataCondition =
    (weatherData.currentConditions &&
      weatherData.currentConditions.conditions) ||
    weatherData.conditions;
  const dataDateTime =
    (weatherData.currentConditions && weatherData.currentConditions.datetime) ||
    weatherData.datetime;
  const dataTemp =
    (weatherData.currentConditions && weatherData.currentConditions.temp) ||
    weatherData.temp;
  const dataWind =
    (weatherData.currentConditions &&
      weatherData.currentConditions.windspeed) ||
    weatherData.windspeed;
  const dataDay =
    (weatherData.days && weatherData.days[0].datetime) || weatherData.datetime;
  const dataDescription = weatherData.description;

  const leftCity = document.querySelector(".leftCity");
  if (dataCity !== undefined) {
    leftCity.textContent = dataCity;
  }

  const leftTemp = document.querySelector("#temperature");
  leftTemp.textContent = dataTemp + "°C";

  const wind = document.querySelector(".wind");
  wind.textContent = dataWind + " km/h";

  const leftTime = document.querySelector(".leftTime");
  if (dataDateTime !== dataDay) {
    leftTime.textContent = dataDateTime;
  }
  const leftDate = document.querySelector(".leftDate");
  leftDate.textContent = dataDay;

  const leftCondition = document.querySelector(".leftCondition");
  leftCondition.textContent = dataCondition;

  const leftDescription = document.querySelector(".leftDescritpion");
  leftDescription.textContent = dataDescription;

  const leftSctHour = document.querySelector(".leftSctHour");

  //Create Left Section Card Hour

  const arrayHourData =
    (weatherData.days && weatherData.days[0].hours) || weatherData.hours;

  leftSctHour.innerHTML = "";
  arrayHourData.forEach((hours, hour) => {
    const cardHourDiv = document.createElement("div");
    cardHourDiv.className = "cardHour";

    const timeHourP = document.createElement("p");
    timeHourP.className = "timeHourSct";

    timeHourP.textContent = hours.datetime.slice(0, -3);

    const imgElement = document.createElement("img");

    imgElement.src = `images/icon/${dataCondition}.png`;
    imgElement.alt = `${dataCondition}`;
    imgElement.className = "sidebarImg";

    const tempHourP = document.createElement("p");
    tempHourP.className = "temperaturehourSct";
    tempHourP.textContent = hours.temp + "°C";

    cardHourDiv.appendChild(timeHourP);
    cardHourDiv.appendChild(imgElement);
    cardHourDiv.appendChild(tempHourP);

    leftSctHour.appendChild(cardHourDiv);
  });

  createNextDays(5);

  //Add event Listener to 5/10/15 Days button
  const forecastBtns = document.querySelectorAll(".nextDaysBtn");

  forecastBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      createNextDays(parseInt(btn.textContent));
    });
  });

  //Create Next Days Cards
  function createNextDays(NDay) {
    const arrayDaysData = weatherData.days;

    const otherDaysCards = document.querySelector(".otherDaysCards");
    otherDaysCards.innerHTML = "";
    for (let i = 0; i < NDay; i++) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";

      const imgElement = document.createElement("img");
      imgElement.src = `images/icon/${arrayDaysData[i].conditions}.png`;
      imgElement.alt = `${arrayDaysData[i].conditions}`;
      imgElement.className = "sidebarImg";

      const infoDiv = document.createElement("div");

      const dateP = document.createElement("p");
      dateP.className = "date";
      dateP.textContent = arrayDaysData[i].datetime;

      const conditionP = document.createElement("p");
      conditionP.className = "condition";
      conditionP.textContent = arrayDaysData[i].conditions;

      infoDiv.appendChild(dateP);
      infoDiv.appendChild(conditionP);

      const cardTempDiv = document.createElement("div");
      cardTempDiv.className = "cardTemp";

      const tempMinP = document.createElement("p");
      tempMinP.className = "tempMin";
      tempMinP.textContent = arrayDaysData[i].tempmin + "°C";

      const tempMaxP = document.createElement("p");
      tempMaxP.className = "tempMax";
      tempMaxP.textContent = arrayDaysData[i].tempmax + "°C";

      cardTempDiv.appendChild(tempMinP);
      cardTempDiv.appendChild(tempMaxP);

      cardDiv.appendChild(imgElement);
      cardDiv.appendChild(infoDiv);
      cardDiv.appendChild(cardTempDiv);

      otherDaysCards.appendChild(cardDiv);

      cardDiv.addEventListener("click", () => {
        const index = weatherData.days.findIndex(
          (day) => day.datetime === dateP.textContent
        );

        leftSctHour.innerHTML = "";
        UpdateWeatherUI(weatherData.days[index]);
      });
    }
  }
}
