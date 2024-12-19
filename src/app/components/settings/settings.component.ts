import { Component, inject, OnInit } from '@angular/core';
import { PressureUnit, Settings, TemperatureUnit, WindUnit } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
	private readonly settingsService = inject(SettingsService);

	public settings!: Settings;
	
	public temperatureUnits: TemperatureUnit[] = ["metric", "imperial"];
	public windUnits: WindUnit[] = ["km/h", "mil/h", "m/s", "kn"];
	public pressureUnits: PressureUnit[] = ["mbar", "atm", "mmHg", "inHg", "hPa"];

	public activeDropdown: number = -1;

	public ngOnInit(): void {
		this.settingsService.getSettings$()
			.subscribe((settings) => {
				this.settings = settings;
			});
	}

	public updateSetting(key: keyof Settings, value: string, index: number): void {
		this.settingsService.updateSetting(key, value);
		this.toggleDropdown(index);
	}

	public toggleDropdown(index: number): void {
		this.activeDropdown = this.activeDropdown === index ? -1 : index;
	}
}