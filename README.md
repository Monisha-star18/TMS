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
├── README.md                     # Documentation file
│
├── data/
│   └──db.json                    # Central local mock database file
│
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
```
---


# 📸 Screenshots

## Landing & Authentication Page
<img width="1902" height="885" alt="{626C4E74-3888-4487-8575-D34B0828B291}" src="https://github.com/user-attachments/assets/98a61346-4bcd-4ec6-b8a7-49baa8ad0b22" />

---

## Employee Dashboard
<img width="1899" height="844" alt="{3550B5CF-6382-481D-836E-14CA79FDBE1F}" src="https://github.com/user-attachments/assets/0323afc5-9227-465d-9b5f-d8a6a0589560" />

---

## Create Travel Request
<img width="1920" height="870" alt="{54145BEF-D785-4906-B8D4-937CA2D9AE01}" src="https://github.com/user-attachments/assets/187c3282-15bc-460d-9e23-73caf64b3733" />

---

## Manager Dashboard Overview
<img width="1920" height="830" alt="{4ABAB8D2-667C-4036-BC80-D0C405DC1178}" src="https://github.com/user-attachments/assets/14b63465-4033-4ce5-912f-310512a05c98" />

---

## Review Action Modal
<img width="1920" height="864" alt="{A3E2B694-626E-4940-9FCA-DA323764A57A}" src="https://github.com/user-attachments/assets/e81c67ed-4d20-4023-8f5c-d08da2992592" />

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone [https://github.com/Monisha-star18/TMS.git](https://github.com/Monisha-star18/TMS.git)

```

## 2️⃣ Navigate to Project

```bash
cd TMS

```

## 3️⃣ Install JSON Server

```bash
npm install -g json-server

```

## 4️⃣ Start JSON Server

```bash
cd data
json-server --watch db.json --port 3000

```

## 5️⃣ Run Project

Open:

```plaintext
pages/index.html

```

using Live Server or any local static web hosting environment.

---

# 🎯 Key Functionalities

### Employee

* Register and Login securely
* Create dynamic trip details with custom pricing arrays
* Handle soft deletion rules and retrieve old itineraries
* Live calculation counters for status types
* Read direct manager rejection context notes

### Manager

* Auto-filter incoming requests scoped to specific project zones
* Grant instant approval status modifications
* Fill out precise text reasons before enforcing rejection updates
* View high-level team summary reports

---

# 🏆 Conclusion

Taskify offers an effective, easy-to-use solution for automating company travel requests. By isolating workflows between individual employee requests and project managers, the system ensures complete accountability, zero data loss via soft deletion, and fast execution speeds using modern asynchronous web development methodologies.
