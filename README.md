# Jsramverk SSR Editor

Starter project for DV1677 JSRamverk

Jag har valt att implementera React som frontend-ramverk.

---

## Getting Started

To run the entire system locally with Docker, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine:

```
git clone https://github.com/Teodor29/jsramverk
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory `jsramverk`, and add the following environment variables:

```
ATLAS_USERNAME=<username>
ATLAS_PASSWORD=<password>

VITE_API_URL="http://localhost:1337/api"
```

### 3. Build and Start the System with Docker Compose

Run the following command to build and start all services using Docker Compose:

```
docker compose up --build
```
