# Healthcare Platform — Complete Team Instructions
# A to Z Workflow Guide

---

## TABLE OF CONTENTS

```
PART 1 — PROJECT LEAD (Member 1) INITIAL SETUP
  Step 1  — Prerequisites
  Step 2  — Create GitHub Repository
  Step 3  — Create Project Folder Structure
  Step 4  — Create Root Configuration Files
  Step 5  — Create API Gateway
  Step 6  — Create Every Service Skeleton
  Step 7  — Create Frontend
  Step 8  — Create Kubernetes Files
  Step 9  — Create Setup Scripts
  Step 10 — Create Docker Compose
  Step 11 — Test Everything Locally
  Step 12 — Push to GitHub
  Step 13 — Invite Team Members

PART 2 — OTHER MEMBERS (2, 3, 4) ONBOARDING
  Step 1  — Prerequisites
  Step 2  — Clone Repository
  Step 3  — Run Setup Script
  Step 4  — Verify Everything Works
  Step 5  — Create Your Branch
  Step 6  — Open Your Service

PART 3 — DAILY WORKFLOW (All Members)
  Morning Routine
  During Development
  End of Day
  Common Commands

PART 4 — SERVICE DEVELOPMENT GUIDE
  How to Add Routes
  How to Add Models
  How to Test Your Service
  How to Add NPM Packages

PART 5 — COLLABORATION RULES
  Git Rules
  Code Rules
  Communication Rules

PART 6 — KUBERNETES DEMO (Final Week)
  Build Images
  Deploy to Kubernetes
  Verify Deployment
  Access the App

PART 7 — TROUBLESHOOTING
  Common Errors and Fixes
```

---

---

# PART 1 — PROJECT LEAD (MEMBER 1) INITIAL SETUP

> You do this ONCE on Day 1. Takes about 1-2 hours.
> After this, teammates can clone and start working.

---

## Step 1 — Install Prerequisites

Install everything below before starting.

```bash
# 1. Node.js 18+
#    Download: https://nodejs.org
#    Choose LTS version

# 2. Docker Desktop
#    Download: https://docker.com/products/docker-desktop
#    Install and OPEN it — wait for it to fully start
#    (whale icon in taskbar must be still, not animated)

# 3. Git
#    Download: https://git-scm.com

# 4. VS Code
#    Download: https://code.visualstudio.com

# Verify everything installed correctly
node --version        # must show v18.x.x or higher
npm --version         # must show 9.x.x or higher
docker --version      # must show Docker version 24.x.x or higher
git --version         # must show git version 2.x.x

# Enable Kubernetes in Docker Desktop
# Docker Desktop → Settings → Kubernetes → tick Enable Kubernetes → Apply & Restart
# Wait 3-5 minutes for Kubernetes to start

# Verify Kubernetes works
kubectl version       # must show Client Version and Server Version
kubectl get nodes     # must show docker-desktop as Ready
```

---

## Step 2 — Create GitHub Repository

```
1. Go to github.com and sign in
2. Click the + button → New repository
3. Repository name: healthcare-platform
4. Set to Private
5. DO NOT tick any of these:
      ❌ Add a README file
      ❌ Add .gitignore
      ❌ Choose a license
6. Click Create repository
7. Copy the repository URL shown on the page
   Example: https://github.com/your-username/healthcare-platform.git
8. Go to Settings → Collaborators → Add your teammates by their GitHub username
```

---

## Step 3 — Create Project Folder Structure

Run these commands in your terminal one by one.

```bash
# Go to where you want to create the project
# Example: Desktop
cd ~/Desktop

# Create root folder
mkdir healthcare-platform
cd healthcare-platform

# Create all service folders with subfolders
mkdir -p services/auth-service/src/models
mkdir -p services/auth-service/src/controllers
mkdir -p services/auth-service/src/routes
mkdir -p services/auth-service/src/middleware

mkdir -p services/patient-service/src/models
mkdir -p services/patient-service/src/controllers
mkdir -p services/patient-service/src/routes
mkdir -p services/patient-service/src/middleware
mkdir -p services/patient-service/uploads

mkdir -p services/doctor-service/src/models
mkdir -p services/doctor-service/src/controllers
mkdir -p services/doctor-service/src/routes
mkdir -p services/doctor-service/src/middleware

mkdir -p services/appointment-service/src/models
mkdir -p services/appointment-service/src/controllers
mkdir -p services/appointment-service/src/routes
mkdir -p services/appointment-service/src/middleware

mkdir -p services/payment-service/src/controllers
mkdir -p services/payment-service/src/routes
mkdir -p services/payment-service/src/middleware

mkdir -p services/notification-service/src/controllers
mkdir -p services/notification-service/src/routes

mkdir -p services/telemedicine-service/src/controllers
mkdir -p services/telemedicine-service/src/routes
mkdir -p services/telemedicine-service/src/middleware

mkdir -p services/ai-service/src/controllers
mkdir -p services/ai-service/src/routes
mkdir -p services/ai-service/src/middleware

mkdir -p api-gateway
mkdir -p k8s/services
mkdir -p scripts
mkdir -p frontend

# Verify structure was created
ls -la
ls -la services/
```

---

## Step 4 — Create Root Configuration Files

### 4a. Create `.gitignore`

Create a file called `.gitignore` in the root folder with this content:

```
# Dependencies — too large, everyone installs their own
**/node_modules/

# Environment files — contain real passwords, never commit
**/.env

# Build outputs
**/dist/
**/build/

# Log files
**/*.log
npm-debug.log*
yarn-debug.log*

# OS generated files
.DS_Store
.DS_Store?
._*
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
```

### 4b. Create `README.md`

Create a file called `README.md` in the root folder:

