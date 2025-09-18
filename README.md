# Bookstore API

A **Bookstore API** built with **Node.js** and **Express**, that has two services: the **User Service** and the **Book Service**. It has endpoints for fetching users and books, showing how many pages did a user read and also it has the option to export as a CSV file.

- **user-service**: handles users (list and details), their reading progress, and CSV export reports.  
- **book-service**: provides book data (list and details).  

---

## Table of Contents
1. [Services](#services)  
2. [Installation](#installation)  
3. [Running](#running)  
4. [API Routes](#api-routes)  
5. [Testing](#testing)  
6. [Improvement Notes](#improvement-notes)  

---

## Services

### Book Service
- **Port:** `8082`  
- **Endpoints:**
  - `GET /books` → List all books  
  - `GET /books/:id` → Get book by ID  

**Data:** Stored in `book-service/books.json`  

---

### User Service
- **Port:** `8081`  
- **Endpoints:**
  - `GET /users` → List all users  
  - `GET /users/:id` → Get user by ID  
  - `POST /users/export` → Generate a CSV report for the book readings of all users

**CSV Output Columns:**  
```
User Id | First Name | Last Name | Date | Book | Pages Read
```
- `Book` comes from the book-service.  
- `Pages Read` = `totalPages * percentageRead`.

**Data:** Stored in `user-service/users.json`

---

## Installation

Clone the repository:

```bash
git clone https://github.com/geraldgnika/bookstore-api.git
cd bookstore-api
```

Install the dependencies for each service:

```bash
cd book-service
npm install
cd ../user-service
npm install
```

---

## Running

Start each service in separate terminals:

```bash
# Book service
cd book-service
npm run dev  # http://localhost:8082

# User service
cd user-service
npm run dev  # http://localhost:8081
```

> It uses **nodemon** for automatic reloads on code changes.

---

**Endpoint for CSV Export:**
```bash
curl -X POST http://localhost:8081/users/export -i
```

**Endpoint for CSV Export (Save The File Locally):**
```bash
curl -X POST http://localhost:8081/users/export -o users-report.csv
```

---

## Testing

Both services use **Jest** and **Supertest** for unit and integration tests.

```bash
# Run book-service tests
cd book-service
npm test

# Run user-service tests
cd ../user-service
npm test
```

> `user-service` tests mock `axios` calls to `book-service` so they run standalone.

---

## Improvement Notes

To make these services more secure:
1. I might implement authentication (JWT for example). This way I might be able to protect some routes for admin-only access, like '/users/export' for example.
2. I might implement input validation to POST inputs.
3. It would be better to sanitize the user-input data to prevent injection.

To make these services scalable:
1. I would chose a database where to store the data. In my opinion Postgres would work better with this type of project, because it contains relational data.
2. I would implement caching strategies for faster responses so you don't re-fetch all the information over and over from the beginning each time. Redis would be a good option.
3. I would deploy these services behind a load balancer (Nginx for example). This way you can handle large traffic and it would be more reliable.