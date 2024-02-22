import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import "./WeatherApp.css";
import search_icon from "../Assets/search.png";
import humidity_icon from "../Assets/humidity.png";
import wind_icon from "../Assets/wind.png";
import clear_icon from "../Assets/clear.png";
import sunrise_icon from "../Assets/sunrise.png";
import sunset_icon from "../Assets/sunset.png";
import rainy_icon from "../Assets/rainy.png";
import cloud_icon from "../Assets/cloud.png";
import snow_icon from "../Assets/snow.png";
import thunderstorm_icon from "../Assets/thunderstorm.png";
import drizzle_icon from "../Assets/drizzle.png";
import fog_icon from "../Assets/fog.png";
import haze_icon from "../Assets/haze.png";
import windy_icon from "../Assets/windy.png";
import partly_cloudy_icon from "../Assets/partly cloudy.png";
import overcast_icon from "../Assets/overcast.png";
import hail_icon from "../Assets/hail.png";
import tornado_icon from "../Assets/tornado.png";
import sandstorm_icon from "../Assets/sandstorm.png";
import smoke_icon from "../Assets/smoke.png";
import pressure_icon from "../Assets/pressure.png";
import humidityIcon from "../Assets/humidity.png";
import temperatureIcon from "../Assets/clear.png";
import windSpeedIcon from "../Assets/wind.png";
import moment from "moment";