```markdown
# Healthcare Platform
AI-Enabled Smart Healthcare Appointment & Telemedicine Platform

## Team
| Name | Reg No | Service |
|------|--------|---------|
| Member 1 | IT21XXXXXX | Auth Service + Setup |
| Member 2 | IT21XXXXXX | Patient + Doctor Service |
| Member 3 | IT21XXXXXX | Appointment + Payment + Notification |
| Member 4 | IT21XXXXXX | Frontend + Telemedicine + AI |

## Quick Start
Read INSTRUCTIONS.md for full guide.

### Mac/Linux
git clone https://github.com/your-team/healthcare-platform.git
cd healthcare-platform
chmod +x setup.sh
./setup.sh

### Windows
git clone https://github.com/your-team/healthcare-platform.git
cd healthcare-platform
setup.bat

## Ports
| Service             | Port |
|---------------------|------|
| Frontend            | 3000 |
| API Gateway         | 80   |
| Auth Service        | 3001 |
| Patient Service     | 3002 |
| Doctor Service      | 3003 |
| Appointment Service | 3004 |
| Payment Service     | 3005 |
| Notification Service| 3006 |
| Telemedicine Service| 3007 |
| AI Service          | 3008 |
```

---

## Step 5 — Create API Gateway

### 5a. Create `api-gateway/nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {

    upstream auth_service {
        server auth-service:3001;
    }
    upstream patient_service {
        server patient-service:3002;
    }
    upstream doctor_service {
        server doctor-service:3003;
    }
    upstream appointment_service {
        server appointment-service:3004;
    }
    upstream payment_service {
        server payment-service:3005;
    }
    upstream notification_service {
        server notification-service:3006;
    }
    upstream telemedicine_service {
        server telemedicine-service:3007;
    }
    upstream ai_service {
        server ai-service:3008;
    }

    server {
        listen 80;

        # Route each path to the correct service
        location /api/auth/ {
            proxy_pass http://auth_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/patients/ {
            proxy_pass http://patient_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/doctors/ {
            proxy_pass http://doctor_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/appointments/ {
            proxy_pass http://appointment_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/payments/ {
            proxy_pass http://payment_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/notifications/ {
            proxy_pass http://notification_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/telemedicine/ {
            proxy_pass http://telemedicine_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/ai/ {
            proxy_pass http://ai_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 5b. Create `api-gateway/Dockerfile`

```dockerfile
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Step 6 — Create Every Service Skeleton

> Do this for ALL 8 services.
> Each service needs: package.json, Dockerfile, Dockerfile.dev, .env.example, index.js
> The middleware/auth.js is the same file in every service.

---

### 6a. Create `package.json` for Each Service

**services/auth-service/package.json**
```json
{
  "name": "auth-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "2.4.3",
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2",
    "mongoose": "7.6.3"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/patient-service/package.json**
```json
{
  "name": "patient-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2",
    "mongoose": "7.6.3",
    "multer": "1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/doctor-service/package.json**
```json
{
  "name": "doctor-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2",
    "mongoose": "7.6.3"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/appointment-service/package.json**
```json
{
  "name": "appointment-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "axios": "1.6.2",
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2",
    "mongoose": "7.6.3"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/payment-service/package.json**
```json
{
  "name": "payment-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "axios": "1.6.2",
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2",
    "stripe": "14.5.0"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/notification-service/package.json**
```json
{
  "name": "notification-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "nodemailer": "6.9.7"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/telemedicine-service/package.json**
```json
{
  "name": "telemedicine-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

**services/ai-service/package.json**
```json
{
  "name": "ai-service",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "axios": "1.6.2",
    "cors": "2.8.5",
    "dotenv": "16.3.1",
    "express": "4.18.2",
    "jsonwebtoken": "9.0.2"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  }
}
```

---

### 6b. Create Dockerfiles for Each Service

Create BOTH files below inside every service folder.
Only the EXPOSE port number changes between services.

**Dockerfile** (production — used for Kubernetes)
```dockerfile
FROM node:18.19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

**Dockerfile.dev** (development — used for docker-compose)
```dockerfile
FROM node:18.19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npx", "nodemon", "index.js"]
```

Port numbers per service:
```
auth-service         → EXPOSE 3001
patient-service      → EXPOSE 3002
doctor-service       → EXPOSE 3003
appointment-service  → EXPOSE 3004
payment-service      → EXPOSE 3005
notification-service → EXPOSE 3006
telemedicine-service → EXPOSE 3007
ai-service           → EXPOSE 3008
```

---

### 6c. Create `.env.example` for Each Service

> IMPORTANT: These files ARE committed to GitHub.
> They contain dummy values — no real secrets.

**services/auth-service/.env.example**
```
PORT=3001
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/auth-db
JWT_SECRET=healthcare_jwt_secret_2026
JWT_EXPIRES_IN=7d
```

**services/patient-service/.env.example**
```
PORT=3002
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/patient-db
JWT_SECRET=healthcare_jwt_secret_2026
```

**services/doctor-service/.env.example**
```
PORT=3003
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/doctor-db
JWT_SECRET=healthcare_jwt_secret_2026
```

**services/appointment-service/.env.example**
```
PORT=3004
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/appointment-db
JWT_SECRET=healthcare_jwt_secret_2026
DOCTOR_SERVICE_URL=http://doctor-service:3003
PATIENT_SERVICE_URL=http://patient-service:3002
NOTIFICATION_SERVICE_URL=http://notification-service:3006
```

**services/payment-service/.env.example**
```
PORT=3005
JWT_SECRET=healthcare_jwt_secret_2026
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_REAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_REAL_SECRET
APPOINTMENT_SERVICE_URL=http://appointment-service:3004
```

**services/notification-service/.env.example**
```
PORT=3006
EMAIL_USER=REPLACE_WITH_GMAIL_ADDRESS
EMAIL_PASS=REPLACE_WITH_GMAIL_APP_PASSWORD
```

**services/telemedicine-service/.env.example**
```
PORT=3007
JWT_SECRET=healthcare_jwt_secret_2026
```

**services/ai-service/.env.example**
```
PORT=3008
JWT_SECRET=healthcare_jwt_secret_2026
OPENAI_API_KEY=sk-REPLACE_WITH_REAL_KEY
```

---

### 6d. Create Skeleton `index.js` for Each Service

> These are working starter files.
> Docker can build and run them immediately.
> Teammates fill in the real logic later.

**services/auth-service/index.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Health Check — DO NOT REMOVE ───────────────────────
// Docker and Kubernetes ping this to check if service is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

// ─── Routes — Member 1 adds these ───────────────────────
// app.use('/api/auth', require('./src/routes/authRoutes'));

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start Server ────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[auth-service] MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`[auth-service] Running on port ${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('[auth-service] Startup error:', err.message);
    process.exit(1);
  });
```

**services/patient-service/index.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'patient-service' });
});

// app.use('/api/patients', require('./src/routes/patientRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[patient-service] MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`[patient-service] Running on port ${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('[patient-service] Startup error:', err.message);
    process.exit(1);
  });
```

**services/doctor-service/index.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'doctor-service' });
});

// app.use('/api/doctors', require('./src/routes/doctorRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[doctor-service] MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`[doctor-service] Running on port ${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('[doctor-service] Startup error:', err.message);
    process.exit(1);
  });
```

**services/appointment-service/index.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'appointment-service' });
});

// app.use('/api/appointments', require('./src/routes/appointmentRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[appointment-service] MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`[appointment-service] Running on port ${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('[appointment-service] Startup error:', err.message);
    process.exit(1);
  });
```

**services/payment-service/index.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'payment-service' });
});

// app.use('/api/payments', require('./src/routes/paymentRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT, () =>
  console.log(`[payment-service] Running on port ${process.env.PORT}`)
);
```

**services/notification-service/index.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// app.use('/api/notify', require('./src/routes/notificationRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT, () =>
  console.log(`[notification-service] Running on port ${process.env.PORT}`)
);
```

**services/telemedicine-service/index.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'telemedicine-service' });
});

// app.use('/api/telemedicine', require('./src/routes/telemedicineRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT, () =>
  console.log(`[telemedicine-service] Running on port ${process.env.PORT}`)
);
```

**services/ai-service/index.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ai-service' });
});

