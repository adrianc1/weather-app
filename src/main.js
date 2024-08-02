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
		displayWeatherData(weatherData);
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

// Display Following Days Weather forecast
function displayWeatherData(data) {
	changeBackgroundImage();
	displayCurrentTempFar(data);
	displayLocation(data);
	for (let i = 0; i < 7; i++) {
		displayWeatherIcon(data, i);
		displayDayOfWeek(data, i);
		displayHighLowTempFar(data, i);
	}
}

function displayDayOfWeek(data, i) {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const nextDayTitleDiv = document.getElementById(`day${i}-title`);
	const day = data.days[i];
	const dayIndex = new Date(day.datetime).getUTCDay();
	nextDayTitleDiv.textContent = days[dayIndex];
}

function displayLocation(data) {
	const locationDiv = document.getElementById('location');
	const location = data.location;
	locationDiv.textContent = location;
}

function displayHighLowTempFar(data, i) {
	const nextDayHighTemp = document.getElementById(`day${i}-high-temp`);
	const nextDayLowTemp = document.getElementById(`day${i}-low-temp`);
	nextDayHighTemp.textContent = `High: ${data.days[i].tempmax} F`;
	nextDayLowTemp.textContent = `Low: ${data.days[i].tempmin} F`;
}

function displayCurrentTempFar(data) {
	const currentTemp = document.getElementById('current-temp');
	currentTemp.textContent = `Current Temp: ${data.currentConditions.temp} F`;
}

function displayWeatherIcon(data, i) {
	const nextDayWeatherIcon = new Image();
	const nextDayWeatherIconDiv = document.getElementById(`day${i}-weather-icon`);
	if (nextDayWeatherIconDiv.hasChildNodes()) {
		nextDayWeatherIconDiv.innerHTML = '';
	}
	nextDayWeatherIcon.src = `./assets/${data.days[i].icon}.png`;
	nextDayWeatherIconDiv.appendChild(nextDayWeatherIcon);
}

function displayCelciusCurrentTemp(data) {
	const currentTemp = document.getElementById('current-temp');
	const currentTempFar = data.currentConditions.temp;
	const currentTempCelcius = (currentTempFar - 32) * (5 / 9);
	currentTemp.textContent = `Current Temp: ${currentTempCelcius.toFixed(1)} C`;
}

function displayCelciusWeatherData(data) {
	displayCelciusCurrentTemp(data);
	for (let i = 0; i < 7; i++) {
		const nextDayHighTempDiv = document.getElementById(`day${i}-high-temp`);
		const nextDayLowTempDiv = document.getElementById(`day${i}-low-temp`);
		const nextDayHighTempFar = data.days[i].tempmax;
		const nextDayLowTempFar = data.days[i].tempmin;
		const tempMaxCel = (nextDayHighTempFar - 32) * (5 / 9);
		const tempMinCel = (nextDayLowTempFar - 32) * (5 / 9);

		nextDayHighTempDiv.textContent = `High: ${tempMaxCel.toFixed(1)} C`;
		nextDayLowTempDiv.textContent = `Low: ${tempMinCel.toFixed(1)} C`;
	}
}

async function changeBackgroundImage() {
	const main = document.getElementById('main');
	const url = await getGifPromise();
	main.style.backgroundImage = `url('${url}')`;
	console.log(url);
}

function toggleCurrentFarCel() {
	const checkboxLabel = document.getElementById('checkbox-label');

	if (changeUnitBtn.checked) {
		checkboxLabel.innerHTML = 'Celcius';
		displayCelciusWeatherData(weatherData);
	} else {
		checkboxLabel.innerHTML = 'Farahenheit';
		getWeatherData();
	}
}

function getGifPromise() {
	return new Promise((resolve) => {
		const urls =
			'https://api.giphy.com/v1/gifs/6g9fN5IYV9Oc8?api_key=iZzRbuOlxTZY4S4wESrrknW7lE0fY3E9&rating=r';

		fetch(urls)
			.then((response) => {
				const json = response.json();
				return json;
			})
			.then((json) => {
				const bkgurl = json.data.images.original.url;
				resolve(bkgurl);
			});
	});
}
async function getGif() {
	const urls =
		'https://api.giphy.com/v1/gifs/6g9fN5IYV9Oc8?api_key=iZzRbuOlxTZY4S4wESrrknW7lE0fY3E9&rating=r';

// Display Following Days Weather forecast
function displayFollowingDaysWeather(data, days) {
	// loop to print out the remainder of the week

	console.log(data);
	for (let i = 0; i < days.length; i++) {
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
	const gif = await fetch(urls, { mode: 'cors' });
	const gifJSON = await gif.json();
	const bkgurl = await gifJSON.data.images.original.url;
	return bkgurl;
}

// toggle the degree units
changeUnitBtn.addEventListener('click', toggleCurrentFarCel);
searchBtn.addEventListener('click', getWeatherData);
