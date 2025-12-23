## Project Overview
Real-time Transaction & Audit Log System that simulates peer-to-peer fund transfers with an immutable audit log. Backend: Node.js + Express + PostgreSQL + Prisma. Frontend: React (Vite) + plain CSS. Transfers are atomic: debit, credit, and audit log insertion all occur inside a single DB transaction. Sender is fixed to user `#1` for demo purposes.

## Setup / Run Instructions
1) Prerequisites: Node.js, PostgreSQL running locally.  
2) Backend
   - `cd backend`
   - Set `DATABASE_URL` in `.env` (Postgres connection string).
   - `npm install`
   - `npx prisma migrate dev --name init`
   - `npm run seed` (or `npx prisma db seed`) to load demo users
   - `npm run dev` (port 3000). Health check: `GET http://localhost:3000/health`.
3) Frontend
   - `cd frontend`
   - `npm install`
   - If backend is not on localhost: set `VITE_API_URL` (e.g., `http://localhost:3000/api`)
   - `npm run dev` and open the shown URL.

## API Documentation (core endpoints)
- `POST /api/transfer`  
  Body: `{ receiverId: number, amount: number }` (sender fixed to `1`).  
  Result: balances updated atomically; audit log entry appended.
- `GET /api/balance/:userId`  
  Returns current balance for the user.
- `GET /api/history/:userId`  
  Returns audit log entries where the user was sender or receiver (newest first).
- `GET /health`  
  Liveness check.

## Database Schema
- `User`  
  - `id` (PK, int, autoincrement)  
  - `name` (string)  
  - `balance` (decimal(14,2))  
  - `createdAt` (datetime, default now)
- `AuditLog` (append-only)  
  - `id` (PK, int, autoincrement)  
  - `senderId` (FK -> User)  
  - `receiverId` (FK -> User)  
  - `amount` (decimal(14,2))  
  - `status` (string, e.g., SUCCESS)  
  - `createdAt` (datetime, default now)

## AI Tool Usage Log (MANDATORY)
AI tools (Cursor AI) were used as an engineering assistant, not as a replacement for understanding or decision-making.  
AI was used to:
- Generate boilerplate code for Prisma models and Express setup  
- Draft transaction-safe service logic using Prisma transactions  
- Suggest frontend component structures for forms and tables  
- Assist in creating an initial README outline  

All AI-generated code was:
- Carefully reviewed
- Manually modified where necessary
- Tested end-to-end (including rollback scenarios)
- Design decisions such as:
- Using database transactions
- Enforcing audit log immutability
- Separating business logic into services

Testing notes:
- Backend APIs were exercised and verified using Thunder Client (VS Code extension).  
- Frontend behavior (transfers, real-time balance/history updates, table sorting) was manually tested in the browser.
