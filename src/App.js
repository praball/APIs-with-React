import { useEffect, useState } from "react";
import "./App.css";
import MusicPlayer from "./MusicPlayer";

function Weather({ darkMode }) {
  const [location, setLocation] = useState("indore");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=LNWTW528ZSWLL8BCR45FTK6F8&contentType=json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWeatherData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  function HandleLocationChange(e) {
    setLocation(e.target.value.toLowerCase());
  }

  return (
    <>
      <div className={`weather ${darkMode ? 'dark-mode' : ''}`}>
        <input
          type="text"
          placeholder="Enter Location..."
          value={location}
          onChange={HandleLocationChange}
          className="inputField"
        />
        <h1 className="weatherHeading">
          {location.charAt(0).toUpperCase() + location.slice(1)}'s Weather
        </h1>
        (Using Visualcrossing API)
        <table className="weatherTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature (°C)</th>
              <th>Conditions</th>
              <th>Humidity</th>
              <th>Windgust</th>
            </tr>
          </thead>
          <tbody>
            {weatherData?.days.map((day) => (
              <tr key={day.datetime}>
                <td>{day.datetime}</td>
                <td>{day.temp}</td>
                <td>{day.conditions}</td>
                <td>{day.humidity}</td>
                <td>{day.windgust}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  function HandleClick() {
    setCount((prevCount) => prevCount + 10);
  }

  return (
    <>
      <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light" : "Dark"}
        </button>
        <h2>Count: {count}</h2>
        <button className="button" onClick={HandleClick}>
          Button
        </button>
      </div>
      <Weather darkMode={darkMode}/>
      <MusicPlayer />
    </>
  );
}
