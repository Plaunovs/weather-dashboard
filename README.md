# Laikapstākļu aplikācija

Pilna steka laikapstākļu lietotne, izstrādāta ar React, Node.js, PostgreSQL un Docker.

## Funkcionalitāte

* Apskatīt laikapstākļus vairākām pilsētām
* Detalizēts laikapstākļu skats katrai pilsētai
* Pārslēgšanās starp °C un °F vienībām
* Iespēja pievienot un dzēst pilsētas
* Pilsētu saraksts tiek glabāts PostgreSQL datubāzē
* Pilna aplikācija darbojas ar Docker

## Izmantotās tehnoloģijas

Frontend:

* React
* React Router
* Vite

Backend:

* Node.js
* Express
* PostgreSQL

Cits:

* OpenWeather API
* Docker Compose

## Palaišana lokāli (bez Docker)

### Backend

* cd backend
* npm install
* node server.js

### Frontend

* cd frontend
* npm install
* npm run dev

## Palaišana ar Docker

* docker compose up --build

Pēc palaišanas atver:
[http://localhost:5173](http://localhost:5173)

