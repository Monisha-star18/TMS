const API = "http://localhost:3000";


const loggedEmployee = JSON.parse(localStorage.getItem("loggedEmployee") || "null");
if (!loggedEmployee) {
  window.location.href = "../pages/index.html";
}

const user     = loggedEmployee || {};
const userName = user.employeeName || "Employee";
const deptMap  = { "1": "IT", "2": "Marketing", "3": "Finance" };
const userDept = deptMap[user.department] || "—";

document.getElementById("oc-name").textContent=userName;
document.getElementById("oc-dept").textContent=userDept + " Department";
document.getElementById("oc-email").value=user.email || "—";
document.getElementById("oc-empid").value=user.employeeID || "—";
document.getElementById("oc-designation").value=user.designation || "—";
document.getElementById("oc-projectid").value=user.projectID  || "—";
document.getElementById("nav-username").textContent = userName;


function handleLogout()
{
  Swal.fire({title: "Log out?",text: "You will be returned to the home page.",icon: "question",showCancelButton: true,
    confirmButtonText: "Yes, log out",confirmButtonColor: "#497174"}).then(result => {
    if (result.isConfirmed) {
      localStorage.removeItem("loggedEmployee");
      window.location.href = "../pages/index.html";
    }
  });
}

const modeIcons  = { plane: "ti-plane", car: "ti-car", train: "ti-train" };
const modeColors = {
  plane: { bg: "#EFF5F5", color: "#497174" },
  car:   { bg: "#ECFDF5", color: "#065F46" },
  train: { bg: "#FFFBEB", color: "#92400E" }
};
const statusBorder = { pending: "#EF9F27", accepted: "#1D9E75", rejected: "#E24B4A" };

let requests = [];
let filter   = "all";
let searchTerm = "";

async function getRequest() {
  const res = await fetch(`${API}/travelRequests?projectID=${user.projectID}&isDeleted=false`);
  requests   = await res.json();
  
  displayAll();
}

async function addRequest(data) {
  const res = await fetch(`${API}/travelRequests`, {
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body:JSON.stringify({ ...data, employeeID: user.employeeID, employeeName: userName , isDeleted : false })
  });
  if (!res.ok) throw new Error("Add failed");
  return res.json();
}

