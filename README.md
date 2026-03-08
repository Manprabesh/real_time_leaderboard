# Real-Time Leaderboard API

Backend service for a **real-time gaming leaderboard** built with **Node.js, Express, Redis, and Server-Sent Events (SSE)**.
The system allows users to authenticate, submit scores, and receive **live leaderboard updates** without polling.

Redis **Sorted Sets** are used to efficiently maintain rankings and retrieve high scores.

---

## Tech Stack

* **Node.js**
* **Express.js**
* **Redis** (Sorted Sets for ranking)
* **PostgreSQL** (persistent storage)
* **Server-Sent Events (SSE)** for real-time leaderboard streaming
* **JWT Authentication**
* **Express Rate Limit** for OTP protection

---

## Features

* User authentication with OTP verification
* Secure JWT-based authorization
* Game management system
* Real-time leaderboard updates using SSE
* Redis-based ranking system
* Score submission and high-score retrieval
* Pagination for user listing
* API rate limiting for OTP requests

---

## API Routes

### Authentication

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| POST   | `/signup`           | Register a new user (OTP protected) |
| POST   | `/otp-verification` | Verify OTP for signup               |
| POST   | `/signin`           | Authenticate user and generate JWT  |

---

### User Management

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/user-list/:limit/:page` | Get paginated list of users |
| DELETE | `/users/:id`              | Delete a user               |
| GET    | `/user-profile/:id`       | Get user profile            |

Authentication required for all endpoints.

---

### Game Management

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/submit-game` | Upload a new game   |
| GET    | `/get-game`    | Retrieve all games  |
| GET    | `/search-game` | Search for games    |
| PUT    | `/update-game` | Update game details |

---

### Score & Leaderboard

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/submit-score`        | Submit player score          |
| GET    | `/score/:gameId`       | Get highest score for a game |
| GET    | `/leaderboard/:gameId` | Real-time leaderboard stream |

---

## Real-Time Leaderboard

The leaderboard endpoint uses **Server-Sent Events (SSE)** to push updates whenever scores change.

Example connection:

```
GET /leaderboard/:gameId
```

Clients receive continuous updates without repeated polling.

Example response stream:

```
data: {
  "userId": 10,
  "score": 1500,
  "rank": 1
}
```

---

## Redis Leaderboard Design

Redis **Sorted Sets** store scores.

Example operations used:

* `ZADD` – add or update user score
* `ZREVRANGE` – fetch top players
* `ZREVRANK` – determine user ranking

This provides **O(log N)** insertion and efficient ranking retrieval.

---

## Rate Limiting

OTP requests are protected using **Express Rate Limit**.

Configuration example:

```
window: 1 minute
max requests: 5
```

This prevents OTP abuse and brute force attempts.

---

## Installation

Clone the repository:

```
git clone https://github.com/your-username/real-time-leaderboard.git
```

Install dependencies:

```
npm install
```

Start the server:

```
npm start
```

---

## Environment Variables

Create a `.env` file.

Example:

```
PORT=3000 
GOOGLE_APP_PASSWORD=your_google_app_password 
REDIS_HOST=your_redis_host 
REDIS_PASSWORD=your_redis_password 
JWT_SECRET=your_jwt_secret 
DATABASE_USER=your_database_user DATABASE_PASSWORD=your_database_password 
DATABASE_HOST=localhost 
DATABASE_PORT=5432 
DATABASE_NAME=leaderboard
```

---

## Project Structure

```
project
│
├── controllers
├── routes
├── middleware
├── configs
├── models
│
├── server.js
├── package.json
└── README.md
```

---

## Author

Manprabesh Boruah

---

## License

This project is for educational and development purposes.
