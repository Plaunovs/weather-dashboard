import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import CityPage from "./CityPage";
import { weatherApi } from "./services/weatherApi";
import "./App.css";
import { cityList } from "./cities";

type CityWeather = {
  id: number;
  name: string;
  temp: number;
};

type City = {
  id: number;
  name: string;
  country: string;
};

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [data, setData] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  const [selectedCity, setSelectedCity] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    fetch("http://localhost:3001/cities")
      .then((res) => res.json())
      .then((dbCities) => setCities(dbCities));
  }, []);


  useEffect(() => {
    if (cities.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all(
      cities.map(async (city) => {
        try {
          const res = await weatherApi.get("/weather", {
            params: { q: city.name, units },
          });

          return {
            id: city.id,
            name: res.data.name,
            temp: res.data.main.temp,
          };
        } catch {
          return null;
        }
      })
    )
      .then((results) => {
        const filtered = results.filter(
          (r): r is CityWeather => r !== null
        );
        setData(filtered);
      })
      .finally(() => setLoading(false));
  }, [cities, units]);

  const addCity = (cityName: string) => {
    setError("");

    if (!cityName) return;

    const cleaned = cityName.replace(/[^a-zA-Z\s]/g, "").trim();

    if (cleaned.length < 2) {
      setError("Invalid city name");
      return;
    }

    const normalized = cleaned.toLowerCase();

    if (
      cities.some(
        (c) => c.name.toLowerCase().trim() === normalized
      )
    ) {
      setError("City already added");
      return;
    }

    weatherApi
      .get("/weather", {
        params: { q: cleaned, units },
      })
      .then(() => {
        fetch("http://localhost:3001/cities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: cleaned, country: "XX" }),
        })
          .then((res) => res.json())
          .then((city) => {
            setCities((prev) => [...prev, city]);
          });
      })
      .catch(() => {
        setError("City not found in weather API");
      });
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container">
            <div className="header">
              <h1>Weather Dashboard</h1>

              <button
                onClick={() =>
                  setUnits((u) =>
                    u === "metric" ? "imperial" : "metric"
                  )
                }
              >
                Switch to {units === "metric" ? "°F" : "°C"}
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>Add city</h3>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select from list...</option>
                {cityList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  addCity(selectedCity);
                  setSelectedCity("");
                }}
              >
                Add from list
              </button>

              <div style={{ marginTop: 10 }}>
                <input
                  placeholder="Or type manually..."
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                />

                <button
                  onClick={() => {
                    addCity(manualCity);
                    setManualCity("");
                  }}
                >
                  Add manual
                </button>
              </div>

              {error && (
                <p style={{ color: "red", marginTop: 10 }}>
                  {error}
                </p>
              )}
            </div>

            <div className="grid">
              {data.map((weather) => (
                <div key={weather.id} className="card">
                  <Link to={`/city/${weather.name}`}>
                    <div className="city">{weather.name}</div>
                    <div className="temp">
                      {weather.temp} °
                      {units === "metric" ? "C" : "F"}
                    </div>
                  </Link>

                  <button
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      fetch(
                        `http://localhost:3001/cities/${weather.id}`,
                        { method: "DELETE" }
                      ).then(() => {
                        setCities((prev) =>
                          prev.filter(
                            (c) => c.id !== weather.id
                          )
                        );
                      });
                    }}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Route
        path="/city/:name"
        element={<CityPage units={units} />}
      />
    </Routes>
  );
}

export default App;
