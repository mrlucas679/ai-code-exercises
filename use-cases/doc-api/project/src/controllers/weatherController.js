/**
 * Weather controller handling weather-related API endpoints
 */

const Weather = require('../models/Weather');
const Alert = require('../models/Alert');
const AirQuality = require('../models/AirQuality');
const { fetchFromWeatherProvider, parseProviderData } = require('../services/weatherService');
const logger = require('../utils/logger');

/**
 * Get current weather by city name
 */
exports.getCurrentWeatherByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const { units = 'metric', lang = 'en' } = req.query;
    
    const weather = await fetchFromWeatherProvider(`current/city/${encodeURIComponent(cityName)}`, { units, lang });
    const parsedData = parseProviderData(weather, 'current');
    
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    logger.error(`Error getting current weather for city: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get current weather by coordinates
 */
exports.getCurrentWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const { units = 'metric', lang = 'en' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const weather = await fetchFromWeatherProvider(`current/coordinates`, { lat, lon, units, lang });
    const parsedData = parseProviderData(weather, 'current');
    
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    logger.error(`Error getting current weather by coordinates: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get current weather by zip code
 */
exports.getCurrentWeatherByZipCode = async (req, res) => {
  try {
    const { zipCode } = req.params;
    const { countryCode = 'us', units = 'metric', lang = 'en' } = req.query;
    
    const weather = await fetchFromWeatherProvider(`current/zipcode/${zipCode}`, { countryCode, units, lang });
    const parsedData = parseProviderData(weather, 'current');
    
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    logger.error(`Error getting current weather by zip code: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get daily weather forecast
 */
exports.getDailyForecast = async (req, res) => {
  try {
    const { cityName } = req.params;
    const { days = 7, units = 'metric', lang = 'en' } = req.query;
    
    if (days < 1 || days > 16) {
      return res.status(400).json({
        success: false,
        error: 'Days parameter must be between 1 and 16'
      });
    }
    
    const forecast = await fetchFromWeatherProvider(`forecast/daily/${encodeURIComponent(cityName)}`, { days, units, lang });
    const parsedData = parseProviderData(forecast, 'forecast');
    
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    logger.error(`Error getting daily forecast: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get hourly weather forecast
 */
exports.getHourlyForecast = async (req, res) => {
  try {
    const { cityName } = req.params;
    const { hours = 24, units = 'metric', lang = 'en' } = req.query;
    
    if (hours < 1 || hours > 120) {
      return res.status(400).json({
        success: false,
        error: 'Hours parameter must be between 1 and 120'
      });
    }
    
    const forecast = await fetchFromWeatherProvider(`forecast/hourly/${encodeURIComponent(cityName)}`, { hours, units, lang });
    const parsedData = parseProviderData(forecast, 'hourly');
    
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    logger.error(`Error getting hourly forecast: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

// Additional controller methods for historical data, alerts, and air quality would be implemented here...