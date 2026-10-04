# FinTrack – Fraud Detection System

FinTrack is a full-stack fintech fraud detection platform designed to monitor financial transactions and identify potentially suspicious activities. It provides secure authentication, transaction management, fraud alerts, analytics, and role-based access.

## 🚀 Live Demo

**Frontend:** https://fin-track-two-self.vercel.app

## 🎯 Project Purpose

FinTrack helps automate the monitoring of financial transactions. Instead of manually checking every transaction, the system analyzes transactions using predefined fraud-detection rules and generates alerts when suspicious activity is detected.

## 🔄 How It Works

```text
User
  ↓
Login / Registration
  ↓
Create Transaction
  ↓
Transaction Service
  ↓
Fraud Detection
  ↓
Normal → Store Transaction
Suspicious → Generate Fraud Alert
  ↓
Admin / Analyst Dashboard
```

## ✨ Key Features

- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Admin user management
- Transaction creation and history
- Rule-based fraud detection
- Suspicious transaction alerts
- Admin and analyst dashboards
- Transaction analytics
- Redis caching
- Kafka event-driven processing
- Docker and Kubernetes support
- CI/CD with GitHub Actions
- Cloud deployment support

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Java | Backend |
| Spring Boot | REST APIs and backend |
| PostgreSQL | Database |
| Apache Kafka | Event-driven processing |
| Redis | Caching |
| JWT | Authentication |
| Docker | Containerization |
| Kubernetes | Container orchestration |
| AWS | Cloud deployment |
| Terraform | Infrastructure as Code |
| GitHub Actions | CI/CD |
| Prometheus | Monitoring |
| Grafana | Metrics visualization |

## 🏗️ Architecture

```text
                    React.js
                       │
                       ▼
                Spring Boot APIs
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Auth Service  Transaction   Analytics
                       │
                       ▼
                     Kafka
                       │
                       ▼
              Fraud Detection
                       │
              ┌────────┴────────┐
              ▼                 ▼
          PostgreSQL          Redis
```

## 👥 User Roles

### USER

- Login
- View account information
- Create transactions
- View transaction history

### ANALYST

- View suspicious transactions
- Review fraud alerts
- Analyze transaction activity

### ADMIN

- Register and manage users
- Assign roles
- View transactions
- Monitor fraud alerts
- View system analytics

## 🔐 Security

- JWT authentication
- Role-based authorization
- Password hashing
- Input validation
- Protected API endpoints
- Passwords are never stored as plain text

> This project is intended for educational and portfolio purposes. Do not use real banking credentials, card details, CVV, Aadhaar numbers, or other sensitive financial information in the demo.

## 📁 Project Structure

```text
fin-track/
├── frontend/
├── services/
│   ├── auth-service/
│   ├── transaction-service/
│   ├── fraud-service/
│   └── analytics-service/
├── k8s/
├── terraform/
├── monitoring/
├── .github/
│   └── workflows/
├── docker-compose.yml
└── README.md
```

## ▶️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fin-track.git
cd fin-track
```

### 2. Configure environment variables

Configure the required database, JWT, Redis, and Kafka variables.

**Never commit real passwords, API keys, JWT secrets, or database credentials to GitHub.**

### 3. Start supporting services

```bash
docker compose up -d
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

## 🚀 Deployment

The project supports a cloud-native deployment workflow:

```text
GitHub
   ↓
GitHub Actions
   ↓
Build & Test
   ↓
Docker
   ↓
Kubernetes / AWS
   ↓
Production
```

The frontend can also be deployed using Vercel.

## 📊 Future Enhancements

- Machine-learning-based fraud prediction
- OTP/MFA authentication
- Advanced behavioral analysis
- Real-time email/SMS alerts
- Advanced fraud scoring
- Enhanced AWS infrastructure
- Advanced monitoring and logging
- Mobile application

## 👨‍💻 Author

**Mohammed Abubakkar I**

B.E. Computer Science Engineering (Honors)

## 📄 License

This project is created for educational, academic, and portfolio purposes.
