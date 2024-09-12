# Items

This is an example application that stores configurable items into database. It consist of three parts:
- MongoDB
- node.js backend
- Vue 3 frontend

### How to run MongoDB

- `cd mongodb`

- `cp Dockerfile.example Dockerfile`

- configure `Dockerfile`: container name, username and password

- `docker-compose up -d`

- opt. test if the database is working: `docker exec -it CONTAINER-NAME mongosh -u USERNAME -p PASSWORD --authenticationDatabase admin`

### How to run backend

- `cd backend`

- `cp .config.js.example .config.js`

- setup `.config.js`, especially MongoDB `connectionString`

- `npm run start`

- opt. test the backend in browser, for example `http://localhost:3000/items`

### How to run frontend

- `cd frontend`

- `cp .env.development.example .env.development`

- setup `VITE_TURNSTILE_SITE_KEY` in `.env.development`

- `npm run dev`

- open your browser and enter: `http://localhost:5173/`



