const searchBtn = document.getElementById('search-btn');
const changeUnitBtn = document.getElementById('toggle');
import { displayWeatherData, displayCelciusWeatherData } from './ui.js';
import './style.css';
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

// function getGifPromise() {
// 	return new Promise((resolve) => {
// 		const urls =
// 			'https://api.giphy.com/v1/gifs/6g9fN5IYV9Oc8?api_key=iZzRbuOlxTZY4S4wESrrknW7lE0fY3E9&rating=r';

// 		fetch(urls)
// 			.then((response) => {
// 				const json = response.json();
// 				return json;
// 			})
// 			.then((json) => {
// 				const bkgurl = json.data.images.original.url;
// 				resolve(bkgurl);
// 			});
// 	});
// }

async function changeBackgroundImage() {
	const main = document.getElementById('main');
	const url = await getGifPromise();
	main.style.backgroundImage = `url('${url}')`;
	console.log(url);
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
	// throw new Error('FAILED TO FETCH');
	console.log('hey');
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

// toggle the degree units
changeUnitBtn.addEventListener('click', toggleCurrentFarCel);
searchBtn.addEventListener('click', getWeatherData);
