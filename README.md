# 🚆 RailFlow — AI-Powered Automatic Block Planning for Indian Railways

> **An intelligent decision-support system for optimizing railway maintenance block planning using Machine Learning and Constraint Programming.**

RailFlow is an AI-powered platform designed to optimize maintenance block planning for Indian Railways by coordinating **maintenance activities, asset health, train schedules, corridor availability, and operational resources**.

The system combines **XGBoost, LightGBM, Google OR-Tools CP-SAT, FastAPI, PostgreSQL, and React** to generate data-driven maintenance block recommendations while considering train delays, priority trains, task consolidation, resource utilization, and asset downtime.

---

## 🎯 Problem Statement

### Smart India Hackathon — Problem Statement ID: 26027

**AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways**

Railway maintenance activities are often planned independently across different departments such as:

* Engineering
* Signal & Telecommunication (S&T)
* Traction / OHE
* Operations

This decentralized planning can result in:

* Under-utilization of available maintenance blocks
* Conflicting maintenance requests
* Unnecessary train delays
* Poor coordination between departments
* Difficulty identifying optimal maintenance windows
* Increased asset downtime

### RailFlow's Approach

RailFlow provides a centralized intelligent planning platform that:

1. Collects maintenance and asset information.
2. Predicts asset failure risk using Machine Learning.
3. Calculates maintenance priority.
4. Analyzes train schedules and corridor gaps.
5. Generates feasible maintenance windows.
6. Optimizes block allocation using CP-SAT.
7. Ranks candidate windows using ML models.
8. Simulates downstream delay impacts.
9. Supports emergency replanning.
10. Keeps the final decision under human control.

---

# 💡 Solution Overview

```text
Maintenance & Asset Data
          │
          ▼
   Risk Prediction
     XGBoost Model
          │
          ▼
   Priority Calculation
          │
          ▼
Train Schedule & Corridor Analysis
          │
          ▼
 Available Block Windows
          │
          ▼
     CP-SAT Solver
          │
          ▼
 Candidate Block Plans
          │
          ▼
LightGBM + XGBoost Ranking
          │
          ▼
 Delay & Impact Analysis
          │
          ▼
 Human Approval
          │
          ▼
 Decision & Audit Log
```

The objective is to transform manual and decentralized block planning into a **data-driven, constraint-aware decision-support process**.

---

# 🚀 Key Features

## 1. AI-Based Asset Failure Risk Prediction

RailFlow uses an **XGBoost classifier** to calculate failure risk for railway assets and maintenance tasks.

The model uses features such as:

* Asset age
* Asset criticality
* Days since last maintenance
* Historical failure information
* Traffic density
* Inspection history
* Overdue maintenance
* Defect severity
* Asset type
* Department
* Route / section

### Risk Output

```text
Risk Score
Risk Band
Probability
Priority Factors
```

Risk bands:

```text
Low
Medium
High
Critical
```

The risk score is calculated dynamically through the backend rather than being stored as a fixed frontend value.

---

# 📊 2. ML-Based Block Plan Ranking

RailFlow uses two ML models for candidate block-window evaluation:

### LightGBM

Used as a candidate suitability/ranking model.

### XGBoost

Used as a comparison ranking model.

Candidate evaluation considers:

* Number of consolidatable tasks
* Total maintenance duration
* Average task priority
* Available corridor gap
* Traffic density
* Time of day
* Priority train conflicts
* Resource availability

The model outputs are incorporated into the candidate evaluation process.

---

# 🧮 3. CP-SAT Block Optimization

RailFlow uses **Google OR-Tools CP-SAT** to generate feasible maintenance block windows.

The optimizer considers:

* Maintenance task duration
* Available corridor gaps
* Train movements
* Safety buffers
* Task compatibility
* Train delay
* Priority train protection
* Task consolidation
* Resource utilization
* Asset downtime

### Optimization Objectives

```text
Train Delay Minimization
Priority Train Protection
Task Consolidation
Resource Utilization
Asset Downtime Minimization
```

Optimization weights can be adjusted to support different planning scenarios.

The system generates candidate windows such as:

```text
OPTION_A
OPTION_B
OPTION_C
EMERGENCY_REPLAN
```

