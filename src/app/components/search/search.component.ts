import { Component, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, forkJoin, map, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { SettingsService } from '../../services/settings.service';

export interface ITown {
	name: string;
	weather: IWeather;
}

export interface IWeather {
	temp: number;
	icon: string;
	feelsLike: number;
	description: string;
}

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss'
})
export class SearchComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly weatherService = inject(WeatherService);
	public searchTerm$ = new BehaviorSubject<string>('');
	public townList: ITown[] = [];

	constructor() {
		this.setupSearch();
	}
	
	public onSearch(event: Event): void {
		const input = (event.target as HTMLInputElement).value;
		this.searchTerm$.next(input);
	}

	private setupSearch() {
		this.searchTerm$.pipe(
			debounceTime(500),
			switchMap((searchTerm) => {
				if (!searchTerm.trim()) {
					this.townList = [];
					return [];
				}
	
				return this.weatherService.searchTown(searchTerm).pipe(
					switchMap((townList: any[]) => {
						const weatherRequests = townList.map((town) =>
							this.weatherService.getWeatherByCoordinates(town.lat, town.lon).pipe(
							map((weather) => ({
								...town,
								weather: {
									temp: weather.main.temp,
									icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
									feelsLike: weather.main.feels_like,
									description: weather.weather[0].description
								}
							}))
							)
						);

						return forkJoin(weatherRequests);
					})
				);
			})
		)
		.subscribe((townListWithWeather) => {
			this.townList = townListWithWeather;
		});
	}

	public trackTown(name: string) {
		const currentTownList = this.settingsService.getCurrentSettings().trackedTownList;
		this.settingsService.updateSetting('trackedTownList', [...currentTownList, name]);
	}
}