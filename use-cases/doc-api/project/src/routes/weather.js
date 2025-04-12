/**
 * Weather API routes
 */

const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { authenticate, rateLimit } = require('../middleware/auth');

// Current weather endpoints
router.get('/current/city/:cityName', authenticate, rateLimit, weatherController.getCurrentWeatherByCity);
router.get('/current/coordinates', authenticate, rateLimit, weatherController.getCurrentWeatherByCoordinates);
router.get('/current/zipcode/:zipCode', authenticate, rateLimit, weatherController.getCurrentWeatherByZipCode);

// Forecast endpoints
router.get('/forecast/daily/:cityName', authenticate, rateLimit, weatherController.getDailyForecast);
router.get('/forecast/hourly/:cityName', authenticate, rateLimit, weatherController.getHourlyForecast);

// Historical weather data
router.get('/historical/:cityName', authenticate, rateLimit, weatherController.getHistoricalWeather);

// Weather alerts
router.get('/alerts/active/:location', authenticate, rateLimit, weatherController.getActiveAlerts);
router.post('/alerts/subscribe', authenticate, weatherController.subscribeToAlerts);
router.delete('/alerts/unsubscribe', authenticate, weatherController.unsubscribeFromAlerts);

// Air quality
router.get('/airquality/:cityName', authenticate, rateLimit, weatherController.getAirQuality);

module.exports = router;