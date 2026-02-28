# AI-Enabled Smart Healthcare & Telemedicine Platform

This is a distributed, cloud-native healthcare platform designed to facilitate doctor appointments, video consultations, and AI-based health triage. Built using a **Microservices Architecture**, the system is fully containerized and ready for cloud deployment.

## System Architecture
The platform is composed of several independent microservices:
- **Auth Service:** Role-based access control (RBAC) using JWT (Admin, Doctor, Patient).
- **Patient Service:** Profile management and medical report uploads.
- **Doctor Service:** Specialty management and registration verification.
- **Appointment Service:** Real-time scheduling and booking logic.
- **Telemedicine Service:** Secure video session token generation (Agora/Twilio).
- **Payment Service:** Integration with Stripe/PayHere sandbox.
- **AI Symptom Checker:** NLP-based triage service for health suggestions.
- **API Gateway:** Central entry point for all client requests.
- **Web Client:** An asynchronous React-based dashboard.

## Tech Stack
- **Backend:** Node.js (Express), Python (Flask for AI)
- **Frontend:** React.js / Asynchronous JavaScript
- **Databases:** MongoDB (NoSQL) & PostgreSQL (SQL)
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes (K8s)
- **Communication:** RESTful APIs & Asynchronous Messaging

## Deployment Instructions

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
- [Node.js](https://nodejs.org/) (for local development).

### Running with Docker Compose
To launch the entire platform (all services + databases) with a single command:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Y3S2-SE/smart-healthcare-platform.git
   cd smart-healthcare-platform

## Team Members

- **[Hiruvinda ](https://github.com/hiruvindajayashanka2001)** 
- **[Thimeth Sathmika](https://github.com/Thimeth0013)** 
- **[Dishan](https://github.com/Dish-K)** 
- **[Ravindu Thiranjaya](https://github.com/ravindu422)**