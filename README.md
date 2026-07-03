# Notes API

REST API for Notes with all CRUD Operations

## Features

- User login and authentication
- CRUD operations for notes
- Error Handling
- Cached A.I Summaries with the [Groq API](https://console.groq.com/docs/quickstart)

## Stack

- [Node.js](https://nodejs.org/) + [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) + [Docker](https://www.docker.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Installation

```bash
git clone https://github.com/LamestAmos/Notes-API.git
cd Notes-API
npm i
```

## Initialization

```bash
npm run dev
```

If you made Database changes, dont forget to:

```bash
npm run db:generate
npm run db:migrate
```

To start the database:

```bash
docker compose up -d
```

See [`docker-compose.yml`](./docker-compose.yml) and [`drizzle.config.ts`](./drizzle.config.ts) for more info on Database Configurations.

Don't forget to check [`.env.example`](.env.example) to confirm your environment variables

## Example Usage

Just to see, at a glance, what the API does.

### User Auth

---

#### Register

##### Request

```bash
curl --request POST \
  --url http://localhost:3000/auth/register \
  --header 'Content-Type: application/json' \
  --data '
{
  "email": "Elfrieda3@hotmail.com",
  "password": "password"
}
'
```

##### Response

```json
{
  "id": "53db888f-3f09-405b-b431-35f705512f00",
  "email": "Emely_Hilll@gmail.com",
  "role": "user"
}
```

#### Login

##### Request

```bash
curl --request POST \
  --url http://localhost:3000/auth/login \
  --header 'Content-Type: application/json' \
  --data '
{
  "email": "Emely_Hilll@gmail.com",
  "password": "password"
}
'
```

##### Response

```json
{
  "token": "[Some token here]"
}
```

### Notes

---

#### GET By ID

##### Request

```bash
curl --request GET \
  --url 'http://localhost:3000/notes/:id' \
  --header 'Authorization: Bearer [Some Token Here]' \
```

##### Response

```json
{
  "id": "461ba0ba-b44b-4f4d-8130-c6a9b93f6cae",
  "title": "Note 959 - ascisco attero sapiente",
  "content": "Rohan and Sons - Rustic Metal Mouse: This product is a very good product. That is what we think and, we want to get your money. We also want to rule the world but shhh dont tell anyone that",
  "createdAt": "2026-07-03T14:14:38.855Z",
  "groqSummary": null
}
```

#### GET As List

##### Request

```bash
curl --request GET \
  --url 'http://localhost:3000/notes?page=1&limit=3' \
  --header 'Authorization: Bearer [Some Token Here]' \
```

##### Response

```json
{
  "notes": [
    // Some list of Notes
  ],
  "next": {
    "page": 2,
    "limit": 3
  }
}
```

#### Create (POST)

##### Request

```bash
curl --request POST \
  --url http://localhost:3000/notes \
  --header 'Authorization: Bearer [Some Token Here]' \
  --header 'Content-Type: application/json' \
  --data '
{
  "title": "Note 165 - decens claudeo amplus",
  "content": "Glover, Steuber and Casper - Frozen Bamboo Sausages: This product is a very good product. That is what we think and, we want to get your money. We also want to rule the world but shhh dont tell anyone that"
}
'
```

##### Response

```json
{
  "id": "d0b2e007-0684-440b-943e-63f924c4bb16",
  "title": "Note 221 - balbus necessitatibus aestus",
  "content": "McDermott - Harber - Rustic Marble Bike: This product is a very good product. That is what we think and, we want to get your money. We also want to rule the world but shhh dont tell anyone that",
  "createdAt": "2026-07-03T14:10:59.631Z"
}
```

There's also updating and deleting, but we know what they should do.

### Groq

---

#### Summarize Note By ID

##### Request

```bash
curl --request GET \
  --url http://localhost:3000/groq/:id \
  --header 'Authorization: Bearer [Some Token Here]' \
```

##### Response

```text
The note, titled "ascisco attero sapiente," appears to be a humorous and satirical advertisement for a product called the "Rustic Metal Mouse" from Rohan and Sons. The note candidly states that the company thinks the product is good and wants to sell it to consumers, but also jokingly reveals a more sinister motivation, implying that the company has ambitions to "rule the world," with a tongue-in-cheek request to keep this goal secret.
```
