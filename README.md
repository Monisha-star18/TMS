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

# ⚙️ Main Logic & Workflows

This section breaks down the core business logic governing how **Taskify** processes data states, loads dashboards, handles deletions, and establishes structural links between organizational roles.

---

### 🗑️ 1. Soft Delete & Single Item Restore Logic

Instead of permanently removing records from `db.json`, Taskify uses a **Boolean status flag** (`isDeleted`) to handle temporary item removal and restoration.

#### 🔄 How it works:
* **The Flag:** Every travel request object in the database defaults to `"isDeleted": false`.
* **Active View Feed:** The Employee Dashboard pulls data using `?isDeleted=false`, keeping deleted items hidden from the active panel.
* **Soft Delete Action:** Clicking "Delete" sends an asynchronous `PATCH` request to flip that specific item ID's flag to `true`.
* **Particular Restore Action:** To restore a *single specific item*, the application targets its unique ID and updates the flag back to `false`.

```plaintext
[Active Request: isDeleted = false] 
       │
       ▼ (User clicks Delete)
[PATCH Request sent to /travelRequests/:id] ──► Changes flag to [isDeleted = true]
       │
       ▼ (User views Trash & clicks Restore on that specific ID)
[PATCH Request sent to /travelRequests/:id] ──► Flips flag back to [isDeleted = false]

```

---

### 🔐 2. Employee Dashboard Initialization Flow

The application secures dashboard panels and loads contextual user data using persistent local browser states.

#### 🔄 How it works:

1. When a user logs in, their profile data object is stored as a string inside browser `localStorage` under the key `"loggedEmployee"`.
2. When the dashboard page boots, it reads the storage key. If missing, it kicks the user back to the login screen (`index.html`).
3. If validated, it extracts the unique account ID (`employeeID`) to request only records belonging to that user.

```plaintext
[Page Initialization] 
       │
       ▼
[Check localStorage for "loggedEmployee"]
       │
       ├──► (If Null / Empty) ──► [Redirect to index.html Login Portal]
       │
       └──► (If Account Exists)
                 │
                 ▼
       [Extract user.employeeID]
                 │
                 ▼
       [API Fetch: /travelRequests?employeeID={ID}&isDeleted=false]
                 │
                 ▼
       [Render Dynamic Cards & Counter Metrics]

```

---

### 🤝 3. Employee-to-Manager Data Matching Architecture

Employees and managers are decoupled but functionally tied together through a shared enterprise property: the **`projectID`**.

#### 🔄 How it works:

* **The Hook:** When an employee registers, they select or are assigned a structural `projectID`.
* **The Submission:** When making a travel request, the employee's script injects their unique `projectID` directly into the trip item payload sent to `db.json`.
* **The Manager Filter:** When a manager logs in, the platform reads the manager's `projectID` and runs a targeted filter query. The manager *only* pulls requests where the trip's project identity perfectly matches their own.

```plaintext
   [ Employee Account ]                       [ Manager Account ]
 (Assigned projectID: "P101")              (Assigned projectID: "P101")
             │                                         │
             ▼                                         ▼
   [Creates Travel Request]                            │
             │                                         │
             ▼                                         ▼
[Injects "projectID": "P101" into Trip Object]         │
             │                                         │
             └───────────────► [(db.json)] ◄───────────┘
                                   │
                                   ▼ (Manager Dashboard Query)
             [Fetch: /travelRequests?projectID=P101&isDeleted=false]

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
