(() => {
	const searchBtn = document.getElementById('search-btn');

	async function getWeatherData() {
		const searchInput = document.getElementById('search');
		const cityName = searchInput.value;
		const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&key=LZGKV9FJML8H8MKBR2N9E4AF7&contentType=json`;

		const weatherDataResponse = await fetch(url, { mode: 'cors' }).catch(
			handleError
		);

		if (weatherDataResponse.ok) {
			const dataJSON = await weatherDataResponse.json();
			const extractedDataObj = extractData(dataJSON);
			displayDataUI(extractedDataObj);
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
		// get the current weather for today
		const location = data.location;
		const currentDay = data.days[0];

		// get current weather icon
		const currentIconDiv = document.getElementById('current-weather-icon');

		if (currentIconDiv.hasChildNodes()) {
			currentIconDiv.innerHTML = '';
		}

		const currentIcon = new Image();
		currentIcon.src = `${data.currentConditions.icon}.png`;
		currentIconDiv.appendChild(currentIcon);
		const currentDayIndex = new Date(currentDay.datetime).getDay();

		// get location and temp divs
		const locationDiv = document.getElementById('location');
		const currentDayTitle = document.getElementById('current-day-title');
		const currentTemp = document.getElementById('current-temp');
		const currentHighTemp = document.getElementById('current-high-temp');
		const currentLowTemp = document.getElementById('current-low-temp');

		// print location and temp data
		locationDiv.textContent = location;
		currentDayTitle.textContent = dayArray[currentDayIndex];
		currentTemp.textContent = `Current Temp: ${data.currentConditions.temp} F`;
		currentHighTemp.textContent = `High: ${currentDay.tempmax} F`;
		currentLowTemp.textContent = `Low: ${currentDay.tempmin} F `;

		return {
			currentIcon,
			currentIconDiv,
		};
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

			if (nextDayWeatherIconDiv.hasChildNodes()) {
				nextDayWeatherIconDiv.innerHTML = '';
			}

			const nextDayWeatherIcon = new Image();

			nextDayWeatherIcon.src = `${data.days[i].icon}.png`;
			nextDayWeatherIconDiv.appendChild(nextDayWeatherIcon);
			const nextDay = data.days[i];
			const nextDayIndex = new Date(nextDay.datetime).getDay();
			nextDayTitleDiv.textContent = days[nextDayIndex];
			nextDayHighTemp.textContent = `High: ${data.days[i].tempmax}`;
			nextDayLowTemp.textContent = `Low: ${data.days[i].tempmin}`;
		}
	}

	searchBtn.addEventListener('click', getWeatherData);
})();
