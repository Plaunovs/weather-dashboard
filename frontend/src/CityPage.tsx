import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { weatherApi } from "./services/weatherApi";
import { Link } from "react-router-dom";


type Props = {
  units: "metric" | "imperial";
};

function CityPage({ units }: Props) {
  const { name } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    setLoading(true);

    weatherApi
      .get("/weather", { params: { q: name, units } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [name, units]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
  <div className="details">
    <Link to="/" className="back">← Back</Link>

    <h2>{data.name}</h2>

    <div className="big-temp">
      {data.main.temp} °{units === "metric" ? "C" : "F"}
    </div>

    <p>
      Wind: {data.wind.speed} {units === "metric" ? "m/s" : "mph"}
    </p>
    <p>Humidity: {data.main.humidity} %</p>
    <p>Clouds: {data.clouds.all} %</p>
  </div>
);
}

export default CityPage;
