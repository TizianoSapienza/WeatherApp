// This function gets the current weather data and hourly forecast data from the APIs
async function getWeather() {
  const apiKey = '';
  const city = document.getElementById('city').value;

  if (!city) {
    alert('Please enter a city');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=it&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=it&appid=${apiKey}`;

  try {
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherResponse.json();
    displayWeather(currentWeatherData);
  } catch (error) {
    console.log('Error in fetching current weather data', error);
    alert('Error in fetching current weather data. Please try again.');
  }

  try {
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    displayHourlyForecast(forecastData.list);
  } catch (error) {
    console.log('Error in fetching hourly forecast data.', error);
    alert('Error in fetching hourly forecast data. Please try again.');
  }
}

//This function displays the weather data on the page
function displayWeather(data) {
  const tempDiv = document.getElementById('temp-div');
  const weatherInfo = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');
  const capitalizeDesc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

  tempDiv.innerHTML = `<p>${Math.round(data.main.temp - 273.15)}°C</p>`;
  weatherInfo.innerHTML = `<h2>${data.name}</h2><p>${capitalizeDesc}</p>`;
  const iconClass = getFontAwesomeIconClass(data.weather[0].icon);
  weatherIcon.className = `fas ${iconClass}`;

  showImage();
}

//This function displays the hourly forecast data on the page
function displayHourlyForecast(hourlyData, within24Hours = true) {
  const hourlyForecast = document.getElementById('hourly-forecast');
  const startIndex = within24Hours ? 0 : hourlyData.length - 8;
  const endIndex = within24Hours ? 8 : hourlyData.length;
  const slice = hourlyData.slice(startIndex, endIndex);

  hourlyForecast.innerHTML = slice.map((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const description = item.weather[0].description;
    const iconCode = item.weather[0].icon;
    const iconClass = getFontAwesomeIconClass(iconCode);

    return `
      <div class="hourly-item">
        <p>${hour}:00</p>
        <i class="fas ${iconClass}" title="${description}"></i>
        <p>${temperature}°C</p>
      </div>
    `;
  }).join('');
}

//This function maps OpenWeatherMap icon codes to Font Awesome icon classes
function getFontAwesomeIconClass(iconCode) {
  // Map OpenWeatherMap icon codes to Font Awesome icon classes
  const iconMap = {
      '01d': 'fa-sun',   // clear sky (day)
      '01n': 'fa-moon',  // clear sky (night)
      '02d': 'fa-cloud-sun',   // few clouds (day)
      '02n': 'fa-cloud-moon',  // few clouds (night)
      '03d': 'fa-cloud',   // scattered clouds (day)
      '03n': 'fa-cloud',   // scattered clouds (night)
      '04d': 'fa-cloud',   // broken clouds (day)
      '04n': 'fa-cloud',   // broken clouds (night)
      '09d': 'fa-cloud-showers-heavy',   // shower rain (day)
      '09n': 'fa-cloud-showers-heavy',   // shower rain (night)
      '10d': 'fa-cloud-rain',   // rain (day)
      '10n': 'fa-cloud-rain',   // rain (night)
      '11d': 'fa-bolt',   // thunderstorm (day)
      '11n': 'fa-bolt',   // thunderstorm (night)
      '13d': 'fa-snowflake',   // snow (day)
      '13n': 'fa-snowflake',   // snow (night)
      '50d': 'fa-smog',   // mist (day)
      '50n': 'fa-smog'    // mist (night)
  };

  return iconMap[iconCode] || 'fa-question';
}

//This function shows the weather icon
function showImage() {
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.style.display = 'block';
}