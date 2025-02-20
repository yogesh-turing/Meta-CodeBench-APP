const axios = require('axios');
const fs = require('fs').promises;

class WeatherTracker {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.historyFile = 'weather_history.json';
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

            const weatherData = this.formatWeatherData(response.data);
            await this.saveToHistory(weatherData);
            return weatherData;
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }

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
            alerts: this.generateWeatherAlerts(current)
        };
    }

    generateWeatherAlerts(current) {
        const alerts = [];
        
        if (current.temperature_2m > 30) alerts.push('High temperature alert!');
        if (current.temperature_2m < 0) alerts.push('Freezing temperature alert!');
        if (current.wind_speed_10m > 50) alerts.push('Strong wind alert!');
        if (current.precipitation > 10) alerts.push('Heavy precipitation alert!');
        
        return alerts;
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

    async getWeatherStats(latitude, longitude, days = 7) {
        const weather = await this.getWeather(latitude, longitude);
        const forecast = weather.forecast.slice(0, days);

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

module.exports = { WeatherTracker };