---

# 🚨 4. Emergency Replanning

RailFlow provides an emergency replanning workflow for urgent maintenance requirements.

The system can:

1. Identify the affected railway section.
2. Analyze upcoming train movements.
3. Identify available short-term corridor windows.
4. Apply emergency planning constraints.
5. Run the optimization process.
6. Generate a feasible emergency candidate.

This helps support faster operational decision-making during unexpected maintenance situations.

---

# 🔄 5. What-If Scenario Analysis

RailFlow allows planners to evaluate alternative operational scenarios.

Examples include:

* Changing traffic intensity
* Changing block duration
* Protecting priority trains
* Adjusting optimization weights

The backend recalculates the scenario instead of relying on static frontend calculations.

---

# 📈 6. Delay Cascade Analysis

A maintenance block can affect multiple downstream trains.

RailFlow analyzes potential operational impact through a delay cascade:

```text
Primary Delay
      ↓
Affected Train
      ↓
Downstream Train
      ↓
Cascade Delay
      ↓
Total Operational Impact
```

This allows planners to understand the broader operational consequences of a proposed maintenance block.

---

# 👥 7. Human-in-the-Loop Decision Support

RailFlow is designed as a **decision-support system**.

The platform provides:

* Recommended block windows
* Constraint analysis
* Estimated delays
* Priority train impact
* Resource feasibility
* Optimization rationale

The final maintenance-block decision remains with the authorized human controller.

Approved decisions can be recorded in the decision history for auditability.

---

# 🗄️ System Architecture

```text
                    ┌───────────────────────┐
                    │    React Frontend     │
                    │       RailFlow        │
                    └───────────┬───────────┘
                                │
                           REST API
                                │
                                ▼
                    ┌───────────────────────┐
                    │       FastAPI         │
                    │      Backend API      │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ PostgreSQL   │  │ ML Pipeline  │  │ CP-SAT       │
      │   Database   │  │ XGB + LGBM   │  │ Optimizer    │
      └──────────────┘  └──────────────┘  └──────────────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │ Candidate Block Plans │
                    │ Risk & Impact Analysis│
                    └───────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* REST API
* HTML / CSS

## Backend

* Python
* FastAPI
* SQLAlchemy 2.0
* Pydantic
* Uvicorn

## Database

* PostgreSQL

## Machine Learning

* XGBoost
* LightGBM
* Scikit-learn
* Pandas
* NumPy
* Joblib

## Optimization

* Google OR-Tools
* CP-SAT

## Authentication

* JWT
* Python-Jose
* Passlib
* Bcrypt

## Deployment

* Docker
* Docker Compose

---

# 📁 Project Structure

```text
RailFlow/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── seed.py
│   │
│   ├── ml/
│   │   ├── trainer.py
│   │   └── predictor.py
│   │
│   └── optimizer/
│       ├── cp_sat_solver.py
│       └── scenarios.py
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   ├── api.ts
│   │   └── optimizationService.ts
│   ├── store/
│   └── data/
│
├── data/
│   ├── train_enhanced_schedule_for_ml.csv
│   ├── train_block_assignments.csv
│   └── train_block_gaps_analysis.csv
│
├── models/
│   ├── failure_risk_xgb.pkl
│   ├── block_plan_ranker_lgbm.pkl
│   └── block_plan_ranker_xgb.pkl
│
├── docker-compose.yml
├── requirements.txt
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Install the following:

* Git
* Docker Desktop
* Node.js 18+
* npm

Python is required if backend components are run outside Docker.

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

---

## 2. Configure Environment Variables

