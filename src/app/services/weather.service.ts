import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root',
})
export class WeatherService {
	private readonly settingsService = inject(SettingsService);
	private readonly httpClient = inject(HttpClient);
	
	private apiKey = '82414721692cf3c6834127ef14c2bcad';
	private baseUrl = 'https://api.openweathermap.org/data/2.5/';
	private geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';

	public getWeather(town: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();

		return this.httpClient.get(`${this.baseUrl}weather`, {
			params: {
				q: town,
				units: settings.temperatureUnit,
				appid: this.apiKey,
			},
		});
	}

	public getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
		return this.httpClient.get(url);
	}

	public getHourlyForecast(town: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();

		return this.httpClient.get(`${this.baseUrl}forecast`, {
			params: {
				q: town,
				units: settings.temperatureUnit,
				cnt: 5,
				appid: this.apiKey,
			},
		});
	}

	public searchTown(townName: string, limit: number = 5): Observable<any> {
		const url = `${this.geoApiUrl}?q=${townName}&limit=${limit}&appid=${this.apiKey}`;
		return this.httpClient.get(url);
	}

	public getWeeklyForecast(town: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();
	
		// Получаем координаты города
		return this.searchTown(town).pipe(
			switchMap((townData) => {
				if (!townData || townData.length === 0) {
					throw new Error('Town not found');
				}
				const lat = townData[0].lat;
				const lon = townData[0].lon;
	
				return this.httpClient.get(`https://api.open-meteo.com/v1/forecast`, {
					params: {
						latitude: lat,
						longitude: lon,
						daily: 'temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode',
						unit_system: settings.temperatureUnit === 'metric' ? 'metric' : 'imperial', // В зависимости от единиц
					},
				});
			}),
			map((response: any) => {
				return this.processDailyForecast(response.daily);
			})
		);
	}

	private processDailyForecast(response: any): any[] {
		return response.time.map((date: string, index: number) => {
			const weatherDescription = this.getWeatherDescription(response.weathercode[index]);

			return {
				date: date,
				tempMin: response.temperature_2m_min[index],
				tempMax: response.temperature_2m_max[index],
				precipitation: response.precipitation_sum[index],
				weather: weatherDescription,
			};
		});
	}

	private getWeatherDescription(code: number): string {
		const weatherCodes = {
			0: 'Clear sky',
			1: 'Mainly clear',
			2: 'Partly cloudy',
			3: 'Cloudy',
			45: 'Fog',
			48: 'Depositing rime fog',
			51: 'Light drizzle',
			53: 'Moderate drizzle',
			55: 'Heavy drizzle',
			56: 'Freezing drizzle',
			57: 'Heavy freezing drizzle',
			61: 'Light rain',
			63: 'Moderate rain',
			65: 'Heavy rain',
			71: 'Light snow',
			73: 'Moderate snow',
			75: 'Heavy snow',
			77: 'Snow grains',
			80: 'Light rain showers',
			81: 'Moderate rain showers',
			82: 'Heavy rain showers',
			85: 'Light snow showers',
			86: 'Heavy snow showers',
		};
	
		//@ts-ignore
		return weatherCodes[code] || 'Unknown weather';
	}
}
