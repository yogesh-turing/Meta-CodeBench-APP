const axios = require('axios');
const fs = require('fs').promises;

// New WeatherAPI class
class WeatherAPI {
    constructor(baseUrl, geocodingUrl) {
        this.baseUrl = baseUrl;
        this.geocodingUrl = geocodingUrl;
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

    async getWeather(latitude, longitude) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude,
                    longitude,
                    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,cloud_cover',
                    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
                    timezone: 'auto',
                    forecast_days: 7
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }
}

// New WeatherFormatter class
class WeatherFormatter {
    formatWeatherData(data) {
        const { current, daily } = data;
        
        return {
            timestamp: new Date().toISOString(),
            current: {
                temperature: `${current.temperature_2m}°C`,
                humidity: `${current.relative_humidity_2m}%`,
                windSpeed: `${current.wind_speed_10m} km/h`,
                precipitation: `${current.precipitation} mm`,
                cloudCover: `${current.cloud_cover}%`
            },
            forecast: daily.time.map((date, index) => ({
                date,
                maxTemp: `${daily.temperature_2m_max[index]}°C`,
                minTemp: `${daily.temperature_2m_min[index]}°C`,
                precipitation: `${daily.precipitation_sum[index]} mm`
            })),
            alerts: []
        };
    }
}

// New AlertService class
class AlertService {
    constructor(thresholds = {
        highTemperature: 30,
        lowTemperature: 0,
        strongWind: 50,
        heavyPrecipitation: 10
    }) {
        this.thresholds = thresholds;
    }

    generateWeatherAlerts(current) {
        const alerts = [];
        
        if (current.temperature_2m > this.thresholds.highTemperature) alerts.push('High temperature alert!');
        if (current.temperature_2m < this.thresholds.lowTemperature) alerts.push('Freezing temperature alert!');
        if (current.wind_speed_10m > this.thresholds.strongWind) alerts.push('Strong wind alert!');
        if (current.precipitation > this.thresholds.heavyPrecipitation) alerts.push('Heavy precipitation alert!');
        
        return alerts;
    }
}

// New Storage class
class Storage {
    constructor(historyFile) {
        this.historyFile = historyFile;
    }

    async saveToHistory(weatherData) {
        try {
            let history = [];
            try {
                const data = await fs.readFile(this.historyFile, 'utf8');
                history = JSON.parse(data);
            } catch (error) {
                // File doesn't exist yet, start with empty history
            }

            history.push(weatherData);
            
            // Keep only last 10 entries
            if (history.length > 10) {
                history = history.slice(-10);
            }

            await fs.writeFile(this.historyFile, JSON.stringify(history, null, 2));
        } catch (error) {
            console.error('Error saving to history:', error.message);
        }
    }

    async getHistory() {
        try {
            const data = await fs.readFile(this.historyFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading history:', error.message);
            return [];
        }
    }
}

// New StatisticsCalculator class
class StatisticsCalculator {
    constructor(strategy = 'default') {
        this.strategy = strategy;
    }

    async getWeatherStats(latitude, longitude, days = 7, weatherData) {
        const forecast = weatherData.forecast.slice(0, days);

        const temps = forecast.flatMap(day => [
            parseFloat(day.maxTemp),
            parseFloat(day.minTemp)
        ]);

        return {
            averageTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) + '°C',
            maxTemp: Math.max(...temps) + '°C',
            minTemp: Math.min(...temps) + '°C',
            totalPrecipitation: forecast.reduce((sum, day) => 
                sum + parseFloat(day.precipitation), 0).toFixed(1) + ' mm'
        };
    }
}

// Refactored WeatherTracker class
class WeatherTracker {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.historyFile = 'weather_history.json';
        this.weatherAPI = new WeatherAPI(this.baseUrl, this.geocodingUrl);
        this.weatherFormatter = new WeatherFormatter();
        this.alertService = new AlertService();
        this.storage = new Storage(this.historyFile);
        this.statisticsCalculator = new StatisticsCalculator();
    }

    async searchLocation(cityName) {
        return this.weatherAPI.searchLocation(cityName);
    }

    async getWeather(latitude, longitude) {
        const data = await this.weatherAPI.getWeather(latitude, longitude);
        const formattedData = this.weatherFormatter.formatWeatherData(data);
        formattedData.alerts = this.alertService.generateWeatherAlerts(data.current);
        await this.storage.saveToHistory(formattedData);
        return formattedData;
    }

    async getHistory() {
        return this.storage.getHistory();
    }

    async getWeatherStats(latitude, longitude, days = 7) {
        const weatherData = await this.getWeather(latitude, longitude);
        return this.statisticsCalculator.getWeatherStats(latitude, longitude, days, weatherData);
    }
}

module.exports = { WeatherTracker };