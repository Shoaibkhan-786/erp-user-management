# ERP User Management (backend)

## Tech
- Node.js (ES6 modules), Express.js
- Sequelize + MySQL
- Passport (local + jwt)
- Joi validation
- bcryptjs (password hashing)

## Setup
1. Clone repo.
2. `cp .env.example .env` and fill DB credentials and JWT_SECRET.
3. `npm install`
4. `npm run seed` — creates db, sample - roles, company, and CA user:
   - CA user email: `ca@example.com`, password: `Password123`
5. `npm start`

## APIs
- `GET /` — homepage
- `POST /auth/login` — login, returns JWT (body: `{ email, password }`)
- `GET /users/getUser` — returns current user
- `POST /users` — create user (protected, only role with `CA` can access)
- `DELETE /users` — delete user (protected, only role with `CA` can delete)
- `GET /users?page=1&perPage=10` — returns all users
- `GET /roles` — returns all roles