Create a `.env` file using `.env.example`.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
DATABASE_URL=postgresql://postgres:postgres@db:5432/railflow
```

> Do not commit real credentials, API keys, or secrets to GitHub.

---

## 3. Start PostgreSQL and FastAPI

Run:

```bash
docker-compose up -d --build
```

Check the running services:

```bash
docker-compose ps
```

---

## 4. Seed the Database

Run:

```bash
docker-compose exec api python seed.py
```

This initializes the PostgreSQL database with the required RailFlow entities and train schedule data.

---

## 5. Train the ML Models

If the models have not already been generated:

```bash
docker-compose exec api python ml/trainer.py
```

The trained models are persisted and loaded by the backend.

---

## 6. Start the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🌐 Local Services

| Service              | URL                         |
| -------------------- | --------------------------- |
| 🚆 RailFlow Frontend | http://localhost:5173       |
| ⚙️ FastAPI Backend   | http://localhost:8000       |
| 📚 Swagger API Docs  | http://localhost:8000/docs  |
| 📖 ReDoc             | http://localhost:8000/redoc |

---

# 🔌 API Endpoints

## Core Data

```http
GET /stations
GET /sections
GET /sections/{id}
GET /assets
GET /tasks
GET /trains
GET /resources
GET /decisions
GET /data-quality
```

## Optimization

```http
POST /optimizer/generate-candidates
POST /optimizer/what-if
POST /optimizer/emergency-replan
```

## Activity Register

```http
POST /activities
GET /activities
PATCH /activities/{id}
```

## Authentication

```http
POST /auth/register
POST /auth/login
```

## Machine Learning

```http
POST /ml/retrain
```

---

# 🧪 Verification

The backend can be tested through the FastAPI Swagger interface:

```text
http://localhost:8000/docs
```

### Dynamic Risk Verification

Modify an underlying asset or maintenance-task value and verify that the calculated risk score changes.

### Optimization Verification

Run:

```text
POST /optimizer/generate-candidates
```

with different optimization weights and verify that the candidate results and impact scores are recalculated.

### What-If Verification

Change scenario parameters such as traffic multiplier or block duration and verify that a new scenario result is generated.

### Emergency Replanning Verification

Trigger:

```text
POST /optimizer/emergency-replan
```

and verify that the backend generates an emergency candidate based on the current operational data.

---

# 🔐 Authentication & Roles

RailFlow supports role-based authentication for railway operational departments.

Supported roles include:

```text
Engineering
S&T
Traction/OHE
Operations
Admin
```

JWT authentication is used for protected API operations.

For production deployment:

* Use strong database credentials.
* Use a secure JWT secret.
* Enable HTTPS.
* Configure production CORS origins.
* Store secrets using environment variables or a secret manager.
* Never expose development credentials publicly.

---

# 📊 Data Sources

RailFlow uses multiple data sources for its prototype environment.

### Frontend Seed Data

Existing RailFlow entities are retained to preserve the application's frontend compatibility and demonstration narrative.

### Train Schedule Data

Train timetable, block assignment, and corridor-gap CSV data are used to support train movement and block-window analysis.

### ML Training Data

Where historical asset failure outcomes are unavailable, synthetic domain-realistic training data is used for the initial ML models.

This provides a complete working ML pipeline while allowing future integration with real operational datasets.

---

# 🧠 ML & Optimization Pipeline

```text
Asset / Maintenance Data
          │
          ▼
   Feature Engineering
          │
          ▼
 XGBoost Failure Risk
          │
          ▼
 Risk Score + Probability
          │
          ▼
 Priority Calculation
          │
          ▼
 Candidate Block Windows
          │
          ▼
LightGBM + XGBoost Ranking
          │
          ▼
   CP-SAT Optimization
          │
          ▼
 Final Candidate Windows
          │
          ▼
 Delay & Impact Analysis