const WeatherApp = () => {
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [pressure, setPressure] = useState("");
  const [country, setCountry] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(clear_icon);
  const [location, setLocation] = useState("Jimma");
  const [cloudDescription, setCloudDescription] = useState("");
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setLoading] = useState(true);

  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();
        console.log(currentData);

        setTemperature(`${currentData.main.temp}°C`);
        setHumidity(`${currentData.main.humidity}%`);
        setWindSpeed(`${currentData.wind.speed} km/h`);
        setPressure(`${currentData.main.pressure} hPa`);
        setSunrise(
          new Date(currentData.sys.sunrise * 1000).toLocaleTimeString()
        );
        setSunset(new Date(currentData.sys.sunset * 1000).toLocaleTimeString());
        setCloudDescription(currentData.weather[0]?.description || "");

        const countryResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&limit=1&appid=${api_key}`
        );
        const countryData = await countryResponse.json();
        const countryName = countryData[0]?.country || "";
        setCountry(countryName);

        let currentWeatherIcon = clear_icon;
        if (currentData?.weather[0]?.main === "Clear") {
          currentWeatherIcon = clear_icon;
        } else if (currentData.weather[0].main === "Rain") {
          currentWeatherIcon = rainy_icon;
        } else if (currentData.weather[0].main === "Clouds") {
          currentWeatherIcon = cloud_icon;
        } else if (currentData.weather[0].main === "Snow") {
          currentWeatherIcon = snow_icon;
        } else if (currentData.weather[0].main === "Thunderstorm") {
          currentWeatherIcon = thunderstorm_icon;
        } else if (currentData.weather[0].main === "Drizzle") {
          currentWeatherIcon = drizzle_icon;
        } else if (
          currentData.weather[0].main === "Fog" ||
          currentData.weather[0].main === "Mist"
        ) {
          currentWeatherIcon = fog_icon;
        } else if (currentData.weather[0].main === "Haze") {
          currentWeatherIcon = haze_icon;
        } else if (currentData.weather[0].main === "Windy") {
          currentWeatherIcon = windy_icon;
        } else if (currentData.weather[0].main === "Partly Cloudy") {
          currentWeatherIcon = partly_cloudy_icon;
        } else if (currentData.weather[0].main === "Overcast") {
          currentWeatherIcon = overcast_icon;
        } else if (currentData.weather[0].main === "Hail") {
          currentWeatherIcon = hail_icon;
        } else if (currentData.weather[0].main === "Tornado") {
          currentWeatherIcon = tornado_icon;
        } else if (currentData.weather[0].main === "Sandstorm") {
          currentWeatherIcon = sandstorm_icon;
        } else if (currentData.weather[0].main === "Smoke") {
          currentWeatherIcon = smoke_icon;
        }

        setWeatherIcon(currentWeatherIcon);
      } catch (error) {
        console.log(error);
        setTemperature("N/A");
        setHumidity("N/A");
        setWindSpeed("N/A");
        setPressure("N/A");
        setSunrise("N/A");
        setSunset("N/A");
        setCloudDescription("N/A");
        setCountry("N/A");
      }

      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=Metric&appid=${api_key}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        console.log(forecastData);

        const dailyForecasts = forecastData.list.filter(
          (forecast) => new Date(forecast.dt_txt).getHours() === 12
        );

        const getWeatherIcon = (condition) => {
          switch (condition) {
            case "temperature":
              // Return the icon for temperature
              return temperatureIcon;
            case "windSpeed":
              // Return the icon for wind speed
              return windSpeedIcon;
            case "humidity":
              // Return the icon for humidity
              return humidityIcon;
            default:
              return "";
          }
        };

        const formattedForecasts = dailyForecasts.map((forecast) => {
          const date = new Date(forecast.dt_txt);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const temperature = `${forecast.main.temp}°C`;
          const windSpeed = `${forecast.wind.speed} m/s`;
          const humidity = `${forecast.main.humidity}%`;
          const temperatureIcon = getWeatherIcon("temperature");
          const windSpeedIcon = getWeatherIcon("windSpeed");
          const humidityIcon = getWeatherIcon("humidity");

          return {
            dayName,
            date: date.toLocaleDateString(),
            temperature,
            windSpeed,
            humidity,
            temperatureIcon,
            windSpeedIcon,
            humidityIcon,
          };
        });
        setWeeklyForecast(formattedForecasts);
      } catch (error) {
        console.log(error);
        setWeeklyForecast([]);
      }

      setLoading(false);
    };

    fetchWeatherData();
  }, [location]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  console.log(
    new Date(weeklyForecast[0]?.date),
    moment(new Date(weeklyForecast[0]?.date))?.format("MMM Do YY")
  );

  return (
    <>
      <div className="WeatherApp">
        <div className="container">
          <div className="search-container">
            <TextField
              type="text"
              value={location}
              onChange={handleLocationChange}
              variant="standard"
            />
            <img src={search_icon} alt="Search" className="search-icon" />
          </div>
          {isLoading ? (
            <div className="loading">
              <LinearProgress />
            </div>
          ) : (
            <>
              <div className="current-weather">
                <div className="weather-icon">
                  <img src={weatherIcon} alt="Weather" />
                </div>
                <div className="temperature">{temperature}</div>
                <div className="location">
                  {location}, {country}
                </div>
                <div className="description">{cloudDescription}</div>
              </div>
              <div className="details">
                <div className="detail">
                  <div className="icon">
                    <img src={humidity_icon} alt="Humidity" />
                  </div>
                  <div className="label">Humidity</div>
                  <div className="value">{humidity}</div>
                </div>
                <div className="detail">
                  <div className="icon">
                    <img src={wind_icon} alt="Wind Speed" />
                  </div>
                  <div className="label">Wind Speed</div>
                  <div className="value">{windSpeed}</div>
                </div>
                <div className="detail">
                  <div className="icon">
                    <img src={sunrise_icon} alt="Sunrise" />
                  </div>
                  <div className="label">Sunrise</div>
                  <div className="value">{sunrise}</div>
                </div>
                <div className="detail">
                  <div className="icon">
                    <img src={sunset_icon} alt="Sunset" />
                  </div>
                  <div className="label">Sunset</div>
                  <div className="value">{sunset}</div>
                </div>
                <div className="detail">
                  <div className="icon">
                    <img src={pressure_icon} alt="Pressure" />
                  </div>
                  <div className="label">Pressure</div>
                  <div className="value">{pressure}</div>
                </div>
              </div>
              <div className="weekly-forecast">
                {weeklyForecast.map((forecast, index) => (
                  <div className="forecast-card" key={index}>
                    <div className="day-name">{forecast.dayName}</div>
                    <div className="date">
                      {moment(new Date(forecast.date)).format("MMM Do YY")}
                    </div>
                    <div className="card-container">
                      <div className="forecast-icon">
                        <img src={forecast.temperatureIcon} alt="Temperature" />
                      </div>
                      <div className="forecast-temperature">
                        Temp:{forecast.temperature}
                      </div>
                    </div>

                    <div className="card-container">
                      <div className="forecast-icon">
                        <img src={forecast.windSpeedIcon} alt="Wind Speed" />
                      </div>
                      <div className="forecast-wind">
                        Wind: {forecast.windSpeed}
                      </div>
                    </div>

                    <div className="card-container">
                      <div className="forecast-icon">
                        <img src={forecast.humidityIcon} alt="Humidity" />
                      </div>
                      <div className="forecast-humidity">
                        Humidity: {forecast.humidity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
