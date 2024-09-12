
import React from 'react';
import "./Component Styles/WeatherStyles.css"

const Forecast = ({ forecastData, units, isVisible }) => {
  const getDailyForecast = () => {
    if (!Array.isArray(forecastData) || forecastData.length === 0) {
      return [];
    }

    const dailyForecasts = {};

    forecastData.forEach(forecastTime => {
      const forecastDate = new Date(forecastTime.dt * 1000);
      // Groups by day
      const day = forecastDate.toLocaleDateString();

      // Store the first forecast for each day
      if (!dailyForecasts[day]) {
        dailyForecasts[day] = forecastTime;
      }
    });
    // Return as an array
    return Object.values(dailyForecasts); 
  };

  return (
    <div className='container mt-4'>
      <h2 className='text-center mb-4'>Upcoming Forecast</h2>
      <div className="row">
        {getDailyForecast().map((day, index) => (
          <div key={index} className={`col-md-2 col-sm-4 mb-4 fade-in ${isVisible ? 'visible' : ''}`}>
            <div className='card text-center shadow-sm'>
              <div className='card-body '>
                <h5 className='card-title'>{new Date(day.dt * 1000).toLocaleDateString()}</h5>
                <p className="card-text"><strong>{Math.round(day.main.temp)}{units === "metric" ? "°C": "°F"}</strong></p>
                <p className="card-text">Min: {Math.round(day.main.temp_min)}{units === "metric" ? "°C": "°F"}</p>
                <p className='card-text'>Max: {Math.round(day.main.temp_max)}{units === "metric" ? "°C": "°F"}</p>
                <p className='card-text'>Humidity: {Math.round(day.main.humidity)}%</p>
                <p className='card-text'>Wind: {Math.round(day.wind.speed)}m/s</p>
                
                <p className="card-text text-capitalize">
                  {day.weather[0].description}
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description}/>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
