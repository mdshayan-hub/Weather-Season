import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const apiKey = 'a8c19656c000f0a183d7a22d8f9a1675'; // Your API Key

  const fetchWeather = async (cityName = location) => {
    if (cityName.trim() === '') return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error('City not found! Please try again');
      const data = await response.json();
      setWeatherData(data);
      setError('');
      setShowSuggestions(false);
    } catch (error) {
      setWeatherData(null);
      setError(error.message);
    }
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setLocation(input);
    if (input.length > 2) {
      try {
        const response = await fetch(`https://api.teleport.org/api/cities/?search=${input}`);
        const data = await response.json();
        if (data._embedded && data._embedded['city:search-results']) {
          const cities = data._embedded['city:search-results'].map(
            (result) => result.matching_full_name
          );
          setSuggestions(cities);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchWeather(suggestion);
  };

  const getWeatherEmoji = (description) => {
    if (description.includes('rain')) return '🌧️';
    if (description.includes('clear')) return '☀️';
    if (description.includes('cloud')) return '☁️';
    if (description.includes('snow')) return '❄️';
    if (description.includes('storm') || description.includes('thunder')) return '🌩️';
    return '🌤️';
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #010113, #414040,#1d1c1c,#414040)',
        minHeight: '100vh',
        color: '#e0e0e0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className="container pt-5">
        <h1 className="text-center mb-4 text-light" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          🌦️ Weather App
        </h1>

        {/* Input Section */}
        <div
          className="d-flex mb-4 position-relative"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            gap: '10px',
          }}
        >
          <style>
            {`
              .weather-input::placeholder {
                color: #b3b3b3; 
                opacity: 0.9; 
              }
              .weather-input:focus {
                outline: none;
                border: 1px solid #0c0c0c;
              }
            `}
          </style>
          <input
            type="text"
            className="form-control shadow-sm rounded-pill weather-input"
            placeholder="Enter city name..."
            style={{
              color: 'white',
              backgroundColor: '#2b2b2b',
              padding: '10px 20px',
              fontSize: '1rem',
            }}
            value={location}
            onChange={handleInputChange}
          />
          <button
            className="btn btn-outline-light fw-bold rounded-pill shadow-sm px-lg-4 px-3"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => fetchWeather()}
          >
            Get Weather
          </button>
        </div>

        {/* City Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="list-group shadow rounded"
            style={{
              zIndex: 1000,
              top: '100%',
              width: '100%',
              maxWidth: '600px',
              margin: '10px auto',
              backgroundColor: '#1c2833',
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item text-white bg-transparent"
                style={{
                  cursor: 'pointer',
                  padding: '10px 20px',
                  borderBottom: '1px solid #5dade2',
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {/* Error Message */}
        {error && <p className="text-danger text-center fs-2 fw-bold mt-3">{error}</p>}

        {/* Weather Data */}
        {weatherData && (
          <div
            className="card shadow-lg p-5 mt-4 text-center border-light border-2"
            style={{
              backgroundColor: '#1f1f1f',
              maxWidth: '600px',
              margin: '0 auto',
              borderRadius: '15px',
              color: '#d1e0e0',
            }}
          >
            <h3 className="text-light">
              {weatherData.name}, {weatherData.sys.country}
            </h3>
            <p className="text-light" style={{ fontSize: '1.2rem' }}>
              🌡️ Temperature: {weatherData.main.temp} °C
            </p>
            <p className="text-light" style={{ fontSize: '1.2rem' }}>
              🌧️ Weather: {weatherData.weather[0].description}
            </p>
            <div className="mt-4" style={{ fontSize: '5rem' }}>
              {getWeatherEmoji(weatherData.weather[0].description.toLowerCase())}
            </div>
            <p className="text-light" style={{ fontSize: '1.2rem' }}>
              💧 Humidity: {weatherData.main.humidity}%
            </p>
            <p className="text-light" style={{ fontSize: '1.2rem' }}>
              💨 Wind Speed: {weatherData.wind.speed} m/s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