async function updateRequest(id, data) {
  const res = await fetch(`${API}/travelRequests/${id}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}


// ── Metrics ───────────────────────────────────────────────────────────────────
function displayMetrics() {
  const t   = requests.length;
  const a   = requests.filter(r => r.status === "accepted").length;
  const p   = requests.filter(r => r.status === "pending").length;
  const rej = requests.filter(r => r.status === "rejected").length;
  document.getElementById("metrics").innerHTML = `
    <div class="metric" style="background:linear-gradient(135deg,#7C3AED 0%,#C084FC 100%);border:0.5px solid var(--color-border-tertiary);">
      <div class="metric-label">Total</div>
      <div class="metric-val" style="color:var(--brand)">${t}</div>
    </div>
    <div class="metric" style="background:linear-gradient(135deg,#059669 0%,#34D399 100%);border:0.5px solid #21e898">
      <div class="metric-label">Accepted</div>
      <div class="metric-val" style="color:#065F46">${a}</div>
    </div>
    <div class="metric" style="background:linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%);border:0.5px solid #FCD34D">
      <div class="metric-label">Pending</div>
      <div class="metric-val" style="color:#92400E">${p}</div>
    </div>
    <div class="metric" style="background:linear-gradient(135deg,#E11D48 0%,#FB7185 100%);border:0.5px solid #FCA5A5">
      <div class="metric-label">Rejected</div>
      <div class="metric-val" style="color:#991B1B">${rej}</div>
    </div>`;
}


function displayFilters() {
  const statuses = ["all", "pending", "accepted", "rejected"];

  document.getElementById("filters").innerHTML =`<span class="filter-label"><i class="ti ti-filter" style="font-size:13px;vertical-align:-1px"></i>Filter:</span>` +
    statuses.map(s => `<button class="filter-btn ${filter === s ? "active" : ""}" onclick="setFilter('${s}')"> ${s.charAt(0).toUpperCase() + s.slice(1)} </button>`).join("");
}

function setFilter(s) {
  filter = s;
  displayFilters();
  displayCards();
}

document.getElementById("searchInput").addEventListener("input", function () {
  searchTerm = this.value.trim().toLowerCase();
  displayCards();
});



function toggleCard(id) {
  const r = requests.find(r => r.id === id);
  if (r) { r.open = !r.open; displayCards(); }
}


function statusBtn(r) {
  if (r.status === "pending")  return `<button class="btn-warning">Pending</button>`;
  if (r.status === "accepted") return `<button class="btn-success">Accepted</button>`;
  return `<button class="btn-danger">Rejected</button>`;
}

function displayCards() 
{
    let filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

    if (searchTerm) {
      filtered = filtered.filter(r =>
        (r.from || "").toLowerCase().includes(searchTerm) ||
        (r.to || "").toLowerCase().includes(searchTerm) ||
        (r.purpose || "").toLowerCase().includes(searchTerm) ||
        (r.employeeName || "").toLowerCase().includes(searchTerm) ||
        (r.employeeID || "").toLowerCase().includes(searchTerm) ||
        (r.status || "").toLowerCase().includes(searchTerm)||
        (r.mode || "").toLowerCase().includes(searchTerm)
      );
    }

    const c = document.getElementById("cards-container");

    if (!filtered.length) {
        c.innerHTML = `<div class="empty-state"> <i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px"></i>No requests found</div>`;
        return;
    }

    function dayBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    function formateDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    c.innerHTML = filtered.map(r => {
        const mc       = modeColors[r.mode] || modeColors.plane;
        const icon     = modeIcons[r.mode]  || "ti-plane";
        const days     = dayBetween(r.startDate, r.endDate);
        const displayMode = (r.mode || "plane").charAt(0).toUpperCase() + (r.mode || "plane").slice(1);

      return `<div class="request-card" style="border-left:3px solid ${statusBorder[r.status] || '#ccc'}">
            <div class="card-header">
              <div class="card-left">
                <!-- Transport Mode Icon Card Board Area -->
                <div class="trip-icon" style="background:${mc.bg};color:${mc.color}">
                  <i class="ti ${icon}"></i>
                </div>
                <div style="flex-grow: 1;">
                  
                  <!-- SEPARATED COMPLEMENTARY THEME CARD FOR EMPLOYEE HEADER -->
                  <div class="employee-badge-card" style="background-color: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 6px 12px; margin-bottom: 10px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px);">
                    <i class="ti ti-user" style="font-size:14px; color: #E8AB30; vertical-align: middle;"></i>
                    <span style="font-weight: 600; font-size: 14px; color: #ffffff;">${r.employeeName}</span>
                    <span style="color: rgba(255, 255, 255, 0.7); font-size: 13px; font-weight: 400;">(ID: ${r.employeeID})</span>
                  </div>
                  
                  <!-- Location and Trip details below -->
                  <div class="trip-title" style="font-size: 16px; font-weight: 500; color: #fff; margin-left: 4px;">${r.from} → ${r.to}</div>
                  <div class="trip-sub" style="color: rgba(255, 255, 255, 0.72); font-size: 13px; margin-top: 2px; margin-left: 4px;">${r.purpose} · ${days} days · ₹${r.cost} </div>
                </div>
              </div>
              <div class="card-right">
                ${statusBtn(r)}
                ${r.status === "pending" ? `
                  <button class="btn-info" onclick="openEditModal('${r.id}')">
                    <i class="ti ti-pencil" style="font-size:12px"></i> Edit
                  </button>` : ""}
              </div>
            </div>
            <button class="toggle-btn" onclick="toggleCard('${r.id}')">
              <i class="ti ti-chevron-${r.open ? "up" : "down"}"></i>
              ${r.open ? "Hide details" : "Show details"}
            </button>
            
            ${r.open ? `
            <div class="details-grid responsive-details">
              <div class="detail-item"><div class="detail-label">Employee</div><div class="detail-val">${r.employeeName}</div></div>
              <div class="detail-item"><div class="detail-label">Employee ID</div><div class="detail-val">${r.employeeID}</div></div>
              <div class="detail-item"><div class="detail-label">From</div><div class="detail-val">${r.from}</div></div>
              <div class="detail-item"><div class="detail-label">To</div><div class="detail-val">${r.to}</div></div>
              <div class="detail-item"><div class="detail-label">Start date</div><div class="detail-val">${formateDate(r.startDate)}</div></div>
              <div class="detail-item"><div class="detail-label">End date</div><div class="detail-val">${formateDate(r.endDate)}</div></div>
              <div class="detail-item"><div class="detail-label">Transport Mode</div><div class="detail-val">${displayMode}</div></div>
              <div class="detail-item"><div class="detail-label">Est. cost</div><div class="detail-val">₹${r.cost}</div></div>
              <div class="detail-wide"><div class="detail-label">Purpose</div><div class="detail-val">${r.purpose}</div></div>
              
              ${r.status !== 'pending' ? `
                <div class="detail-wide" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 4px;">
                  <div class="detail-label">Your Remark</div>
                  <div class="detail-val" style="font-weight: 500; color: #E8AB30;">
                    ${r.remark || "—"}
                  </div>
                </div>
                <div class="detail-wide">
                  <div class="detail-label">Decision Date</div>
                  <div class="detail-val" style="font-size: 13px; color: rgba(255,255,255,0.7);">
                    ${r.actionDate ? formateDate(r.actionDate) : "—"}
                  </div>
                </div>
              ` : ""}
            </div>` : ""}
          </div>`;
    }).join("");
}