// app.use('/api/ai', require('./src/routes/aiRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT, () =>
  console.log(`[ai-service] Running on port ${process.env.PORT}`)
);
```

---

### 6e. Create Shared JWT Middleware

> This exact file goes into EVERY service's src/middleware/ folder.
> Copy it to all 8 services. Do not change it.

**src/middleware/auth.js** (same in every service)
```javascript
const jwt = require('jsonwebtoken');

// Verifies JWT token on every protected request
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Checks if logged in user has the right role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

Copy this file to:
```
services/auth-service/src/middleware/auth.js
services/patient-service/src/middleware/auth.js
services/doctor-service/src/middleware/auth.js
services/appointment-service/src/middleware/auth.js
services/payment-service/src/middleware/auth.js
services/telemedicine-service/src/middleware/auth.js
services/ai-service/src/middleware/auth.js
```

---

## Step 7 — Create Frontend

```bash
# Go into frontend folder
cd frontend

# Create React app
npx create-react-app . --template cra-template

# Install additional packages
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled

# Go back to root
cd ..
```

Create **frontend/Dockerfile.dev**:
```dockerfile
FROM node:18.19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0
CMD ["npm", "start"]
```

Create **frontend/Dockerfile** (production for Kubernetes):
```dockerfile
FROM node:18.19-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create **frontend/nginx.conf**:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Step 8 — Create Kubernetes Files

### 8a. `k8s/namespace.yaml`
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: healthcare
```

### 8b. `k8s/secrets.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: healthcare
type: Opaque
stringData:
  jwt-secret: "healthcare_jwt_secret_2026"
  mongo-auth-uri: "mongodb+srv://user:pass@cluster.mongodb.net/auth-db"
  mongo-patient-uri: "mongodb+srv://user:pass@cluster.mongodb.net/patient-db"
  mongo-doctor-uri: "mongodb+srv://user:pass@cluster.mongodb.net/doctor-db"
  mongo-appointment-uri: "mongodb+srv://user:pass@cluster.mongodb.net/appointment-db"
  stripe-key: "sk_test_your_key_here"
  email-user: "team@gmail.com"
  email-pass: "gmail_app_password"
  openai-key: "sk-your_openai_key"
```

### 8c. `k8s/configmap.yaml`
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: service-config
  namespace: healthcare
data:
  DOCTOR_SERVICE_URL: "http://doctor-service:3003"
  PATIENT_SERVICE_URL: "http://patient-service:3002"
  APPOINTMENT_SERVICE_URL: "http://appointment-service:3004"
  NOTIFICATION_SERVICE_URL: "http://notification-service:3006"
  JWT_EXPIRES_IN: "7d"
```

### 8d. `k8s/services/auth-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: healthcare
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: auth-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3001
        env:
        - name: PORT
          value: "3001"
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongo-auth-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        - name: JWT_EXPIRES_IN
          valueFrom:
            configMapKeyRef:
              name: service-config
              key: JWT_EXPIRES_IN
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 20
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: healthcare
spec:
  selector:
    app: auth-service
  ports:
  - port: 3001
    targetPort: 3001
