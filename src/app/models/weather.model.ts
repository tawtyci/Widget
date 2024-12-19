import { ForecastDetails } from "./forecast.model";

export interface IWeatherData {
	name: string;
	temperature: number;
	windSpeed: number;
	pressureValue: number;
	weatherDescription: string;
	weatherIcon: string;
	forecastDetailsList: ForecastDetails[];
}

export class WeatherData implements IWeatherData {
	name: string;
	temperature: number;
	windSpeed: number;
	pressureValue: number;
	weatherDescription: string;
	weatherIcon: string;
	forecastDetailsList: ForecastDetails[];

	constructor(data: IWeatherData) {
		this.name = data.name;
		this.temperature = data.temperature;
		this.windSpeed = data.windSpeed;
		this.pressureValue = data.pressureValue;
		this.weatherDescription = data.weatherDescription;
		this.weatherIcon = data.weatherIcon;
		this.forecastDetailsList = data.forecastDetailsList;
	}
}