```

---

# 📌 Real-Time Computation

RailFlow is designed to replace static frontend mock calculations with backend-driven computation.

The following values are calculated from the current system state:

* Failure risk
* Maintenance priority
* Candidate windows
* Impact scores
* Delay estimates
* Scenario results
* Optimization results

The architecture allows changes in underlying data to be reflected in subsequent API requests.

---

# 🎯 Expected Benefits

RailFlow is designed to support:

* Better utilization of maintenance blocks
* Improved coordination between railway departments
* Reduced avoidable train delays
* Protection of priority trains
* Consolidation of compatible maintenance activities
* Improved asset availability
* Data-driven maintenance planning
* Transparent decision support
* Faster emergency replanning
* Auditable operational decisions

---

# 🔮 Future Enhancements

Future versions of RailFlow can incorporate:

* Live railway operational data
* Real-time train movement feeds
* Real asset telemetry
* Historical failure datasets
* Online ML retraining
* Advanced explainable AI
* Digital twin integration
* Real-time delay prediction
* Advanced delay-cascade forecasting
* Mobile controller interface
* Cloud deployment
* Integration with railway enterprise systems

---

# 👥 Human-in-the-Loop Design

RailFlow is designed to **assist railway decision-makers rather than replace them**.

The AI and optimization engines provide recommendations, simulations, and supporting analysis.

The authorized railway controller remains responsible for reviewing and approving the final maintenance block decision.

---

# 🏆 Project Information

**Project:** RailFlow

**Hackathon:** Smart India Hackathon

**Problem Statement ID:** 26027

**Domain:** Indian Railways

**Focus:** AI-Powered Automatic Block Planning

**Core Technologies:** Machine Learning + Constraint Programming + Full-Stack Development

---

# 👨‍💻 Team

### RailFlow Development Team

Built with:

```text
Artificial Intelligence
Machine Learning
Operations Research
Constraint Programming
Data Engineering
Backend Engineering
Frontend Development
```

---

# 📄 License

This project is developed for educational, research, and hackathon purposes.

Add an appropriate open-source license if the project is intended for public redistribution.

---

# ⭐ Acknowledgements

* Smart India Hackathon
* Indian Railways domain and operational concepts
* Google OR-Tools
* XGBoost
* LightGBM
* FastAPI
* PostgreSQL
* React
* Scikit-learn

---

## 🚆 RailFlow

> **From maintenance requests to optimized railway blocks — powered by AI, optimization, and human decision-making.**

# 🎥 Demo & Screenshots

## 🌐 Live Demo

Experience the RailFlow platform:

> 🚆 **Live Demo:** `https://rail-one-iota.vercel.app`

> 📚 **API Documentation:** `YOUR_BACKEND_URL/docs`

> 💻 **GitHub Repository:** `[YOUR_GITHUB_REPOSITORY_URL](https://github.com/paulnehemiah-a/RailFlow)`

> 🎬 **Demo Video:** `YOUR_DEMO_VIDEO_URL`

> Replace the placeholder URLs above after deploying the application.

---

## 🖥️ Application Screenshots

### 🏠 RailFlow Dashboard

The main dashboard provides an overview of railway operations, maintenance activities, asset health, train movements, and optimization insights.

![RailFlow Dashboard](docs/screenshots/dashboard.png)

---

### 🧠 Maintenance Intelligence

The Maintenance Intelligence module provides AI-driven asset risk analysis and maintenance prioritization.

![Maintenance Intelligence](docs/screenshots/maintenance-intelligence.png)

**Key information displayed:**

* Asset health
* Failure risk
* Maintenance priority
* Criticality
* Maintenance status
* Risk factors

---

### 🚆 Block Planning

The Block Planner analyzes available corridor windows and generates optimized maintenance block candidates using the CP-SAT optimization engine.

![Block Planning](docs/screenshots/block-planning.png)

**The planner considers:**

* Available corridor gaps
* Maintenance duration
* Train movements
* Priority trains
* Task compatibility
* Safety constraints
* Optimization weights

---

### 📊 Optimization Results

RailFlow compares multiple feasible block windows and provides their operational impact.

![Optimization Results](docs/screenshots/optimization-results.png)

Each candidate can include:

* Impact score
* Estimated delay
* Affected trains
* Priority trains affected
* Conflict count
* Resource feasibility
* Maintenance feasibility
* Optimization rationale

---

### 🔄 What-If Scenario Analysis

The Scenario Analysis module allows users to evaluate how operational changes affect the recommended block plan.

![What-If Scenario Analysis](docs/screenshots/what-if-analysis.png)

Users can explore scenarios such as:

* Increased traffic
* Different block durations
* Priority-train protection
* Different optimization weights

---

### 🚨 Emergency Replanning

RailFlow provides an emergency replanning workflow for urgent maintenance requirements.

![Emergency Replanning](docs/screenshots/emergency-replanning.png)

The system analyzes the immediate operational horizon and generates an optimized emergency maintenance window.

---

### 📈 Delay Cascade Analysis

The Delay Cascade module visualizes the downstream operational impact of a selected maintenance block.

![Delay Cascade Analysis](docs/screenshots/delay-cascade.png)

