# ✈️ Taskify - Travel Request Management System

## 📖 Overview

**Taskify** is a web-based Travel Request Management System designed to simplify corporate travel logistics and approval workflows. Employees can easily submit new travel requests, track approval states, and manage their trip history, while managers can review, approve, or reject requests with mandatory remarks based on their projects.

The system provides a clear, centralized platform for auditing company travel and accelerating decision-making.

---

## 📑 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Screenshots](#-screenshots)
* [Installation](#-installation)
* [Key Functionalities](#-key-functionalities)
* [Conclusion](#-conclusion)

---

# ✨ Features

## 👤 Employee Module

| Feature              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| Registration & Login | Secure account generation with strict profile fields       |
| Submit Travel Request| File requests specifying destination, dates, mode, and cost |
| Dashboard Metrics    | View individual statistics for pending, accepted, or rejected trips |
| Track & Filter       | Search requests dynamically or filter by selection status   |
| Soft Delete & Backup | Delete active requests with full ability to restore them    |

---

## 👔 Manager Module

| Feature             | Description                               |
| ------------------- | ----------------------------------------- |
| Manager Login       | Secure project-restricted supervisor access |
| View Project Claims | Access travel requests matching specific project boundaries |
| Process Approvals   | Approve valid requests instantly          |
| Reject with Remarks | Reject claims requiring mandatory justification comments |
| Team Analytics      | Monitor total metric counters across the managed pool |

---

# 🛠️ Technology Stack

### Frontend
* HTML5
* CSS3 (Custom Variables & Dark Mode support)
* Bootstrap 5
* JavaScript (ES6+ Modules)
* jQuery (Form Processing & Constraints)

### Backend (Mock)
* JSON Server (REST API Simulation)

### Storage
* Local Storage (Session Handling)

### Third-Party UI Tools
* Tabler Icons / Bootstrap Icons
* SweetAlert2 (Async Notification Modals)

---

# 📂 Project Structure

```plaintext
TMS/
│
├── db.json                       # Central local mock database file
├── README.md                     # Documentation file
│
├── pages/
│   ├── index.html                # Registration / Entry portal page
│   ├── employeeDashboard.html    # Employee workflow screen
│   └── managerDashboard.html     # Manager review interface
│
├── scripts/
│   ├── landingPage.js            # Validation rules & registration handler
│   ├── employeeDashboard.js      # Employee logic, soft-delete & views
│   └── managerDashboard.js       # Manager actions & status updating
│
└── styles/
    ├── theme.css                 # Color palettes, typography & roots
    └── sharedDashboard.css       # Unified interface layout styles

📸 Screenshots

Landing & Authentication Page


Employee Dashboard

Create Travel Request

Manager Dashboard Overview

Review Action Modal


🚀 Installation

1️⃣ Clone Repository
git clone [https://github.com/Monisha-star18/TMS.git](https://github.com/Monisha-star18/TMS.git)


2️⃣ Navigate to Project
cd TMS

3️⃣ Install JSON Server
npm install -g json-server

4️⃣ Start JSON Server
json-server --watch db.json --port 3000

5️⃣ Run Project
pages/index.html
using Live Server or any local static web hosting environment.


🎯 Key Functionalities
Employee
Register and Login securely

Create dynamic trip details with custom pricing arrays

Handle soft deletion rules and retrieve old itineraries

Live calculation counters for status types

Read direct manager rejection context notes

Manager
Auto-filter incoming requests scoped to specific project zones

Grant instant approval status modifications

Fill out precise text reasons before enforcing rejection updates

View high-level team summary reports

🏆 Conclusion
Taskify offers an effective, easy-to-use solution for automating company travel requests. By isolating workflows between individual employee requests and project managers, the system ensures complete accountability, zero data loss via soft deletion, and fast execution speeds using modern asynchronous web development methodologies.