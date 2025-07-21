# Jsramverk SSR Editor

Project for DV1677 JSRamverk.

---

## Getting Started

### Run with Docker

Run the project is using Docker Compose:

1. Clone the repository:

    ```bash
    git clone https://github.com/Teodor29/jsramverk
    ```

2. Create .env files:

    jsramverk/backend/.env:

    ```bash
    ATLAS_USERNAME=<your_atlas_username>
    ATLAS_PASSWORD=<your_atlas_password>
    ```

    jsramverk/frontend/.env:

    ```bash
    VITE_API_URL="http://localhost:1337/api"
    ```

3. Navigate to the project folder:

    ```bash
    cd jsramverk
    ```

4. Start the services:
    ```bash
    docker compose up --build
    ```

### Running Locally

To run the backend and frontend locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/Teodor29/jsramverk
    ```

2. Navigate to the project folder:
    ```bash
    cd jsramverk
    ```

#### Backend Setup

1. Navigate to the jsramverk/backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file
   jsramverk/backend/.env:

    ```bash
    ATLAS_USERNAME=<your_atlas_username>
    ATLAS_PASSWORD=<your_atlas_password>
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

#### Frontend Setup

1. Open a new terminal and navigate to the jsramverk/frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file:
    jsramverk/backend/.env:

    ```bash
    VITE_API_URL="http://localhost:1337/api"
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

