import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IUserSettings, Settings } from "../models/settings.model";

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	private settingsSubject: BehaviorSubject<Settings>;

	constructor() {
		const savedSettings = localStorage.getItem("weatherSettings");
		const initialSettings: Settings = savedSettings
		? JSON.parse(savedSettings)
		: new Settings({
			temperatureUnit: "metric",
			windUnit: "m/s",
			pressureUnit: "hPa",
			trackedTownList: ["Saransk"]
		});

		if (!savedSettings) {
			localStorage.setItem("weatherSettings", JSON.stringify(initialSettings));
		}

		this.settingsSubject = new BehaviorSubject<Settings>(initialSettings);
	}

	public getSettings$() {
		return this.settingsSubject.asObservable();
	}

	public getCurrentSettings(): Settings {
		return this.settingsSubject.getValue();
	}

	public updateSetting(key: keyof IUserSettings, value: string | string[]): void {
		const currentSettings = this.settingsSubject.getValue();
		const updatedSettings = {
			...currentSettings,
			[key]: value,
		};

		this.settingsSubject.next(updatedSettings);
		localStorage.setItem("weatherSettings", JSON.stringify(updatedSettings));
	}
}
