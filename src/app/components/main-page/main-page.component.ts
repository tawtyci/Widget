import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { SettingsService } from '../../services/settings.service';
import { ConvertSettingsUnits } from '../../utils/convert-settings-units.util';
import { Settings } from '../../models/settings.model';
import { IWeatherData, WeatherData } from '../../models/weather.model';
import { ForecastDetails } from '../../models/forecast.model';

@Component({
	selector: 'app-main',
	templateUrl: './main-page.component.html',
	styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
	private readonly settingsService = inject(SettingsService);
	private readonly weatherService = inject(WeatherService);

	@ViewChild('weatherCard', { static: false }) weatherCard!: ElementRef;

	public settings!: Settings;
	public townWeatherList: WeatherData[] = [];
	public currentTown: WeatherData | null = null;
	public weeklyForecast: any[] = [];
	public date = new Date();
	public trackedTownList: string[] = [];

	public currentCardIndex: number = 0;
	public startX: number = 0;
	public isSwiping: boolean = false;

	public async ngOnInit(): Promise<void> {
		this.settings = this.settingsService.getCurrentSettings();
		this.trackedTownList = this.settingsService.getCurrentSettings().trackedTownList;
		this.trackedTownList.forEach((town, index) => {
			this.getWeather(town, index).then(() => {
				this.getForecastDetails(town);
			});
		});
	}

	public async getWeather(town: string, index: number): Promise<void> {
		this.weatherService.getWeather(town)
			.subscribe((data) => {
				const weatherData: IWeatherData = {
					name: data.name,
					temperature: data.main.temp,
					windSpeed: ConvertSettingsUnits.convertWindSpeed(data.wind.speed, this.settings.windUnit),
					pressureValue: ConvertSettingsUnits.convertPressure(data.main.pressure, this.settings.pressureUnit),
					weatherDescription: data.weather[0].description,
					weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
					forecastDetailsList: []
				};
	
				// Вставляем в массив строго по индексу
				this.townWeatherList[index] = weatherData;

				if (index === 0) {
					this.currentTown = this.townWeatherList[index];
					this.getWeeklyForecastDetails();
				}
			});
	}

	public getForecastDetails(town: string): void {
		this.weatherService.getHourlyForecast(town).subscribe((data) => {
			const townData = this.townWeatherList.find(item => item.name === town);
			townData!.forecastDetailsList = data.list.map((item: any) => {
				return new ForecastDetails({
					date: item.dt_txt,
					weatherIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` ,
					temperature: item.main.temp,
					feelsLikeTemperature: item.main.feels_like,
					windSpeed: item.wind.speed
				});
			});
		});
	}

	public getWeeklyForecastDetails() {
		this.weatherService.getWeeklyForecast(this.currentTown?.name ?? '')
			.subscribe(
				(forecast) => {
					this.weeklyForecast = forecast.map((day: any) => ({
						...day,
						tempMin: ConvertSettingsUnits.convertTemperature(day.tempMin, this.settings.temperatureUnit),
						tempMax: ConvertSettingsUnits.convertTemperature(day.tempMax, this.settings.temperatureUnit),
					}));
				}
			);
	}

	public onMouseDown(event: MouseEvent | TouchEvent, index: number): void {
		this.startX = this.getEventX(event);
		this.isSwiping = true;
	}
  
	@HostListener('mousemove', ['$event'])
	@HostListener('touchmove', ['$event'])
	public onMouseMove(event: MouseEvent | TouchEvent): void {
	  	if (!this.isSwiping) return;
  
	  	const currentX = this.getEventX(event);
	  	const diffX = currentX - this.startX;
		
		if (Math.abs(diffX) > 150) {
			if (diffX > 0) {
				this.swipeRight(); 
			} else {
				this.swipeLeft();
			}
		
			this.isSwiping = false;
		}
	}

	@HostListener('mouseup', ['$event'])
	@HostListener('touchend', ['$event'])
	public onMouseUp(): void {
	  	this.isSwiping = false;
	}

	private swipeRight(): void {
	  if (this.currentCardIndex > 0) {
			this.currentCardIndex--;
			this.currentTown = this.townWeatherList[this.currentCardIndex];
			this.getWeeklyForecastDetails();
	  }
	}

	private swipeLeft(): void {
		if (this.currentCardIndex < this.townWeatherList.length - 1) {
			this.currentCardIndex++;
			this.currentTown = this.townWeatherList[this.currentCardIndex];
			this.getWeeklyForecastDetails();
		}
	}

	private getEventX(event: MouseEvent | TouchEvent): number {
		return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
	}
}
