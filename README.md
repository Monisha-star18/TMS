Here is a complete, beautifully structured `README.md` file customized exactly for your **TravelSync** project, matching the style, sections, and emojis of the sample file you provided.

---

# ✈️ TravelSync - Corporate Travel Request & Approval Management System

## 📖 Overview

**TravelSync** is a web-based Corporate Travel Request & Approval Management System designed to simplify business trip logging and reimbursement tracking within organizations. The system features a **Unified Workstation Page (`sharedDashboard.html`)** that dynamically alters its interface and capabilities depending on whether an **Employee** or a **Manager** logs in.

Employees can seamlessly submit travel itineraries, calculate total expected costs, and monitor real-time approvals, while Managers can oversee their respective project workflows, audit expenditures, and approve or reject travel requests with descriptive feedback remarks.

---

## 📑 Table of Contents

* [Overview](https://www.google.com/search?q=%23-overview)
* [Key Features](https://www.google.com/search?q=%23-key-features)
* [System Workflow](https://www.google.com/search?q=%23-system-workflow)
* [Technology Stack](https://www.google.com/search?q=%23-technology-stack)
* [Project Structure](https://www.google.com/search?q=%23-project-structure)
* [Installation & Setup](https://www.google.com/search?q=%23-installation--setup)
* [Detailed Page Breakdown](https://www.google.com/search?q=%23-detailed-page-breakdown)
* [Conclusion](https://www.google.com/search?q=%23-conclusion)

---

## 🌟 Key Features

### 👤 Employee View Mode

* **Profile Verification:** Dynamic sidebar offcanvas displaying user-specific details (ID, Email, Project ID, Department).
* **Live Expense Analytics:** Real-time counters calculating totals for **Total Requests**, **Pending**, **Approved**, and **Rejected** spend amounts.
* **Smart Travel Logging:** Form creation for new trips with strict automated constraints to block invalid entries.
* **Soft Deletion & Recovery Trash Can:** Hidden request bin layout allowing users to review and completely restore soft-deleted items instantly.
* **Interactive Live Search:** Quick text filtering to isolate cards by specific destination cities or business purposes.

### 👔 Manager View Mode

* **Project Isolation Filtering:** Automatically locks the interface down to only show requests originating from employees assigned to the manager's exact `projectID`.
* **Administrative Interventions:** Restricts regular editing permissions and brings up custom approval/rejection actionable modulators.
* **Compulsory Decision Auditing:** Rejection and approval requests are blocked from saving unless a mandatory justification comment statement is recorded.
* **Automatic Audit Timestamps:** Tracks decision moments precisely by generating ISO standardized server-side timestamps upon entry submission.

---

## 🔄 System Workflow

```
   [ Authentication Gateway (index.html) ]
                     │
        Verifies Role & Token API Check
                     │
                     ▼
    [ Unified UI Hub (sharedDashboard.html) ]
         │                               │
         ▼                               ▼
  (Employee Mode View)            (Manager Mode View)
  - Log Travel Requests           - Filter by Team Project
  - Track Expense Approvals       - Mandatory Remarks Form
  - Soft-delete & Restore Records - State Mutation Audits

```

---

## 🛠️ Technology Stack

* **Frontend Layout Framework:** HTML5, CSS3, and **Bootstrap 5.3** (Fluid layout utilities, interactive responsive modal overlays, flex grids).
* **Application Component Logic:** **JavaScript (ES6+)** and **jQuery 4.0.0** (Event propagation listeners, live styling validation states, dynamic DOM card generation).
* **Alert & Notification Framework:** **SweetAlert2** (Polished user-facing confirmation modals, error catch notifications, and validation alerts).
* **Asynchronous Communication Layer:** Native JavaScript `async/await` syntax executing asynchronous network transactions via the Fetch API.
* **Relational Storage Engine:** Localized REST mock API database running via **`json-server`** targeting `db.json`.

---

## 📂 Project Structure

```text
TravelSync/
│
├── pages/
│   ├── index.html               # Gateway Page: Public Branding, FAQ Accordion, & Login Form
│   └── sharedDashboard.html     # Core Functional UI Canvas (Shared Employee & Manager Dashboard)
│
├── scripts/
│   ├── landingPage.js           # Auth Gatekeeper: Form resets, RegEx validations, & local token saves
│   └── sharedDashboard.js       # Unified Dashboard Brain: Dynamic role checks, metrics, & modal binds
│
├── styles/
│   ├── theme.css                # Global Visual Tokens: Deep Navy Blue (#1B2E5E) & Metallic Gold (#C9920A)
│   └── employeeDashboard.css    # Layout Tokens: Dashboard grid systems, metric blocks, status badges
│
└── db.json                      # Mock Database File: Relational collections for Departments, Employees, and Requests

```

---

## 🚀 Installation & Setup

Follow these simple steps to set up and run the project locally on your machine.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/travelsync.git

```

### 2️⃣ Navigate to the Project Folder

```bash
cd travelsync

```

### 3️⃣ Install JSON Server Globally

```bash
npm install -g json-server

```

### 4️⃣ Launch the Mock REST Server

Run the local database server on standard port `3000`:

```bash
json-server --watch db.json --port 3000

```

### 5️⃣ Execute the Application

Open `pages/index.html` inside your favorite browser using **Live Server** (or any local web file server extension).

---

## 📄 Detailed Page Breakdown

### 🔐 1. Gateway Authentication Panel (`index.html` / `landingPage.js`)

* **Purpose:** Handles account sign-up and sign-in capabilities, applying real-time field evaluation algorithms to clean inputs before allowing connection routines.
* **Logic Framework:** Form fields monitor input matching behaviors using custom client-side Regular Expression parameters:
* `emailRegex`: Enforces structural email compliance parameters.
* `passwordRegex`: Commands at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 unique special symbol, and restrictions between 8 and 15 total characters.
* `idRegex`: Enforces proper corporate identifier syntax limits (e.g., `MGR0001`, `ST26302`).


* **Session Initialization:** Successfully matched profiles extract confidential records safely and save clear operational details inside `localStorage` under the object label `"loggedEmployee"`.

### 🎛️ 2. The Shared Workstation Dashboard (`sharedDashboard.html` / `sharedDashboard.js`)

This unified workspace runs an immediate structural check during execution. If an unauthenticated session is caught, it automatically redirects the window back to `index.html`. It then decodes user roles to conditionally switch configurations:

#### 👤 Employee Operations View

* **Temporal Boundaries Check:** Destroys layout-breaking inputs by overriding native browser properties. Dates are automatically locked securely between `CurrentYear - 1` and `CurrentYear + 5`.
* **Transit Dropdown Constraints:** Validates travel selectors directly. Form entries reject unselected dropdown choices, turning the field red (`is-invalid`) and stopping submission to ensure a valid option (`plane`, `train`, `car`) is recorded.
* **Soft Delete Reversal:** Flipping item deletions writes `"isDeleted": true` to the server instead of executing structural purges. Users click the trash selector to view hidden items and trigger individual `PATCH` updates to bring them back online.

#### 👔 Manager Oversight View

* **Project Boundary Shielding:** Appends explicit parameters directly into fetch calls (`/travelRequests?projectID=...`), preventing managers from accessing files outside of their specified team networks.
* **Forced Justification Loops:** Submission states for processing travel requests flag items dynamically. If an administrative approval attempt leaves comments blank or fails to select a non-pending status, execution is cleanly blocked with a descriptive SweetAlert notification.

---

## 🏆 Conclusion

**TravelSync** provides a streamlined, secure solution for processing corporate travel requests and approving reimbursement workflows. By condensing multi-page employee forms and operational review boards into a single **Unified Dashboard**, the ecosystem maximizes codebase reuse, reduces server overhead, and provides an instantly reactive user experience for both employees and corporate managers alike.