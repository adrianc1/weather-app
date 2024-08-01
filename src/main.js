const searchBtn = document.getElementById('search-btn');
const changeUnitBtn = document.getElementById('toggle');
let weatherData;

async function getWeatherData(e) {
	if (e) {
		e.preventDefault();
	}
	const searchInput = document.getElementById('search');
	const cityName = searchInput.value;
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&key=LZGKV9FJML8H8MKBR2N9E4AF7&iconSet=icons1&contentType=json`;

	const weatherDataResponse = await fetch(url, { mode: 'cors' }).catch(
		handleError
	);

	if (weatherDataResponse.ok) {
		const dataJSON = await weatherDataResponse.json();
		weatherData = extractData(dataJSON);
		displayDataUI(weatherData);
		return weatherData;
	} else {
		handleError(weatherDataResponse);
	}
}

function extractData(data) {
	const days = data.days;
	const currentConditions = data.currentConditions;
	const location = data.resolvedAddress;
	return {
		currentConditions,
		location,
		days,
	};
}

// Handle Errors
function handleError(err) {
	if (err.status === 400) {
		console.error('Error: Please enter a valid location. ');
		return;
	}
	throw new Error('FAILED TO FETCH');
}

function displayDataUI(data) {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	displayCurrentWeather(data, days);
	displayFollowingDaysWeather(data, days);
}

// Display current weather forecast
function displayCurrentWeather(data, dayArray) {
	const location = data.location;
	const currentDay = data.days[0];

	const locationDiv = document.getElementById('location');
	const currentDayTitle = document.getElementById('current-day-title');
	const currentDayIndex = new Date(currentDay.datetime).getDay();
	locationDiv.textContent = location;
	currentDayTitle.textContent = dayArray[currentDayIndex];

	displayCurrentWeatherIcon(data, currentDay);
	displayCurrentTempFar(data, currentDay);
}

// display Current Temp, and Day High and Low
function displayCurrentTempFar(data, currentDay) {
	const currentTemp = document.getElementById('current-temp');
	const currentHighTemp = document.getElementById('current-high-temp');
	const currentLowTemp = document.getElementById('current-low-temp');

	currentTemp.textContent = `Current Temp: ${data.currentConditions.temp} F`;
	currentHighTemp.textContent = `High: ${currentDay.tempmax} F`;
	currentLowTemp.textContent = `Low: ${currentDay.tempmin} F `;
}

function displayCurrentTempCel(data) {
	const obj = data;
	const currentTemp = document.getElementById('current-temp');
	const currentHighTemp = document.getElementById('current-high-temp');
	const currentLowTemp = document.getElementById('current-low-temp');
	const tempMaxFar = obj.days[0].tempmax;
	const tempMinFar = obj.days[0].tempmin;
	const currentTempFar = obj.days[0].temp;
	const currentTempCel = (currentTempFar - 32) * (5 / 9);
	const tempMaxCel = (tempMaxFar - 32) * (5 / 9);
	const tempMinCel = (tempMinFar - 32) * (5 / 9);

	currentTemp.textContent = `Current Temp: ${currentTempCel.toFixed(1)} C`;
	currentHighTemp.textContent = `High: ${tempMaxCel.toFixed(1)} C`;
	currentLowTemp.textContent = `Low: ${tempMinCel.toFixed(1)} C `;
}

function displayFollowingDaysCelcius(Wdata) {
	const data = Wdata;
	for (let i = 1; i < 7; i++) {
		const nextDayHighTempDiv = document.getElementById(`day${i}-high-temp`);
		const nextDayLowTempDiv = document.getElementById(`day${i}-low-temp`);
		const nextDayHighTempFar = data.days[i].tempmax;
		const nextDayLowTempFar = data.days[i].tempmin;
		const tempMaxCel = (nextDayHighTempFar - 32) * (5 / 9);
		const tempMinCel = (nextDayLowTempFar - 32) * (5 / 9);

		nextDayHighTempDiv.textContent = `High: ${tempMaxCel.toFixed(1)}`;
		nextDayLowTempDiv.textContent = `Low: ${tempMinCel.toFixed(1)}`;
	}
}

function toggleCurrentFarCel() {
	if (changeUnitBtn.checked) {
		displayCurrentTempCel(weatherData);
		displayFollowingDaysCelcius(weatherData);
	} else {
		console.log('fiale');
		getWeatherData();
	}
}

// get current weather icon
function displayCurrentWeatherIcon(data) {
	const currentIconDiv = document.getElementById('current-weather-icon');
	if (currentIconDiv.hasChildNodes()) {
		currentIconDiv.innerHTML = '';
	}
	const currentIcon = new Image();
	currentIcon.src = `${data.currentConditions.icon}.png`;
	currentIconDiv.appendChild(currentIcon);
}

// Display Following Days Weather forecast
function displayFollowingDaysWeather(data, days) {
	// loop to print out the remainder of the week
	for (let i = 1; i < days.length; i++) {
		const nextDayTitleDiv = document.getElementById(`day${i}-title`);
		const nextDayHighTemp = document.getElementById(`day${i}-high-temp`);
		const nextDayLowTemp = document.getElementById(`day${i}-low-temp`);
		const nextDayWeatherIconDiv = document.getElementById(
			`day${i}-weather-icon`
		);

		// check if weather icon is already present, if so, remove to add a new one
		if (nextDayWeatherIconDiv.hasChildNodes()) {
			nextDayWeatherIconDiv.innerHTML = '';
		}

		// create new icon image to add to html
		const nextDayWeatherIcon = new Image();
		nextDayWeatherIcon.src = `${data.days[i].icon}.png`;
		nextDayWeatherIconDiv.appendChild(nextDayWeatherIcon);

		// display the day of the week as a title on cell
		const nextDay = data.days[i];
		const nextDayIndex = new Date(nextDay.datetime).getDay();
		nextDayTitleDiv.textContent = days[nextDayIndex];

		// get the following days Highs and Lows in F
		nextDayHighTemp.textContent = `High: ${data.days[i].tempmax}`;
		nextDayLowTemp.textContent = `Low: ${data.days[i].tempmin}`;
	}
}

// toggle the degree units
changeUnitBtn.addEventListener('click', toggleCurrentFarCel);

searchBtn.addEventListener('click', getWeatherData);