```

> Create the same pattern for all other services.
> Change: name, image, port number, and secret key for MONGO_URI.

### 8e. `k8s/frontend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: healthcare
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: healthcare-frontend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: healthcare
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: NodePort
```

### 8f. `k8s/ingress.yaml`
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: healthcare-ingress
  namespace: healthcare
spec:
  rules:
  - host: healthcare.local
    http:
      paths:
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /api/patients
        pathType: Prefix
        backend:
          service:
            name: patient-service
            port:
              number: 3002
      - path: /api/doctors
        pathType: Prefix
        backend:
          service:
            name: doctor-service
            port:
              number: 3003
      - path: /api/appointments
        pathType: Prefix
        backend:
          service:
            name: appointment-service
            port:
              number: 3004
      - path: /api/payments
        pathType: Prefix
        backend:
          service:
            name: payment-service
            port:
              number: 3005
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
```

---

## Step 9 — Create Setup Scripts

### `setup.sh` (Mac/Linux)
```bash
#!/bin/bash

echo ""
echo "================================================"
echo "  Healthcare Platform - Team Setup"
echo "================================================"
echo ""

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "ERROR: Docker Desktop is not running!"
  echo "Please start Docker Desktop first, then run this script again."
  exit 1
fi
echo "✅ Docker is running"

# Copy .env.example to .env for each service
echo ""
echo "Setting up environment files..."

SERVICES=(
  "auth-service"
  "patient-service"
  "doctor-service"
  "appointment-service"
  "payment-service"
  "notification-service"
  "telemedicine-service"
  "ai-service"
)

for SERVICE in "${SERVICES[@]}"; do
  if [ ! -f "services/$SERVICE/.env" ]; then
    cp "services/$SERVICE/.env.example" "services/$SERVICE/.env"
    echo "  ✅ Created: services/$SERVICE/.env"
  else
    echo "  ⏭️  Skipped: services/$SERVICE/.env already exists"
  fi
done

# Build and start all services
echo ""
echo "Building Docker images and starting services..."
echo "First time takes 5-10 minutes. Please wait..."
echo ""
docker-compose --profile full up --build -d

# Wait for services to start
echo ""
echo "Waiting 20 seconds for services to start..."
sleep 20

# Show status
echo ""
echo "================================================"
echo "  Status"
echo "================================================"
docker-compose ps

echo ""
echo "================================================"
echo "  ✅ SETUP COMPLETE"
echo "================================================"
echo ""
echo "  Frontend:      http://localhost:3000"
echo "  API Gateway:   http://localhost:80"
echo "  Auth Service:  http://localhost:3001/health"
echo ""
echo "  To view logs:  docker-compose logs -f"
echo "  To stop:       docker-compose down"
echo ""
```

### `setup.bat` (Windows)
```batch
@echo off
echo.
echo ================================================
echo   Healthcare Platform - Team Setup
echo ================================================
echo.

docker info >nul 2>&1
if errorlevel 1 (
  echo ERROR: Docker Desktop is not running!
  echo Please start Docker Desktop first.
  pause
  exit /b 1
)
echo Docker is running

echo.
echo Setting up environment files...

for %%s in (auth-service patient-service doctor-service appointment-service payment-service notification-service telemedicine-service ai-service) do (
  if not exist "services\%%s\.env" (
    copy "services\%%s\.env.example" "services\%%s\.env" >nul
    echo   Created: services\%%s\.env
  ) else (
    echo   Skipped: services\%%s\.env already exists
  )
)

echo.
echo Building and starting all services...
echo First time takes 5-10 minutes. Please wait...
echo.
docker-compose --profile full up --build -d

echo.
echo Waiting for services to start...
timeout /t 20 /nobreak >nul

echo.
echo ================================================
docker-compose ps
echo ================================================
echo.
echo   Frontend:     http://localhost:3000
echo   API Gateway:  http://localhost:80
echo.
pause
```

Make setup.sh executable:
```bash
chmod +x setup.sh
```

---

## Step 10 — Create `docker-compose.yml`

Create this file in the root folder.

> IMPORTANT: This version uses **profiles** so each member runs
> only their own service instead of all 8 at once.
> Each service lists which profiles it belongs to.

