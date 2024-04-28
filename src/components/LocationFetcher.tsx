import { useState, useEffect } from "react";
import { WeatherData } from "../interfaces/WeatherData";

const LocationFetcher = ({
	location,
	onLocationChange,
	onWeatherChange,
}: any) => {
	const openCageAPIKey = process.env.REACT_APP_OPENCAGE_API_KEY;
	const openWeatherAPIKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	//useEffect for current position
	useEffect(() => {
		fetchCurrentPosition();
	}, []);
	//useEffect for current location
	useEffect(() => {
		if (latitude && longitude) {
			fetchCurrentLocation();
		}
	}, [latitude, longitude]);
	useEffect(() => {
		if (latitude && longitude) {
			fetchCurrentWeather();
		}
	}, [latitude, longitude]);

	const fetchCurrentPosition = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLatitude(position.coords.latitude);
					setLongitude(position.coords.longitude);
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			console.log("Geolocation not supported in your browser.");
		}
	};
	const fetchCurrentLocation = async () => {
		try {
			const response = await fetch(
				`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${openCageAPIKey}&pretty=1`
			);
			const data = await response.json();
			if (data.results.length > 0) {
				const results = data.results[0];
				const city = results.components.city;
				const state = results.components.state;
				const country = results.components.country;
				onLocationChange(`${city}, ${state}, ${country}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchCurrentWeather = async () => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPIKey}&units=metric`
			);
			const data: WeatherData = await response.json();

			onWeatherChange(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>{/* <div>{`Latitude = ${latitude} Longitude = ${longitude}`}</div> */}</>
	);
};

export default LocationFetcher;