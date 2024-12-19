export interface IUserSettings {
	temperatureUnit: TemperatureUnit;
	windUnit: WindUnit;
	pressureUnit: PressureUnit;
	trackedTownList: string[];
}

export class Settings implements IUserSettings {
	temperatureUnit: TemperatureUnit;
	windUnit: WindUnit;
	pressureUnit: PressureUnit;
	trackedTownList: string[];

	constructor(settings: IUserSettings) {
		this.temperatureUnit = settings.temperatureUnit;
		this.windUnit = settings.windUnit;
		this.pressureUnit = settings.pressureUnit;
		this.trackedTownList = settings.trackedTownList;
	}
}

export type TemperatureUnit = 'metric' | 'imperial';
export type WindUnit = 'km/h' |'mil/h' | 'm/s' | 'kn';
export type PressureUnit = 'mbar' | 'atm' | 'mmHg' | 'inHg' | 'hPa';