```yaml
version: '3.8'

services:

  # ── API GATEWAY ──────────────────────────────────────
  nginx:
    image: nginx:1.25-alpine
    container_name: api-gateway
    ports:
      - "80:80"
    volumes:
      - ./api-gateway/nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - frontend

  # ── AUTH SERVICE ─────────────────────────────────────
  auth-service:
    build:
      context: ./services/auth-service
      dockerfile: Dockerfile.dev
    container_name: auth-service
    ports:
      - "3001:3001"
    env_file:
      - ./services/auth-service/.env
    volumes:
      - ./services/auth-service:/app
      - auth_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - auth
      - frontend

  # ── PATIENT SERVICE ───────────────────────────────────
  patient-service:
    build:
      context: ./services/patient-service
      dockerfile: Dockerfile.dev
    container_name: patient-service
    ports:
      - "3002:3002"
    env_file:
      - ./services/patient-service/.env
    volumes:
      - ./services/patient-service:/app
      - patient_modules:/app/node_modules
      - patient_uploads:/app/uploads
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - patient
      - frontend

  # ── DOCTOR SERVICE ────────────────────────────────────
  doctor-service:
    build:
      context: ./services/doctor-service
      dockerfile: Dockerfile.dev
    container_name: doctor-service
    ports:
      - "3003:3003"
    env_file:
      - ./services/doctor-service/.env
    volumes:
      - ./services/doctor-service:/app
      - doctor_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - doctor
      - appointment
      - frontend

  # ── APPOINTMENT SERVICE ───────────────────────────────
  appointment-service:
    build:
      context: ./services/appointment-service
      dockerfile: Dockerfile.dev
    container_name: appointment-service
    ports:
      - "3004:3004"
    env_file:
      - ./services/appointment-service/.env
    volumes:
      - ./services/appointment-service:/app
      - appointment_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - appointment
      - frontend

  # ── PAYMENT SERVICE ───────────────────────────────────
  payment-service:
    build:
      context: ./services/payment-service
      dockerfile: Dockerfile.dev
    container_name: payment-service
    ports:
      - "3005:3005"
    env_file:
      - ./services/payment-service/.env
    volumes:
      - ./services/payment-service:/app
      - payment_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - payment
      - frontend

  # ── NOTIFICATION SERVICE ──────────────────────────────
  notification-service:
    build:
      context: ./services/notification-service
      dockerfile: Dockerfile.dev
    container_name: notification-service
    ports:
      - "3006:3006"
    env_file:
      - ./services/notification-service/.env
    volumes:
      - ./services/notification-service:/app
      - notification_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - notification
      - appointment

  # ── TELEMEDICINE SERVICE ──────────────────────────────
  telemedicine-service:
    build:
      context: ./services/telemedicine-service
      dockerfile: Dockerfile.dev
    container_name: telemedicine-service
    ports:
      - "3007:3007"
    env_file:
      - ./services/telemedicine-service/.env
    volumes:
      - ./services/telemedicine-service:/app
      - telemedicine_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - telemedicine
      - frontend

  # ── AI SERVICE ────────────────────────────────────────
  ai-service:
    build:
      context: ./services/ai-service
      dockerfile: Dockerfile.dev
    container_name: ai-service
    ports:
      - "3008:3008"
    env_file:
      - ./services/ai-service/.env
    volumes:
      - ./services/ai-service:/app
      - ai_modules:/app/node_modules
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - ai
      - frontend

  # ── FRONTEND ──────────────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
      - frontend_modules:/app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:80
      - CHOKIDAR_USEPOLLING=true
      - WDS_SOCKET_PORT=0
    networks:
      - healthcare-net
    restart: unless-stopped
    profiles:
      - full
      - frontend

volumes:
  auth_modules:
  patient_modules:
  doctor_modules:
  appointment_modules:
  payment_modules:
  notification_modules:
  telemedicine_modules:
  ai_modules:
  frontend_modules:
  patient_uploads:

networks:
  healthcare-net:
    driver: bridge
```

### Profile Summary

```
Profile         Starts these services
─────────────────────────────────────────────────────────────────
auth            auth-service only
patient         patient-service only
doctor          doctor-service only
appointment     appointment-service + doctor + notification
payment         payment-service only
notification    notification-service only
telemedicine    telemedicine-service only
ai              ai-service only
frontend        ALL services + nginx (for full UI testing)
full            ALL services (for final integration testing)
```

## Step 11 — Test Everything on YOUR Machine

```bash
# Make sure Docker Desktop is running

# Step 1 — Run setup script (this builds and starts ALL services using --profile full)
./setup.sh        # Mac/Linux
setup.bat         # Windows

# Step 2 — Watch the logs to see all services starting
docker-compose logs -f

# Step 3 — In a NEW terminal, test every service health
curl http://localhost:3001/health   # must return {"status":"ok","service":"auth-service"}
curl http://localhost:3002/health   # must return {"status":"ok","service":"patient-service"}
curl http://localhost:3003/health   # must return {"status":"ok","service":"doctor-service"}
curl http://localhost:3004/health   # must return {"status":"ok","service":"appointment-service"}
curl http://localhost:3005/health   # must return {"status":"ok","service":"payment-service"}
curl http://localhost:3006/health   # must return {"status":"ok","service":"notification-service"}
curl http://localhost:3007/health   # must return {"status":"ok","service":"telemedicine-service"}
curl http://localhost:3008/health   # must return {"status":"ok","service":"ai-service"}

# Step 4 — Open browser and check frontend
# http://localhost:3000
# Should show default React app

# Step 5 — If everything passes, stop all services
docker-compose down

# Step 6 — Test that profiles work correctly
docker-compose --profile auth up --build
# Should start ONLY auth-service
# Press Ctrl+C to stop

# If everything works — move to Step 12
# If something fails — check logs:
docker-compose logs auth-service
docker-compose logs patient-service
# etc.
```

---

## Step 12 — Push to GitHub

```bash
# Make sure you are in the root folder
cd healthcare-platform

# Initialize git
git init

# Stage everything
git add .

# Check what will be committed
# Make sure .env files are NOT listed
git status

# Commit
git commit -m "initial: complete project skeleton with Docker and Kubernetes setup"

# Connect to GitHub repo
git remote add origin https://github.com/your-team/healthcare-platform.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 13 — Share with Teammates

Send this message to your team group chat:

```
Project is ready! Here is what to do:

1. Install Docker Desktop: https://docker.com/products/docker-desktop
2. Install Git: https://git-scm.com
3. Clone the repo: git clone https://github.com/our-team/healthcare-platform.git
4. Go into folder: cd healthcare-platform
5. Mac/Linux: chmod +x setup.sh && ./setup.sh
   Windows:   setup.bat
6. Wait 5-10 minutes for first build
7. Open http://localhost:3000

Then read INSTRUCTIONS.md for your daily workflow.

I will share the real .env values (MongoDB Atlas, API keys) separately on WhatsApp.
DO NOT put real values in the .env.example files.
```

Share real `.env` values PRIVATELY via WhatsApp or Discord — never via GitHub.

---

---

# PART 2 — OTHER MEMBERS (2, 3, 4) ONBOARDING

> Do this ONCE when you first join the project.

---

## Step 1 — Install Prerequisites

```bash
# Install these tools:
# 1. Docker Desktop → https://docker.com/products/docker-desktop
#    IMPORTANT: Open Docker Desktop and wait for it to fully load
#    The whale icon in the taskbar must be STILL (not animated)

