
# TravelSync — Project Overview

TravelSync is a web application that helps a company manage its employees' business travel requests.

Instead of using paperwork, employees can log in to submit where they need to go and how much it will cost. Managers can log in to review these requests, see their team's budget, and either **Accept** or **Reject** the trip with a written reason.

---

## 🏗️ The Tech Stack (What it's built with)

* **HTML5 & CSS3:** Used to build the structure of the website and paint it with the company's brand colors (Deep Navy Blue & Gold).
* **Bootstrap 5.3:** A design toolkit that makes sure the website looks neat, organized, and works well on both mobile screens and laptops.
* **JavaScript & jQuery:** The "brains" of the webpage. They check if the user typed their email and password correctly and handle clicking buttons without reloading the page.
* **SweetAlert2:** A tool that pops up pretty alert boxes (like "Login Successful!" or "Please fill out this field").
* **Mock Database (`db.json`):** A simple text file that acts as our database to remember user profiles, passwords, and travel logs.

---

## 📂 Project Structure (Where things are)

* **`index.html` & `landingPage.js`:** The entry gate where users log in or sign up.
* **`sharedDashboard.html` & `sharedDashboard.js`:** The main control center. It dynamically shifts what it displays depending on whether an **Employee** or a **Manager** logs in.
* **`theme.css` & `employeeDashboard.css`:** The style files that control colors, fonts, margins, and card designs.
* **`db.json`:** The database file storing everything safely.

---

## 📄 Page-by-Page Breakdown

### 1. Login & Sign-Up Gate (`index.html`)

* **Purpose:** To verify who you are and send you to the right view.
* **How it works (The Flow):** 1. You type your Employee ID and Password.
2. The code checks the database to see if you exist.
3. If everything matches, it saves your name and role to the browser's temporary memory (`localStorage`).
4. It opens the **Shared Dashboard** page.
* **The Logic:** It uses strict rules (called Regex) to verify inputs in real-time. For example: Passwords *must* have at least one uppercase letter, one number, and one special character (like `@`) so accounts stay safe.

---

### 2. The Main Workstation (`sharedDashboard.html`)

This is a single webpage, but it acts like two completely different screens depending on your role.

#### View A: Employee Mode (For regular staff)

* **Purpose:** To let employees book trips, check prices, and see if their boss approved them.
* **How it works (The Flow):**
1. The page checks your login token. If you aren't logged in, it kicks you back to the login page.
2. It displays big counter boxes showing your total travel spending: **Total Spent**, **Pending Amount**, **Approved Amount**, and **Rejected Amount**.
3. It shows your past trips as clean visual cards. Green means approved, Amber means waiting, and Red means rejected.


* **The Logic:** * **Date Safeguards:** It stops users from accidentally typing crazy dates (like the year `20265`). It locks choices to realistic current timeframes.
* **No Blank Dropdowns:** It forces you to actively choose a travel mode (Plane, Train, or Car) from a clean drop-down list. If you leave it empty, the form turns red and won't let you submit.
* **Recycle Bin (Restore):** If you delete a request by mistake, it doesn't vanish forever. It gets hidden. You can click a button to view your deleted items and click "Restore" to bring them back.



#### View B: Manager Mode (For bosses)

* **Purpose:** To let managers track their specific project teams, look at costs, and make approval decisions.
* **How it works (The Flow):**
1. The dashboard detects that a manager has logged in. It hides the "Add Request" button since managers don't submit requests here.
2. It filters the database so the manager **only sees employees belonging to their exact project ID**.
3. It displays the name and ID of the staff member on top of each travel card.


* **The Logic:**
* **Forced Comments:** If a manager clicks "Approve" or "Reject", they *cannot* leave the decision note blank. The system forces them to type a short explanation before saving.
* **Instant Updates:** The moment the manager hits save, a background network message (`PATCH`) updates the database with the decision text and records the exact time the decision was made. The employee instantly sees the update on their screen.