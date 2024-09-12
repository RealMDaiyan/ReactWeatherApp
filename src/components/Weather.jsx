import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Component Styles/WeatherStyles.css';
import Footer from './footer';
import Forecast from './forecast';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [units, setUnits] = useState('metric');
  const [isVisible, setIsVisible] = useState(false);

  const dynamicStyler = (weatherCondition) => {
    switch(weatherCondition) {
      case 'Clear':
        return 'clear';
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
        return 'rainy';
      default:
        return ''; // Default class if none matches
    }
  };

  useEffect(() => {
    const getLocationWeather = async () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCurrentLocation(latitude, longitude);
          fetchUpcomingForecast(latitude, longitude);
        },
        (error) => {
          setError('Location not available or denied.');
          setLoading(false);
        }
      );
    };
    getLocationWeather(); 
  }, [units]);


  // Asks for location and display the weather

  const fetchWeatherDataByCurrentLocation = async (lat, lon) => {
    setLoading(true);
    setIsVisible(false);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
        setIsVisible(true);
      } else {
        setError('Failed to fetch the weather API.');
      }
    } catch (error) {
      setError('Failed to fetch the weather API.');
    } finally {
      setLoading(false);
    }
  };

  // Fetches according to city name

  const fetchWeatherDataByCity = async (cityName) => {
    setLoading(true);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
    try {
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      if (weatherResponse.ok) {
        setWeather(weatherData);
      } else {
        setError("City not found");
        setLoading(false);
        return;
      }

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
      if (forecastResponse.ok) {
        setForecast(forecastData.list);
      } else {
        setError("Failed to fetch forecast data");
        setLoading(false);
        return;
      }

      setIsVisible(true);
    } catch (error) {
      setError('Failed to fetch the weather API.');
    } finally {
      setLoading(false);
    }
  };

  // Fetches forecast data like a normal weather app.

  const fetchUpcomingForecast = async (lat, lon) => {
    setLoading(true);
    setIsVisible(false);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setForecast(data.list);
        setIsVisible(true);
      } else {
        setError("Failed to fetch forecast data");
      }
    } catch (error) {
      setError("Failed to fetch forecast data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='d-flex justify-content-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='alert alert-danger' role='alert'>{error}</div>;
  }

  return (
    <div className={`container weather-container ${weather && weather.weather ? dynamicStyler(weather.weather[0].main) : ''}`}>
      <div className="row justify-content-center">
        <div className={`col-md-6 text-center fade-in ${isVisible ? 'visible' : ''}`}>
          {weather && weather.weather && (
            <div className="capitalize card my-4">
              <div className="card-body">
                <h1 className="card-title">Weather in {weather.name}</h1>
                <p className="card-text">Temperature: {weather.main.temp}{units === "metric" ? "°C" : "°F"}</p>
                <p className="card-text">Min: {Math.round(weather.main.temp_min)}{units === "metric" ? "°C" : "°F"}</p>
                <p className='card-text'>Max: {Math.round(weather.main.temp_max)}{units === "metric" ? "°C" : "°F"}</p>
                <p className='card-text'>Humidity: {Math.round(weather.main.humidity)}%</p>
                <p className='card-text'>Wind: {Math.round(weather.wind.speed)}m/s</p>
                <p className="card-text">Condition: {weather.weather[0].description}
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
                </p>
              </div>
            </div>
          )}
          <button className='btn btn-secondary' onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>
      </div>

      {/* Forecast Component */}
      <Forecast forecastData={forecast} units={units} isVisible={isVisible}/>
      {/* Footer Component for City Search */}
      <Footer onSearch={fetchWeatherDataByCity} />
    </div>
  );
};

export default Weather;
