// Display Following Days Weather forecast
function displayWeatherData(data) {
	//changeBackgroundImage()
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

function importAll(r) {
	let images = { r };
	r.keys().map((item, index) => {
		images[item.replace('./', '').replace('.png', '')] = r(item);
	});
	return images;
}

function displayWeatherIcon(data, i) {
	const icons = importAll(require.context('./assets', false, /\.(png)$/));
	const nextDayWeatherIcon = new Image();
	const nextDayWeatherIconDiv = document.getElementById(`day${i}-weather-icon`);

	if (nextDayWeatherIconDiv.hasChildNodes()) {
		nextDayWeatherIconDiv.innerHTML = '';
	}

	Object.entries(icons).forEach(([key, value]) => {
		if (key == data.days[i].icon) {
			nextDayWeatherIcon.src = value;
		}
	});

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

export { displayWeatherData, displayCelciusWeatherData };
