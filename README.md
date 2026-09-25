# Laikapstākļu aplikācija

Full-stack laikapstākļu lietotne, izstrādāta ar React, TypeScript, Node.js/Express, PostgreSQL un Docker.

## Funkcionalitāte

- Laikapstākļi vairākām pilsētām vienlaikus
- Detalizēts laikapstākļu skats katrai pilsētai
- Pārslēgšanās starp °C un °F
- Pilsētu pievienošana un dzēšana
- Pilsētu saraksts tiek glabāts PostgreSQL datubāzē (pirmajā palaišanā tiek pievienotas Rīga, Londona un Parīze)
- Visa aplikācija palaižama ar vienu Docker Compose komandu

## Izmantotās tehnoloģijas

**Frontend:** React, TypeScript, React Router, Vite, Axios
**Backend:** Node.js, Express, PostgreSQL (`pg`)
**Cits:** OpenWeather API, Docker Compose

## Priekšnosacījumi

Nepieciešama bezmaksas OpenWeather API atslēga: [openweathermap.org/api](https://openweathermap.org/api)

Mapē `frontend/` izveido failu `.env`:

```
VITE_WEATHER_API_KEY=tava_api_atslēga
```

## Palaišana ar Docker

```bash
docker compose up --build
```

Pēc palaišanas atver [http://localhost:5173](http://localhost:5173).

Tiek palaisti trīs konteineri: PostgreSQL (5432), backend (3001) un frontend (5173). Datubāzes tabula tiek izveidota automātiski.

## Palaišana lokāli (bez Docker)

Nepieciešams lokāli palaists PostgreSQL ar datubāzi `weather_app` (lietotājs `postgres`, parole `postgres`). Citus iestatījumus var norādīt failā `backend/.env` ar mainīgajiem `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` un `DB_NAME`.

**Backend:**

```bash
cd backend
npm install
node server.js
```

**Frontend** (atsevišķā terminālī):

```bash
cd frontend
npm install
npm run dev
```

## API

| Metode | Ceļš | Apraksts |
|---|---|---|
| GET | `/cities` | Visu pilsētu saraksts |
| POST | `/cities` | Pievieno pilsētu (`{ "name": "...", "country": "..." }`) |
| DELETE | `/cities/:id` | Dzēš pilsētu |