# 2. Git → https://git-scm.com

# 3. VS Code → https://code.visualstudio.com

# 4. Node.js 18+ → https://nodejs.org (optional but useful)

# Verify
docker --version
git --version
```

---

## Step 2 — Clone Repository

```bash
# Clone the project
git clone https://github.com/your-team/healthcare-platform.git

# Go into the project folder
cd healthcare-platform
```

---

## Step 3 — Add Real Values to `.env` Files

The setup script will copy `.env.example` to `.env`.
After running the script, open YOUR service's `.env` file
and replace placeholder values with real ones from the team chat.

```
services/your-service/.env

# Replace:
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@...
# With the real Atlas connection string from Member 1
```

---

## Step 4 — Run Setup Script

```bash
# Mac/Linux
chmod +x setup.sh
./setup.sh

# Windows — double click setup.bat OR run in terminal:
setup.bat

# This will:
# 1. Copy all .env.example files to .env
# 2. Build all Docker images using --profile full (takes 5-10 min first time)
# 3. Start ALL services so you can verify everything works
# 4. Show status
# After first run, use profiles for daily work (see Part 3)
```

---

## Step 5 — Verify Everything Works

```bash
# Check all services are running (setup script started all of them)
docker-compose ps

# All services should show "Up"
# If any show "Exit" or "Restarting" — check logs:
docker-compose logs service-name-here

# Test ALL health endpoints to confirm everything built correctly
curl http://localhost:3001/health   # auth        → {"status":"ok"}
curl http://localhost:3002/health   # patient     → {"status":"ok"}
curl http://localhost:3003/health   # doctor      → {"status":"ok"}
curl http://localhost:3004/health   # appointment → {"status":"ok"}
curl http://localhost:3005/health   # payment     → {"status":"ok"}
curl http://localhost:3006/health   # notification→ {"status":"ok"}
curl http://localhost:3007/health   # telemedicine→ {"status":"ok"}
curl http://localhost:3008/health   # ai          → {"status":"ok"}

# Open frontend in browser
# http://localhost:3000
# Should show default React page

# Once verified — stop everything
docker-compose down

# From now on use profiles for daily work (see Part 3)
# You only need YOUR service running while developing
```

---

## Step 6 — Create Your Branch and Start Coding

```bash
# Member 2 — Patient + Doctor Service
git checkout -b feature/patient-doctor-service

# Member 3 — Appointment + Payment + Notification
git checkout -b feature/appointment-payment-notification

# Member 4 — Frontend + Telemedicine + AI
git checkout -b feature/frontend-telemedicine-ai

# Open your assigned folders in VS Code
# Member 2:
code services/patient-service
code services/doctor-service

# Member 3:
code services/appointment-service
code services/payment-service
code services/notification-service

# Member 4:
code frontend
code services/telemedicine-service
code services/ai-service

# Now start ONLY your assigned service
# Member 1:
docker-compose --profile auth up

# Member 2:
docker-compose --profile patient up       # or --profile doctor

# Member 3:
docker-compose --profile appointment up   # or --profile payment

# Member 4:
docker-compose --profile frontend up      # or --profile ai
```

---

---

# PART 3 — DAILY WORKFLOW (ALL MEMBERS)

---

## Morning Routine

```bash
# 1. Open Docker Desktop and wait for it to load fully

# 2. Pull latest code from GitHub
git pull origin main

# 3. Start ONLY your assigned service
# Member 1
docker-compose --profile auth up

# Member 2 (pick one)
docker-compose --profile patient up
docker-compose --profile doctor up

# Member 3 (pick one)
docker-compose --profile appointment up
docker-compose --profile payment up
docker-compose --profile notification up

# Member 4 (pick one)
docker-compose --profile frontend up
docker-compose --profile telemedicine up
docker-compose --profile ai up

# 4. If new packages were added to your service since last pull
docker-compose --profile your-profile up --build

# 5. Verify your service is running
docker-compose ps
docker-compose logs -f your-service-name
```

---

## During Development

```bash
# View logs from your service only (live)
docker-compose logs -f auth-service
docker-compose logs -f patient-service
docker-compose logs -f doctor-service

# Restart your service (if it crashed)
docker-compose restart patient-service

# Open shell inside your container for debugging
docker-compose exec patient-service sh

# Inside shell you can run:
ls                          # see files
cat index.js                # see file content
node -e "console.log(1+1)"  # run node commands
exit                        # exit shell

# Test your endpoints with curl
curl http://localhost:3002/health
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## When You Add a New NPM Package

```bash
# Step 1 — Install on your local machine (updates package.json)
cd services/patient-service
npm install some-package

# Step 2 — Rebuild just your service using your profile
cd ../..
docker-compose --profile patient up --build

# OR rebuild the single service directly
docker-compose up --build patient-service

# Step 3 — Tell your teammates in group chat:
# "I added 'some-package' to patient-service.
#  Run: docker-compose up --build patient-service"
```

---

## End of Day

```bash
# Save your work to GitHub

# See what files you changed
git status

# Stage only your service files (not others)
git add services/patient-service/

# Or stage specific files
git add services/patient-service/src/controllers/patientController.js
git add services/patient-service/src/models/Patient.js

# Commit with a clear message
git commit -m "feat: add patient profile update endpoint"
git commit -m "feat: add medical report upload"
git commit -m "fix: fix JWT token not being read correctly"
git commit -m "docs: add comments to patient model"

# Push to your branch
git push origin feature/patient-doctor-service

# Stop containers to free memory overnight (optional)
docker-compose down
```

---

## Common Commands Reference

