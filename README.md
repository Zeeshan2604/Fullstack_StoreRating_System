# Store Rating Platform – Full Stack Internship Project

A full-stack web application that allows users to rate stores, built using:

## Tech Stack

| Layer    | Tech                |
|----------|---------------------|
| Backend  | Node.js, Express.js |
| Database | MySQL               |
| Frontend | React.js            |
| Styling  | Tailwind CSS        |
| Auth     | JWT                 |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL Server
- Git

---

## Backend Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/store-rating-platform.git
   cd store-rating-platform/backend

2. Install dependencies:
   ```bash
   npm install

3. Create MySQL database:

   ```sql
   CREATE DATABASE store_rating_app;
   
4. Configure environment variables:
Create a .env file:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_app
   JWT_SECRET=your_secret_key
   
5. Create tables using this SQL:
   ```sql
      CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(60) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     address VARCHAR(400),
     password VARCHAR(255) NOT NULL,
     role ENUM('admin', 'user', 'owner') DEFAULT 'user'
      );
      
      CREATE TABLE stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        address VARCHAR(400),
        owner_id INT,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      );
      
      CREATE TABLE ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        UNIQUE(user_id, store_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (store_id) REFERENCES stores(id)
      );

6. Run the server:
   ```bash
      npx nodemon server.js
