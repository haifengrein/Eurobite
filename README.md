# Eurobite - Smart Restaurant Management System

![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📖 Introduction

**Eurobite** is a comprehensive, full-stack food delivery and restaurant management platform. It addresses the core operational needs of modern catering businesses, streamlining the process from user ordering to kitchen preparation and financial reporting.

This project was architected to demonstrate a production-ready **monolithic architecture** with a clear separation of concerns, featuring a robust RESTful API backend and a responsive, type-safe frontend.

## 🚀 Key Features

### 🏢 Admin Dashboard (Back Office)
*   **Data Visualization**: Real-time overview of turnover, order statistics, and top-selling items.
*   **Menu Management**: comprehensive CRUD operations for Categories, Dishes, and Set Meals (Combos) with image uploading.
*   **Order Processing**: Real-time order handling workflow (Pending -> Confirmed -> Delivery -> Completed).
*   **Employee Management**: Secure internal account management.
*   **RBAC Permission System**: Fine-grained access control based on roles (Admin, Manager, Staff).

### 📱 User Application (Customer Facing)
*   **Smart Menu**: Categorized browsing of dishes and combos.
*   **Shopping Cart**: Persistence cart management and cost calculation.
*   **Order & Checkout**: Streamlined address management and order submission.

## 🛠 Tech Stack

### Backend
*   **Framework**: Spring Boot 3, Spring MVC
*   **Database**: PostgreSQL (Production), H2 (Testing)
*   **ORM/Persistence**: Spring Data JPA / MyBatis
*   **Security**: Spring Security, JWT (JSON Web Tokens) for stateless authentication
*   **Tools**: Maven, Lombok, Jackson

### Frontend
*   **Core**: React 18, Vite
*   **Language**: TypeScript (Strict mode enabled)
*   **State Management**: Zustand / Context API
*   **Styling**: Tailwind CSS
*   **HTTP Client**: Axios with interceptors for token management

### DevOps & Infrastructure
*   **Containerization**: Docker & Docker Compose
*   **Web Server**: Nginx (Reverse Proxy)

## 💡 Technical Highlights & Architecture

*   **Role-Based Access Control (RBAC)**: Implemented a dynamic permission system. The backend validates user authorities per request, while the frontend dynamically renders UI elements (e.g., hiding "Settings" for standard staff) based on the user's role.
*   **Global Exception Handling**: Centralized error handling mechanism using `@ControllerAdvice` to ensure consistent API error responses (JSON format) and improved maintainability.
*   **Interceptor Pattern**: Utilized Spring Interceptors and Axios Interceptors to handle JWT injection, validation, and automatic logout on token expiration.
*   **Responsive Design**: The frontend is built with a mobile-first approach using Tailwind CSS, ensuring usability across tablets and desktops for restaurant staff.

## ⚡ Getting Started

The project is containerized for easy setup.

### Prerequisites
*   Docker & Docker Compose
*   Java 17+ (for local dev)
*   Node.js 18+ (for local dev)

### Run with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/haifengrein/Eurobite.git

# 2. Start services
docker-compose up --build
```

Access the application:
*   **Frontend**: `http://localhost:5173` (or port defined in docker-compose)
*   **Backend API**: `http://localhost:8080`