// ── Save: Add ─────────────────────────────────────────────────────────────────
async function saveAdd() {
  const from  = document.getElementById("a-from").value.trim();
  const to    = document.getElementById("a-to").value.trim();
  const start = document.getElementById("a-start").value;
  const end   = document.getElementById("a-end").value;

  if (!from || !to) {
    Swal.fire({ icon: "warning", title: "From and To cities are required." });
    return;
  }
  if (start && end && end < start) {
    Swal.fire({ icon: "warning", title: "End date cannot be before start date." });
    return;
  }

  try {
    await addRequest({
      from, to,
      startDate: start,
      endDate:   end,
      purpose:   document.getElementById("a-purpose").value || "—",
      cost:      document.getElementById("a-cost").value    || "0",
      mode:      document.getElementById("a-mode").value    || "plane",
      status:    "pending"
    });

    bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();

    // Reset form
    ["a-from","a-to","a-start","a-end","a-purpose","a-cost"].forEach(id =>
      document.getElementById(id).value = "");
    document.getElementById("a-mode").value = "plane";

    await getRequest();
    Swal.fire({ icon: "success", title: "Request added!", timer: 1200, showConfirmButton: false });
  } catch {
    Swal.fire({ icon: "error", title: "Could not save. Is the server running?" });
  }
}

// ── Edit modal: populate ──────────────────────────────────────────────────────
function openEditModal(id) {

  const r = requests.find(r => r.id == id);
  if (!r) return;

  document.getElementById("e-id").value = r.id;
  document.getElementById("e-from").value = r.from;
  document.getElementById("e-to").value = r.to;
  document.getElementById("e-start").value = r.startDate || "";
  document.getElementById("e-end").value = r.endDate || "";
  document.getElementById("e-purpose").value = r.purpose;
  document.getElementById("e-cost").value = r.cost;
  document.getElementById("e-mode").value = r.mode;
  document.getElementById("e-status").value =r.status || "pending";
  document.getElementById("e-remark").value =r.remark || "";

  new bootstrap.Modal(document.getElementById("editModal")).show();
}
// ── Save: Edit ────────────────────────────────────────────────────────────────
async function saveEdit() {
  const id     = document.getElementById("e-id").value;
  const status = document.getElementById("e-status").value;
  const remark = document.getElementById("e-remark").value.trim();

  // Validation: status must be a decision, remark must not be empty
  if (status === "pending") {
    Swal.fire({ icon: "warning", title: "Please select a status", text: "Choose Accepted or Rejected before saving." });
    return;
  }
  if (!remark) {
    Swal.fire({ icon: "warning", title: "Remark is required", text: "Please enter a remark before saving." });
    return;
  }

  try {
    await updateRequest(id, { status, remark, actionDate: new Date().toISOString() });
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    await getRequest();
    Swal.fire({ icon: "success", title: "Request Updated" });
  } catch {
    Swal.fire({ icon: "error", title: "Update Failed" });
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
function displayAll() { displayMetrics(); displayFilters(); displayCards(); }

getRequest().catch(() => {
  Swal.fire({icon: "error",title: "Cannot connect to server",text: "Make sure json-server is running on port 3000."});
});
