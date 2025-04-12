# WeatherNow API Specification

## Overview

This document provides technical specifications for the WeatherNow API. The API is designed to be RESTful and returns data in JSON format. This is not the public documentation but rather the internal specification document.

## Base URL

```
https://api.weathernow.com/v1
```

## Authentication

All API requests require authentication using an API key. Include your API key in the request header:

```
X-API-Key: your_api_key_here
```

## Rate Limiting

Rate limits vary based on subscription tier:
- Free: 1000 requests/day, max 5 requests/minute
- Basic: 10,000 requests/day, max 10 requests/second
- Premium: 100,000 requests/day, max 50 requests/second
- Enterprise: Custom limits

## Endpoints

### Current Weather

#### GET /weather/current/city/{cityName}

Retrieve current weather data for a city.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cityName | string | Yes | Name of the city |
| units | string | No | Units of measurement: 'metric' (default), 'imperial', or 'standard' |
| lang | string | No | Language code (e.g., 'en', 'es', 'fr') |

**Response:**
Status code: 200 OK

```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London",
      "country": "GB",
      "coordinates": {
        "lat": 51.5074,
        "lon": -0.1278
      },
      "timezone": "Europe/London"
    },
    "current": {
      "timestamp": "2023-05-01T12:00:00Z",
      "temperature": 15.5,
      "feels_like": 14.8,
      "humidity": 76,
      "pressure": 1012,
      "wind_speed": 3.6,
      "wind_direction": 270,
      "weather_condition": {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      }
    }
  }
}
```

#### GET /weather/current/coordinates

Retrieve current weather data for geographical coordinates.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| lat | number | Yes | Latitude coordinate |
| lon | number | Yes | Longitude coordinate |
| units | string | No | Units of measurement: 'metric' (default), 'imperial', or 'standard' |
| lang | string | No | Language code (e.g., 'en', 'es', 'fr') |

**Response:**
Similar to city endpoint.

#### GET /weather/current/zipcode/{zipCode}

Retrieve current weather data for a zip code.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| zipCode | string | Yes | Zip/postal code |
| countryCode | string | No | Two-letter country code (ISO 3166). Default: 'us' |
| units | string | No | Units of measurement: 'metric' (default), 'imperial', or 'standard' |
| lang | string | No | Language code (e.g., 'en', 'es', 'fr') |

**Response:**
Similar to city endpoint.

### Forecast

#### GET /weather/forecast/daily/{cityName}

Retrieve daily weather forecast for a city.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cityName | string | Yes | Name of the city |
| days | number | No | Number of days to forecast (1-16). Default: 7 |
| units | string | No | Units of measurement: 'metric' (default), 'imperial', or 'standard' |
| lang | string | No | Language code (e.g., 'en', 'es', 'fr') |

**Response:**
Status code: 200 OK

```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London",
      "country": "GB",
      "coordinates": {
        "lat": 51.5074,
        "lon": -0.1278
      },
      "timezone": "Europe/London"
    },
    "forecast": [
      {
        "date": "2023-05-01",
        "sunrise": "05:32:00",
        "sunset": "20:21:00",
        "temperature": {
          "min": 12.5,
          "max": 17.8,
          "morning": 13.2,
          "day": 16.5,
          "evening": 15.3,
          "night": 12.7
        },
        "feels_like": {
          "morning": 12.8,
          "day": 15.9,
          "evening": 14.8,
          "night": 12.2
        },
        "humidity": 76,
        "wind_speed": 3.6,
        "weather_condition": {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        },
        "precipitation_probability": 0
      },
      // More days...
    ]
  }
}
```

#### GET /weather/forecast/hourly/{cityName}

Retrieve hourly weather forecast for a city.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cityName | string | Yes | Name of the city |
| hours | number | No | Number of hours to forecast (1-120). Default: 24 |
| units | string | No | Units of measurement: 'metric' (default), 'imperial', or 'standard' |
| lang | string | No | Language code (e.g., 'en', 'es', 'fr') |

**Response:**
Structure similar to daily forecast but with hourly data points.

### Additional endpoint details are available in the full API specification...

## Error Handling

All endpoints return consistent error formats:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `INVALID_API_KEY` - The provided API key is invalid or missing
- `RATE_LIMIT_EXCEEDED` - You've exceeded your rate limit
- `LOCATION_NOT_FOUND` - The specified location could not be found
- `INVALID_PARAMETER` - One or more parameters are invalid
- `SERVER_ERROR` - Internal server error