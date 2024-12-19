export interface IForecastDetails {
	date: string;
	weatherIcon: string;
	temperature: number;
	feelsLikeTemperature: number;
	windSpeed: number;
}

export class ForecastDetails implements IForecastDetails {
	date: string;
	weatherIcon: string;
	temperature: number;
	feelsLikeTemperature: number;
	windSpeed: number;

	constructor(data: IForecastDetails) {
		this.date = data.date;
		this.weatherIcon = data.weatherIcon;
		this.temperature = data.temperature;
		this.feelsLikeTemperature = data.feelsLikeTemperature;
		this.windSpeed = data.windSpeed;
	}
}
