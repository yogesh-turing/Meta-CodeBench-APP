const { WeatherTracker } = require("./solution"); // Replace functionNames with the correct function(s)

const axios = require("axios");
const fs = require("fs").promises;

jest.mock("axios");
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe("WeatherTracker", () => {
  let weatherTracker;

  beforeEach(() => {
    weatherTracker = new WeatherTracker();
    jest.clearAllMocks();
  });

  describe("searchLocation", () => {
    it("should return locations when search is successful", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              name: "London",
              country: "UK",
              latitude: 51.5074,
              longitude: -0.1278,
              timezone: "Europe/London",
            },
          ],
        },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await weatherTracker.searchLocation("London");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("London");
    });

    it("should return empty array when no results found", async () => {
      axios.get.mockResolvedValue({ data: {} });
      const result = await weatherTracker.searchLocation("NonexistentCity");
      expect(result).toEqual([]);
    });

    it("should throw error when API call fails", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));
      await expect(weatherTracker.searchLocation("London")).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getWeather", () => {
    const mockWeatherResponse = {
      data: {
        current: {
          temperature_2m: 20,
          relative_humidity_2m: 65,
          wind_speed_10m: 10,
          precipitation: 0,
          cloud_cover: 50,
        },
        daily: {
          time: ["2024-01-01", "2024-01-02"],
          temperature_2m_max: [25, 26],
          temperature_2m_min: [15, 16],
          precipitation_sum: [5, 6],
        },
      },
    };

    it("should return formatted weather data", async () => {
      axios.get.mockResolvedValue(mockWeatherResponse);
      fs.writeFile.mockResolvedValue();

      const result = await weatherTracker.getWeather(51.5074, -0.1278);

      expect(result.current.temperature).toBe("20�C");
      expect(result.current.humidity).toBe("65%");
      expect(result.forecast).toHaveLength(2);
    });

    it("should handle missing current weather data", async () => {
      const incompleteResponse = {
        data: {
          current: {
            temperature_2m: null,
            relative_humidity_2m: undefined,
            wind_speed_10m: 10,
          },
          daily: mockWeatherResponse.data.daily,
        },
      };
      axios.get.mockResolvedValue(incompleteResponse);
      fs.writeFile.mockResolvedValue();

      const result = await weatherTracker.getWeather(51.5074, -0.1278);

      expect(result.current.temperature).toBe("null�C");
      expect(result.current.humidity).toBe("undefined%");
    });

    it("should handle missing daily forecast data", async () => {
      const incompleteResponse = {
        data: {
          current: mockWeatherResponse.data.current,
          daily: {
            time: [],
            temperature_2m_max: [],
            temperature_2m_min: [],
            precipitation_sum: [],
          },
        },
      };
      axios.get.mockResolvedValue(incompleteResponse);
      fs.writeFile.mockResolvedValue();

      const result = await weatherTracker.getWeather(51.5074, -0.1278);

      expect(result.forecast).toHaveLength(0);
    });

    it("should handle invalid coordinates", async () => {
      axios.get.mockRejectedValue(new Error("Invalid coordinates"));

      await expect(weatherTracker.getWeather(1000, 1000)).rejects.toThrow(
        "Invalid coordinates"
      );
    });

    it("should throw error when API call fails", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));
      await expect(weatherTracker.getWeather(51.5074, -0.1278)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("generateWeatherAlerts", () => {
    it("should generate alert for high temperature", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: 35,
        wind_speed_10m: 20,
        precipitation: 5,
      });
      expect(alerts).toHaveLength(1);
    });

    it("should generate multiple alerts for extreme conditions", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: -5,
        wind_speed_10m: 55,
        precipitation: 15,
      });
      expect(alerts).toHaveLength(3);
    });

    it("should return empty array when no alerts needed", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: 20,
        wind_speed_10m: 10,
        precipitation: 0,
      });
      expect(alerts).toHaveLength(0);
    });

    it("should generate alert for freezing temperature", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: -2,
        wind_speed_10m: 10,
        precipitation: 0,
      });
      expect(alerts).toHaveLength(1);
    });

    it("should generate alert for strong wind", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: 20,
        wind_speed_10m: 51,
        precipitation: 0,
      });
      expect(alerts).toHaveLength(1);
    });

    it("should generate alert for heavy precipitation", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: 20,
        wind_speed_10m: 10,
        precipitation: 11,
      });
      expect(alerts).toHaveLength(1);
    });

    it("should handle missing weather parameters", () => {
      const alerts = weatherTracker.generateWeatherAlerts({
        temperature_2m: undefined,
        wind_speed_10m: null,
        precipitation: undefined,
      });
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts).toHaveLength(0);
    });
  });

  describe("saveToHistory", () => {
    it("should create new history file if none exists", async () => {
      fs.readFile.mockRejectedValue(new Error("File not found"));
      fs.writeFile.mockResolvedValue();

      const weatherData = { timestamp: "2024-01-01" };
      await weatherTracker.saveToHistory(weatherData);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining("2024-01-01")
      );
    });

    it("should limit history to 10 entries", async () => {
      const oldHistory = Array(11).fill({ timestamp: "2024-01-01" });
      fs.readFile.mockResolvedValue(JSON.stringify(oldHistory));
      fs.writeFile.mockResolvedValue();

      await weatherTracker.saveToHistory({ timestamp: "2024-01-02" });

      const writeFileCall = fs.writeFile.mock.calls[0][1];
      const savedHistory = JSON.parse(writeFileCall);
      expect(savedHistory).toHaveLength(10);
    });

    it("should handle file write errors", async () => {
      fs.readFile.mockResolvedValue("[]");
      fs.writeFile.mockRejectedValue(new Error("Write error"));

      const weatherData = { timestamp: "2024-01-01" };
      await expect(
        weatherTracker.saveToHistory(weatherData)
      ).resolves.not.toThrow();
    });

    it("should handle invalid JSON in history file", async () => {
      fs.readFile.mockResolvedValue("invalid json");
      fs.writeFile.mockResolvedValue();

      const weatherData = { timestamp: "2024-01-01" };
      await weatherTracker.saveToHistory(weatherData);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining("2024-01-01")
      );
    });

    it("should append to existing history", async () => {
      const existingHistory = [{ timestamp: "2024-01-01" }];
      fs.readFile.mockResolvedValue(JSON.stringify(existingHistory));
      fs.writeFile.mockResolvedValue();

      const newData = { timestamp: "2024-01-02" };
      await weatherTracker.saveToHistory(newData);

      const writeFileCall = fs.writeFile.mock.calls[0][1];
      const savedHistory = JSON.parse(writeFileCall);
      expect(savedHistory).toHaveLength(2);
      expect(savedHistory[1]).toEqual(newData);
    });
  });

  describe("getHistory", () => {
    it("should return empty array when history file is empty", async () => {
      fs.readFile.mockResolvedValue("");

      const history = await weatherTracker.getHistory();
      expect(history).toEqual([]);
    });

    it("should handle corrupted history file", async () => {
      fs.readFile.mockResolvedValue("corrupted{data");

      const history = await weatherTracker.getHistory();
      expect(history).toEqual([]);
    });

    it("should successfully read history file", async () => {
      const mockHistory = [
        { timestamp: "2024-01-01", data: "test1" },
        { timestamp: "2024-01-02", data: "test2" },
      ];
      fs.readFile.mockResolvedValue(JSON.stringify(mockHistory));

      const history = await weatherTracker.getHistory();
      expect(history).toEqual(mockHistory);
    });
  });

  describe("getWeatherStats", () => {
    it("should calculate correct statistics", async () => {
      const mockWeather = {
        forecast: [
          { maxTemp: "20�C", minTemp: "10�C", precipitation: "5 mm" },
          { maxTemp: "22�C", minTemp: "12�C", precipitation: "3 mm" },
        ],
      };

      jest.spyOn(weatherTracker, "getWeather").mockResolvedValue(mockWeather);

      const stats = await weatherTracker.getWeatherStats(51.5074, -0.1278, 2);

      expect(stats.averageTemp).toBe("16.0�C");
      expect(stats.maxTemp).toBe("22�C");
      expect(stats.minTemp).toBe("10�C");
      expect(stats.totalPrecipitation).toBe("8.0 mm");
    });

    it("should handle empty forecast data", async () => {
      jest
        .spyOn(weatherTracker, "getWeather")
        .mockResolvedValue({ forecast: [] });

      const stats = await weatherTracker.getWeatherStats(51.5074, -0.1278);

      expect(stats.averageTemp).toBe("NaN�C");
      expect(stats.totalPrecipitation).toBe("0.0 mm");
    });

    it("should handle negative temperatures", async () => {
      const mockWeather = {
        forecast: [
          { maxTemp: "-5�C", minTemp: "-10�C", precipitation: "0 mm" },
          { maxTemp: "-3�C", minTemp: "-8�C", precipitation: "2 mm" },
        ],
      };

      jest.spyOn(weatherTracker, "getWeather").mockResolvedValue(mockWeather);

      const stats = await weatherTracker.getWeatherStats(51.5074, -0.1278, 2);

      expect(stats.averageTemp).toBe("-6.5�C");
      expect(stats.maxTemp).toBe("-3�C");
      expect(stats.minTemp).toBe("-10�C");
    });

    it("should handle invalid temperature format", async () => {
      const mockWeather = {
        forecast: [
          { maxTemp: "invalid", minTemp: "10�C", precipitation: "5 mm" },
          { maxTemp: "22�C", minTemp: "invalid", precipitation: "3 mm" },
        ],
      };

      jest.spyOn(weatherTracker, "getWeather").mockResolvedValue(mockWeather);

      const stats = await weatherTracker.getWeatherStats(51.5074, -0.1278, 2);

      expect(stats.averageTemp).toBe("NaN�C");
    });

    it("should respect the days parameter", async () => {
      const mockWeather = {
        forecast: Array(10).fill({
          maxTemp: "20�C",
          minTemp: "10�C",
          precipitation: "1 mm",
        }),
      };

      jest.spyOn(weatherTracker, "getWeather").mockResolvedValue(mockWeather);

      const stats = await weatherTracker.getWeatherStats(51.5074, -0.1278, 3);

      expect(stats.totalPrecipitation).toBe("3.0 mm");
    });
  });
});
