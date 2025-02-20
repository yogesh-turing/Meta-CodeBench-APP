const axios = require('axios');
const fs = require('fs').promises;

class WeatherAPI {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    }

    async searchLocation(cityName) {
        try {
            const response = await axios.get(this.geocodingUrl, {
                params: {
                    name: cityName,
                    count: 5,
                    language: 'en',
                    format: 'json'
                }
            });
            return response.data.results?.map(location => ({
                name: location.name,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
                timezone: location.timezone
            })) || [];
        } catch (error) {
            console.error('Error searching location:', error.message);
            throw error;
        }
    }

    async fetchWeather(latitude, longitude) {
        try {
            return await axios.get(this.baseUrl, {
                params: {
                    latitude,
                    longitude,
                    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,cloud_cover',
                    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
                    timezone: 'auto',
                    forecast_days: 7
                }
            });
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }
}

class WeatherDataFormatter {
    format(data) {
        const { current, daily } = data;
        return {
            timestamp: new Date().toISOString(),
            current: this.formatCurrent(current),
            forecast: this.formatForecast(daily),
            alerts: []  // Will be populated by AlertService
        };
    }

    formatCurrent(current) {
        return {
            temperature: `${current.temperature_2m}°C`,
            humidity: `${current.relative_humidity_2m}%`,
            windSpeed: `${current.wind_speed_10m} km/h`,
            precipitation: `${current.precipitation} mm`,
            cloudCover: `${current.cloud_cover}%`
        };
    }

    formatForecast(daily) {
        return daily.time.map((date, index) => ({
            date,
            maxTemp: `${daily.temperature_2m_max[index]}°C`,
            minTemp: `${daily.temperature_2m_min[index]}°C`,
            precipitation: `${daily.precipitation_sum[index]} mm`
        }));
    }
}

class WeatherStorage {
    constructor(filename = 'weather_history.json') {
        this.filename = filename;
    }

    async save(data) {
        try {
            let history = await this.load();
            history.push(data);
            if (history.length > 10) {
                history = history.slice(-10);
            }
            await fs.writeFile(this.filename, JSON.stringify(history, null, 2));
        } catch (error) {
            console.error('Error saving to history:', error.message);
        }
    }

    async load() {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

class WeatherAlertService {
    constructor(thresholds = {
        highTemp: 30,
        lowTemp: 0,
        strongWind: 50,
        heavyPrecipitation: 10
    }) {
        this.thresholds = thresholds;
    }

    generateAlerts(current) {
        const alerts = [];
        if (current.temperature_2m > this.thresholds.highTemp) alerts.push('High temperature alert!');
        if (current.temperature_2m < this.thresholds.lowTemp) alerts.push('Freezing temperature alert!');
        if (current.wind_speed_10m > this.thresholds.strongWind) alerts.push('Strong wind alert!');
        if (current.precipitation > this.thresholds.heavyPrecipitation) alerts.push('Heavy precipitation alert!');
        return alerts;
    }
}

class WeatherStatsCalculator {
    calculate(forecast, days) {
        const relevantForecast = forecast.slice(0, days);
        const temps = relevantForecast.flatMap(day => [
            parseFloat(day.maxTemp),
            parseFloat(day.minTemp)
        ]);

        return {
            averageTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) + '°C',
            maxTemp: Math.max(...temps) + '°C',
            minTemp: Math.min(...temps) + '°C',
            totalPrecipitation: relevantForecast.reduce((sum, day) => 
                sum + parseFloat(day.precipitation), 0).toFixed(1) + ' mm'
        };
    }
}

class WeatherTracker {
    constructor() {
        this.api = new WeatherAPI();
        this.formatter = new WeatherDataFormatter();
        this.storage = new WeatherStorage();
        this.alertService = new WeatherAlertService();
        this.statsCalculator = new WeatherStatsCalculator();
    }

    async searchLocation(cityName) {
        return await this.api.searchLocation(cityName);
    }

    async getWeather(latitude, longitude) {
        const response = await this.api.fetchWeather(latitude, longitude);
        const weatherData = this.formatWeatherData(response.data);
        await this.saveToHistory(weatherData);
        return weatherData;
    }

    formatWeatherData(data) {
        const formattedData = this.formatter.format(data);
        formattedData.alerts = this.generateWeatherAlerts(data.current);
        return formattedData;
    }

    generateWeatherAlerts(current) {
        return this.alertService.generateAlerts(current);
    }

    async saveToHistory(weatherData) {
        await this.storage.save(weatherData);
    }

    async getHistory() {
        return await this.storage.load();
    }

    async getWeatherStats(latitude, longitude, days = 7) {
        const weather = await this.getWeather(latitude, longitude);
        return this.statsCalculator.calculate(weather.forecast, days);
    }
}

module.exports = { WeatherTracker };