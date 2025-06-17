# FitTrack – AI-Powered Fitness Tracker 🏋️‍♀️💡

FitTrack is a full-stack AI-powered fitness tracker web application that helps users monitor their workouts, meals, water intake, and overall health trends. It integrates intelligent recommendations, real-time visual analytics, and third-party APIs to offer a comprehensive wellness platform.

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- 🏃 **Workout Logging**: Duration, type, sets, reps, calories burned, steps
- 🍽️ **Meal Tracking**: Auto-nutrient breakdown using Nutritionix API
- 💧 **Water Intake Tracking**: Daily hydration logs
- 📊 **Interactive Dashboards**: Charts for calories, macros, trends
- 🤖 **AI Assistant**: Google Gemini API for smart suggestions & queries
- 📈 **Analytics & Insights**: Weekly/monthly/yearly trends, goal tracking

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (SPA with modular components)
- **Chart.js / Recharts** (Data visualization)
- **CSS Modules & Flexbox/Grid** (Responsive UI)

### Backend
- **Spring Boot (Java 17)** – RESTful API server
- **Spring Security** – Authentication & Authorization
- **JWT** – Session management
- **PostgreSQL** – Relational DB (via Spring Data JPA)

### APIs
- **Nutritionix API** – Nutritional data
- **Gemini API (Google AI)** – AI assistant for workouts, meal suggestions, Q&A

---
## ⚙️ Setup Instructions

### Prerequisites
- Node.js & npm
- Java 17
- PostgreSQL (local or cloud)
- Maven

### Clone the Repo
```
git clone https://github.com/Silky-bedi01/Fitness-Tracker.git

Backend Setup
cd backend
./mvnw install
./mvnw spring-boot:run
Configure PostgreSQL credentials in application.properties

API docs available at http://localhost:8080/swagger-ui.html

Frontend Setup
cd frontend
npm install
npm start


