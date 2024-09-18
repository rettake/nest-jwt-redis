# NestJS Project with PostgreSQL and Redis

This project is a simple **NestJS** application that connects to a **PostgreSQL** database and uses **Redis** for caching. It is containerized using **Docker** and managed with **docker-compose**.

## Project Structure

- **app**: The main NestJS application.
- **db**: A PostgreSQL database container.
- **redis**: A Redis container used for caching.

## Features

- **NestJS** for the backend API.
- **PostgreSQL** as the relational database.
- **Redis** for caching.
- **Docker** for containerization and easier deployment.

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rettake/nest-jwt-redis.git
cd nest-jwt-redis
```

### 3. Configure ENV

Create .env file
```bash
DATABASE_URL=postgres://postgres:postgres@db:5432/mydb
REDIS_URL=redis://redis:6379
NODE_ENV=production
```

### 3. Run the project
docker compose up --build
```bash
docker compose up --build
```