```bash
# ─── PROFILE COMMANDS (recommended) ─────────────────
docker-compose --profile auth up             # Member 1 — auth only
docker-compose --profile patient up          # Member 2 — patient only
docker-compose --profile doctor up           # Member 2 — doctor only
docker-compose --profile appointment up      # Member 3 — appointment + doctor + notification
docker-compose --profile payment up          # Member 3 — payment only
docker-compose --profile notification up     # Member 3 — notification only
docker-compose --profile telemedicine up     # Member 4 — telemedicine only
docker-compose --profile ai up               # Member 4 — ai only
docker-compose --profile frontend up         # Member 4 — all services for UI testing
docker-compose --profile full up             # Everyone — final integration test

# ─── SINGLE SERVICE (alternative to profiles) ────────
docker-compose up auth-service               # run one service
docker-compose up patient-service auth-service  # run two services

# ─── REBUILD ─────────────────────────────────────────
docker-compose --profile auth up --build     # rebuild your profile
docker-compose up --build auth-service       # rebuild one service only

# ─── STOP ────────────────────────────────────────────
docker-compose down                          # stop all running services
docker-compose stop auth-service             # stop one service only
docker-compose down -v                       # stop all + delete data volumes

# ─── LOGS ────────────────────────────────────────────
docker-compose logs -f auth-service          # one service live logs
docker-compose logs --tail=50 auth-service   # last 50 lines

# ─── STATUS ──────────────────────────────────────────
docker-compose ps                            # see all running services
docker stats                                 # see CPU and memory usage

# ─── DEBUGGING ───────────────────────────────────────
docker-compose exec auth-service sh          # shell into container
docker-compose restart auth-service          # restart one service

# ─── NUCLEAR OPTION (when everything is broken) ──────
docker-compose down -v                       # stop + delete all volumes
docker system prune -f                       # remove unused Docker data
docker-compose --profile full up --build     # rebuild everything fresh
```

---

---

# PART 4 — SERVICE DEVELOPMENT GUIDE

---

## How to Add a Route (Step by Step Example)

Using patient-service as example.

### 1. Create the Model

`services/patient-service/src/models/Patient.js`
```javascript
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId:      { type: String, required: true, unique: true },
  dateOfBirth: Date,
  gender:      { type: String, enum: ['male', 'female', 'other'] },
  phone:       String,
  address:     String,
  bloodGroup:  String,
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
```

### 2. Create the Controller

`services/patient-service/src/controllers/patientController.js`
```javascript
const Patient = require('../models/Patient');

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Patient.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const profile = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### 3. Create the Routes

`services/patient-service/src/routes/patientRoutes.js`
```javascript
const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/patientController');

router.get('/me',  protect, authorize('patient'), ctrl.getMyProfile);
router.put('/me',  protect, authorize('patient'), ctrl.upsertProfile);

module.exports = router;
```

### 4. Register Routes in index.js

Open `services/patient-service/index.js` and uncomment this line:
```javascript
// Before
// app.use('/api/patients', require('./src/routes/patientRoutes'));

// After
app.use('/api/patients', require('./src/routes/patientRoutes'));
```

### 5. Test Your New Route

Changes auto-reload via nodemon. No restart needed.

```bash
# First login to get a token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@test.com","password":"123456"}'

# Copy the token from response, then test your new route
curl http://localhost:3002/api/patients/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## How to Test Your Service

Use Postman (recommended) or curl.

```
Postman Setup:
1. Download Postman: https://postman.com
2. Create a new Collection called "Healthcare Platform"
3. Create folders: Auth, Patient, Doctor, Appointment, Payment
4. Add requests to each folder

For protected routes:
1. First run POST http://localhost:3001/api/auth/login
2. Copy the token from response
3. In your request → Authorization tab → Bearer Token → paste token
```

---

---

# PART 5 — COLLABORATION RULES

---

## Code Rules

```
1. Each service only touches its own database
   Patient service → patient-db only
   Doctor service  → doctor-db only

2. To get data from another service, use HTTP calls
   appointment-service calling doctor-service:
   const res = await axios.get('http://doctor-service:3003/api/doctors/' + id)

3. Never use localhost inside service code
   ❌ http://localhost:3003
   ✅ http://doctor-service:3003
   (localhost does not work inside Docker containers)

4. Always keep /health endpoint working
   Docker uses it to check if your service is alive

5. Always use exact package versions in package.json
   ❌ "express": "^4.18.2"   (^ means any compatible version)
   ✅ "express": "4.18.2"    (exact version, same for everyone)

6. Use JWT_SECRET from .env, never hardcode it
   ❌ jwt.verify(token, 'mysecret')
   ✅ jwt.verify(token, process.env.JWT_SECRET)
```

---

# PART 6 — KUBERNETES DEMO (FINAL WEEK)

> Only do this in the final week when all services are working.

---

## Step 1 — Enable Kubernetes in Docker Desktop

```
Docker Desktop → Settings → Kubernetes
→ tick "Enable Kubernetes"
→ click "Apply & Restart"
→ wait 3-5 minutes

Verify:
kubectl config use-context docker-desktop
kubectl get nodes
# Must show: docker-desktop   Ready
```

---

## Step 2 — Update `.env` Values in `k8s/secrets.yaml`

Open `k8s/secrets.yaml` and replace all placeholder values with real ones.

---

## Step 3 — Build All Docker Images

```bash
# Run from root folder
docker build -t auth-service:latest          ./services/auth-service
docker build -t patient-service:latest       ./services/patient-service
docker build -t doctor-service:latest        ./services/doctor-service
docker build -t appointment-service:latest   ./services/appointment-service
docker build -t payment-service:latest       ./services/payment-service
docker build -t notification-service:latest  ./services/notification-service
docker build -t telemedicine-service:latest  ./services/telemedicine-service
docker build -t ai-service:latest            ./services/ai-service
docker build -t healthcare-frontend:latest   ./frontend

# Verify all images exist
docker images
```

