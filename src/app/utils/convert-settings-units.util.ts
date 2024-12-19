import { PressureUnit, TemperatureUnit, WindUnit } from "../models/settings.model";

export class ConvertSettingsUnits {
	static convertWindSpeed(value: number, unit: WindUnit): number {
		switch (unit) {
			case 'km/h': return value * 3.6;
			case 'mil/h': return value * 2.237;
			case 'kn': return value * 1.94384;
			default: return value;
		}
	}

	static convertPressure(value: number, unit: PressureUnit): number {
		switch (unit) {
			case 'atm': return value / 1013.25;
			case 'mmHg': return value * 0.750062;
			case 'inHg': return value * 0.02953;
			default: return value; // hPa
		}
	}

	static convertTemperature(value: number, metric: TemperatureUnit): number {
        switch (metric) {
            case 'imperial': return (value * 9/5) + 32; // °C → °F
            default: return value;
        }
    }
}