The analysis shows:

```text
Primary Delay
      ↓
Affected Train
      ↓
Downstream Trains
      ↓
Cascade Delay
      ↓
Total Operational Impact
```

---

### 📋 Decision & Approval

RailFlow follows a human-in-the-loop approach. Controllers can review the recommended block, examine its operational impact, and record the final decision.

![Decision Approval](docs/screenshots/decision-approval.png)

The decision record can include:

* Selected block window
* Controller
* Maintenance tasks
* Estimated delay
* Priority-train impact
* Decision rationale
* Timestamp

---

## 🎬 Product Walkthrough

The complete RailFlow workflow can be demonstrated as:

```text
Dashboard
   ↓
Maintenance Intelligence
   ↓
Asset Risk Analysis
   ↓
Block Planner
   ↓
Candidate Generation
   ↓
CP-SAT Optimization
   ↓
Candidate Comparison
   ↓
What-If Analysis
   ↓
Delay Cascade
   ↓
Human Approval
   ↓
Decision History
```

---

## 🧮 Backend & API Demo

RailFlow also exposes a FastAPI backend with interactive Swagger documentation.

### Swagger API

```text
YOUR_BACKEND_URL/docs
```

The API provides endpoints for:

```text
GET  /stations
GET  /sections
GET  /assets
GET  /tasks
GET  /trains
GET  /resources

POST /optimizer/generate-candidates
POST /optimizer/what-if
POST /optimizer/emergency-replan

GET  /data-quality
GET  /decisions

POST /activities
GET  /activities
PATCH /activities/{id}

POST /auth/register
POST /auth/login

POST /ml/retrain
```

---

## 📸 Screenshot Directory

Store project screenshots in the following structure:

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── maintenance-intelligence.png
    ├── block-planning.png
    ├── optimization-results.png
    ├── what-if-analysis.png
    ├── emergency-replanning.png
    ├── delay-cascade.png
    └── decision-approval.png
```

### Recommended Screenshot Guidelines

For the GitHub repository:

* Use PNG or JPG format.
* Capture screenshots at a consistent resolution.
* Keep the complete application UI visible.
* Avoid screenshots containing passwords, API keys, or private information.
* Use meaningful filenames.
* Prefer screenshots that demonstrate actual functionality rather than only static UI.

---

## 🎥 Recommended Demo Video Flow

For a **2–4 minute RailFlow demonstration**, use this sequence:

### 1. Problem Introduction

Briefly explain the railway maintenance block-planning challenge.

### 2. Dashboard

Show the overall railway operational view.

### 3. Maintenance Intelligence

Select an asset and demonstrate its AI-generated failure-risk score.

### 4. Block Planner

Select a railway section and generate candidate maintenance windows.

### 5. CP-SAT Optimization

Show how different optimization objectives influence candidate evaluation.

### 6. Candidate Comparison

Compare the generated options using:

* Impact score
* Delay
* Priority train impact
* Resource feasibility
* Maintenance feasibility

### 7. What-If Analysis

Change traffic or block parameters and demonstrate the recalculated result.

### 8. Emergency Replanning

Trigger an emergency maintenance scenario.

### 9. Delay Cascade

Show how the selected block can affect downstream trains.

### 10. Human Approval

Show the final decision and audit trail.

### 11. Backend

Briefly show:

```text
FastAPI
PostgreSQL
XGBoost
LightGBM
OR-Tools CP-SAT
```

This demonstrates that RailFlow is backed by an actual computational pipeline rather than only a frontend prototype.

---

## 🚀 Quick Showcase

| Component           | Link                         |
| ------------------- | ---------------------------- |
| 🚆 Live Application | `YOUR_LIVE_DEMO_URL`         |
| ⚙️ FastAPI Backend  | `YOUR_BACKEND_URL`           |
| 📚 Swagger API      | `YOUR_BACKEND_URL/docs`      |
| 💻 GitHub           | `YOUR_GITHUB_REPOSITORY_URL` |
| 🎬 Demo Video       | `YOUR_DEMO_VIDEO_URL`        |

---

> **RailFlow — From maintenance requests to optimized railway blocks, powered by AI, optimization, and human decision-making.**