---

## Step 4 — Deploy to Kubernetes

```bash
# Apply in this exact order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/services/
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Watch pods start (takes 1-2 minutes)
kubectl get pods -n healthcare -w

# Wait until ALL pods show "Running"
# Press Ctrl+C to stop watching when done
```

---

## Step 5 — Add Host Entry for Local Domain

```bash
# Get your machine's localhost IP
# It is always 127.0.0.1

# Add to hosts file:

# Windows: Open Notepad as Administrator
# File → Open → C:\Windows\System32\drivers\etc\hosts
# Add this line at the bottom:
127.0.0.1  healthcare.local

# Mac/Linux: Run in terminal:
echo "127.0.0.1 healthcare.local" | sudo tee -a /etc/hosts
```

---

## Step 6 — Access the Application

```bash
# Forward port to access from browser
kubectl port-forward service/frontend 8080:80 -n healthcare

# Open browser:
# http://healthcare.local:8080
# OR
# http://localhost:8080
```

---

## Useful Kubernetes Debug Commands

```bash
# See all pods and their status
kubectl get pods -n healthcare

# See why a pod is failing
kubectl describe pod pod-name-here -n healthcare

# See logs from a pod
kubectl logs pod-name-here -n healthcare

# See live logs
kubectl logs -f pod-name-here -n healthcare

# Restart a deployment
kubectl rollout restart deployment/auth-service -n healthcare

# Delete everything and redeploy
kubectl delete namespace healthcare
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/services/
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

---

---

# PART 7 — TROUBLESHOOTING

---

## Service keeps restarting or shows Exit

```bash
# Check the logs immediately
docker-compose logs service-name

# Most common causes:
# 1. MONGO_URI is wrong in .env file
#    Fix: Check Atlas connection string, replace USERNAME and PASSWORD

# 2. PORT not set in .env
#    Fix: Make sure PORT=3001 is in the .env file

# 3. Syntax error in your JavaScript
#    Fix: Read the logs, it shows the error line number

# 4. Missing dependency
#    Fix: Run docker-compose up --build service-name
```

---

## Cannot connect to MongoDB Atlas

```bash
# 1. Check your Atlas IP whitelist
#    Atlas → Network Access → Add IP → 0.0.0.0/0 (allow all)

# 2. Check connection string format
#    Must be: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname
#    NOT:     mongodb://localhost:27017/dbname

# 3. Check for special characters in password
#    If password has @, !, #, etc. they must be URL-encoded
#    Use a simple password without special characters
```

---

## Code changes not reflecting

```bash
# Check volume mount is working
docker-compose exec your-service sh
cat index.js    # should show your latest code

# If it shows old code, rebuild
docker-compose up --build your-service

# On Windows, if live reload not working, make sure these are in docker-compose.yml
# environment:
#   - CHOKIDAR_USEPOLLING=true
```

---

## Port already in use

```bash
# Find what is using the port (Mac/Linux)
lsof -i :3001

# Find what is using the port (Windows)
netstat -ano | findstr :3001

# Kill the process using the port
# OR change the port in docker-compose.yml
```

---

## node_modules errors / Module not found

```bash
# Nuclear fix — removes all volumes and rebuilds clean
docker-compose down -v
docker-compose up --build

# This deletes all node_modules volumes and reinstalls fresh
# Takes 5-10 minutes
```

---

## Wrong service URL inside container

```bash
# WRONG — localhost does not work inside Docker
http://localhost:3003/api/doctors

# CORRECT — use container name as hostname
http://doctor-service:3003/api/doctors

# Check your .env files
# DOCTOR_SERVICE_URL=http://doctor-service:3003   ✅
# DOCTOR_SERVICE_URL=http://localhost:3003         ❌
```

---

## Git — accidentally committed .env file

```bash
# Remove from Git tracking (keeps file on disk)
git rm --cached services/auth-service/.env
git commit -m "fix: remove .env from tracking"
git push

# Make sure .gitignore has **/.env
# Never commit .env again
```

---

## Complete Fresh Start (when everything is broken)

```bash
# Stop and remove everything
docker-compose down -v
docker system prune -f

# Pull latest code
git pull origin main

# Rebuild everything with full profile
docker-compose --profile full up --build

# Once verified working, go back to your profile
docker-compose down
docker-compose --profile your-profile up
```

---

## Profile Quick Reference

```
MEMBER 1   →   docker-compose --profile auth up
MEMBER 2   →   docker-compose --profile patient up
               docker-compose --profile doctor up
MEMBER 3   →   docker-compose --profile appointment up
               docker-compose --profile payment up
               docker-compose --profile notification up
MEMBER 4   →   docker-compose --profile frontend up
               docker-compose --profile telemedicine up
               docker-compose --profile ai up
EVERYONE   →   docker-compose --profile full up
```

---

## Quick Health Check (run this to verify all services)

```bash
echo "Checking all services..."
curl -s http://localhost:3001/health && echo " ✅ auth-service OK"
curl -s http://localhost:3002/health && echo " ✅ patient-service OK"
curl -s http://localhost:3003/health && echo " ✅ doctor-service OK"
curl -s http://localhost:3004/health && echo " ✅ appointment-service OK"
curl -s http://localhost:3005/health && echo " ✅ payment-service OK"
curl -s http://localhost:3006/health && echo " ✅ notification-service OK"
curl -s http://localhost:3007/health && echo " ✅ telemedicine-service OK"
curl -s http://localhost:3008/health && echo " ✅ ai-service OK"
echo "Done!"
```

---

*End of Instructions*
*Last updated: 2026 — Healthcare Platform Team*