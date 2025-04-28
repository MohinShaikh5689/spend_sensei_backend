# 💸 Spend Sensei - Financial Management System

<div align="center">
  <p><em>Your personal finance wizard — track smarter, spend wiser.</em></p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" />
    <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
    <img src="https://img.shields.io/badge/Authentication-JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge" />
    <img src="https://img.shields.io/badge/AI-Groq_API-ff8c00?style=for-the-badge" />
  </p>
</div>

---

## ✨ Features

- **🔐 User Authentication:** Secure registration and login system
- **💸 Transaction Management:** Track income and expenses with categorization
- **🧠 AI-Powered Financial Advisor:** Personalized financial advice via Groq API
- **📊 Budget Planning:** Set and manage category-based budgets
- **📆 Monthly Reporting:** View transaction history and spending patterns by month
- **🔁 Automatic Balance Forward:** Carry over positive balances from previous months

---

## ⚙️ Tech Stack

| Layer         | Technologies                             |
| ------------- | ---------------------------------------- |
| Backend       | Node.js, Express.js                     |
| Database      | MongoDB (with Mongoose ODM)              |
| Authentication| JWT (JSON Web Tokens)                   |
| Password Security | bcryptjs                           |
| AI Integration| Groq API                                 |

---

## 🧩 API Endpoints

### 🚹 User Management
- `POST /api/v1/users/register` – Register a new user
- `POST /api/v1/users/login` – Login existing user

### 💵 Transaction Management
- `POST /api/v1/transactions` – Create a new transaction
- `GET /api/v1/transactions` – Retrieve all transactions for the logged-in user
- `POST /api/v1/transactions/get` – Retrieve transactions by month
- `PUT /api/v1/transactions/:transactionId` – Edit a transaction
- `DELETE /api/v1/transactions/:transactionId` – Delete a transaction

### 🧮 Budget Management
- `POST /api/v1/budget` – Create a new budget
- `GET /api/v1/budget` – Get all budgets for the logged-in user
- `POST /api/v1/budget/monthly` – Retrieve budgets by month
- `PUT /api/v1/budget/:budgetId` – Edit a budget
- `DELETE /api/v1/budget/:budgetId` – Delete a budget

### 🤖 AI Chat Functions
- `POST /api/v1/budget/chat` – Natural language transaction creation
- `POST /api/v1/budget/financial-advisor` – AI-powered financial advice
- `GET /api/v1/budget/chats` – Retrieve chat history

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or cloud instance like Atlas)
- Groq API Key (for AI features)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/spend-sensei-backend.git
cd spend-sensei-backend

# 2. Install dependencies
npm install

# 3. Create a .env file and add the following:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# GROQ_API_KEY=your_groq_api_key
# PORT=5000

# 4. Start the server
npm run dev

# Server will run at http://localhost:5000 🚀
```

---

## 🗃️ Data Models

### 👤 User

| Field      | Type     | Description         |
|------------|----------|---------------------|
| name       | String   | User's name          |
| email      | String   | User's email         |
| password   | String   | Hashed password      |
| createdAt  | Date     | Date of registration |

### 💳 Transaction

| Field            | Type     | Description                         |
|------------------|----------|-------------------------------------|
| userId           | ObjectId | Linked user                        |
| amount           | Number   | Transaction amount                 |
| description      | String   | Transaction details                |
| transactionType  | String   | 'income' or 'expense'               |
| category         | String   | Category of transaction            |
| date             | Date     | Transaction date                   |

### 📋 Budget

| Field            | Type     | Description                         |
|------------------|----------|-------------------------------------|
| userId           | ObjectId | Linked user                        |
| amount           | Number   | Budget amount                      |
| description      | String   | Budget details                     |
| category         | String   | Budget category                    |
| transactionType  | String   | 'income' or 'expense' (if needed)   |
| date             | Date     | Budget period start                |

### 💬 Chat

| Field      | Type     | Description                         |
|------------|----------|-------------------------------------|
| message    | String   | User's input message                |
| user       | ObjectId | Linked user                         |
| botReply   | String   | AI-generated reply                  |
| createdAt  | Date     | Date of conversation                |

---

## 🔒 Security Features

- **JWT Authentication:** Secures user sessions and API endpoints
- **Password Hashing:** bcryptjs for safe password storage
- **Protected Routes:** Middleware ensures only authenticated users access critical routes

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by **Mohin Shaikh**  

<div align="center">
  <br />
  <p><em>Spend wisely, live better. 🧘‍♂️</em></p>
</div>
