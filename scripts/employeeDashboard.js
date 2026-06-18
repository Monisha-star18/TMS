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

// ── Date sanity bounds ───────────────────────────────────────────────────────
// Native <input type="date"> can otherwise accept typed-in years like 2222 or
// 222222, so we both constrain the picker with min/max and re-validate the
// parsed year on every change.
const todayDate   = new Date();
const todayStr    = todayDate.toISOString().split("T")[0];
const minYear     = todayDate.getFullYear() - 1;
const maxYear     = todayDate.getFullYear() + 5;
const maxDateStr  = `${maxYear}-12-31`;

function isSaneDate(dateStr) {
  if (!dateStr) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return false;
  const year = parseInt(m[1], 10);
  if (year < minYear || year > maxYear) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

["a-start", "a-end", "e-start", "e-end"].forEach(id => {
  const el = document.getElementById(id);
  el.setAttribute("min", todayStr);
  el.setAttribute("max", maxDateStr);
});


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
  plane: { bg: "#EFF5F5", color: "#0ec871" },
  car:   { bg: "#ECFDF5", color: "#065F46" },
  train: { bg: "#FFFBEB", color: "#92400E" }
};
const statusBorder = { pending: "#efe527", accepted: "#05b87f", rejected: "#f71919" };

let requests = [];
let deletedRequests = [];

let filter   = "all";
let searchTerm = "";

async function getRequest() {
  const res  = await fetch(`${API}/travelRequests?employeeID=${user.employeeID}&isDeleted=false`);
  requests   = await res.json();
  displayAll();
}

async function addRequest(data) {
  const res = await fetch(`${API}/travelRequests`, {
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body:JSON.stringify({ ...data, employeeID: user.employeeID, employeeName: userName ,projectID :user.projectID , isDeleted : false })
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

async function deleteRequest(id) {
  const res = await fetch(`${API}/travelRequests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({isDeleted: true})
  });

  if (!res.ok) throw new Error("Delete failed");
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

async function deleteCard(id) {
  const confirm = await Swal.fire({title: "Delete request?",icon: "warning",showCancelButton: true,confirmButtonText: "Delete",confirmButtonColor: "#E24B4A"
  });
  if (!confirm.isConfirmed) return;

  try {
    await deleteRequest(id);
    await getRequest();
  } 
  catch {Swal.fire({ icon: "error", title: "Could not delete. Is the server running?" });}
}

async function restoreAll() {
  try { 
    const res = await fetch( `${API}/travelRequests?employeeID=${user.employeeID}&isDeleted=true` );
    deletedRequests = await res.json();
    renderRestoreModal();

    new bootstrap.Modal(document.getElementById("restoreModal")).show();
  } 
  catch {Swal.fire({icon: "error",title: "Could not load deleted requests"});}}

function renderRestoreModal() 
{
    const container = document.getElementById("restoreContainer");

    if (!deletedRequests.length) { 
      container.innerHTML = `<p class="text-center">No deleted requests found.</p>`;
      return;
    }

    container.innerHTML = deletedRequests.map(r => `
      <div class="request-card mb-2">
        <div class="card-header">
          <div class="card-left">
            <div>
              <div class="trip-title">${r.from} → ${r.to}</div>
              <div class="trip-sub">${r.purpose} · ₹${r.cost}</div>
            </div>
          </div>
          <div class="card-right">
            <button class="btn btn-success btn-sm" onclick="restoreRequest('${r.id}')"> Restore </button>
          </div>
        </div>
      </div> `).join("");
}

async function restoreRequest(id) {
  try {

    const res = await fetch(`${API}/travelRequests/${id}`,{
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({isDeleted: false})
      });

    if (!res.ok) throw new Error("Restore failed");
    console.log()
    Swal.fire({icon: "success",title: "Request Restored",timer: 1200,showConfirmButton: false});

    await restoreAll();     // refresh deleted list
    await getRequest();  // refresh active list

  } 
  catch {Swal.fire({icon: "error",title: "Restore failed"});}
}


function statusBtn(r) {
  if (r.status === "pending")  return `<button class="btn-warning">Pending</button>`;
  if (r.status === "accepted") return `<button class="btn-success">Accepted</button>`;
  return `<button class="btn-danger">Rejected</button>`;
}

// ── Field-level validation (Add / Edit request forms) ──────────────────────────
function showFieldError(id, msg) {
  const input = document.getElementById(id);
  const desc  = document.getElementById(`${id}-desc`);
  if (input) input.classList.add("is-invalid");
  if (desc)  desc.textContent = msg;
}
function clearFieldError(id) {
  const input = document.getElementById(id);
  const desc  = document.getElementById(`${id}-desc`);
  if (input) input.classList.remove("is-invalid");
  if (desc)  desc.textContent = "";
}

function validateFromCity(prefix) {
  const val = document.getElementById(`${prefix}-from`).value.trim();
  if (!val || val.length < 2) {
    showFieldError(`${prefix}-from`, "From city is required (min 2 letters)");
    return false;
  }
  clearFieldError(`${prefix}-from`);
  return true;
}

function validateToCity(prefix) {
  const val = document.getElementById(`${prefix}-to`).value.trim();
  if (!val || val.length < 2) {
    showFieldError(`${prefix}-to`, "To city is required (min 2 letters)");
    return false;
  }
  clearFieldError(`${prefix}-to`);
  return true;
}

function validateStartDate(prefix) {
  const val = document.getElementById(`${prefix}-start`).value;
  if (!val) {
    showFieldError(`${prefix}-start`, "Start date is required");
    return false;
  }
  if (!isSaneDate(val)) {
    showFieldError(`${prefix}-start`, `Enter a valid year between ${minYear} and ${maxYear}`);
    return false;
  }
  clearFieldError(`${prefix}-start`);
  return true;
}

function validateEndDate(prefix) {
  const start = document.getElementById(`${prefix}-start`).value;
  const val   = document.getElementById(`${prefix}-end`).value;
  if (!val) {
    showFieldError(`${prefix}-end`, "End date is required");
    return false;
  }
  if (!isSaneDate(val)) {
    showFieldError(`${prefix}-end`, `Enter a valid year between ${minYear} and ${maxYear}`);
    return false;
  }
  if (start && val < start) {
    showFieldError(`${prefix}-end`, "End date cannot be before start date");
    return false;
  }
  clearFieldError(`${prefix}-end`);
  return true;
}

function validatePurpose(prefix) {
  const val = document.getElementById(`${prefix}-purpose`).value.trim();
  if (!val || val.length < 3) {
    showFieldError(`${prefix}-purpose`, "Purpose is required (min 3 characters)");
    return false;
  }
  clearFieldError(`${prefix}-purpose`);
  return true;
}

function validateCost(prefix) {
  const raw     = document.getElementById(`${prefix}-cost`).value;
  const costNum = Number(raw);
  if (raw === "" || isNaN(costNum)) {
    showFieldError(`${prefix}-cost`, "Estimated cost is required");
    return false;
  }
  if (costNum <= 0) {
    showFieldError(`${prefix}-cost`, "Cost must be a positive number");
    return false;
  }
  if (costNum > 10000000) {
    showFieldError(`${prefix}-cost`, "Cost seems unrealistically high");
    return false;
  }
  clearFieldError(`${prefix}-cost`);
  return true;
}

function validateRequestForm(prefix) {
  const results = [
    validateFromCity(prefix),
    validateToCity(prefix),
    validateStartDate(prefix),
    validateEndDate(prefix),
    validatePurpose(prefix),
    validateCost(prefix)
  ];

  const modeEl = document.getElementById(`${prefix}-mode`);
  let isModeValid = true;

  if (!modeEl.value || modeEl.value === "") {
    modeEl.classList.add("is-invalid");
    modeEl.classList.remove("is-valid");
    isModeValid = false;
  } else {
    modeEl.classList.remove("is-invalid");
    modeEl.classList.add("is-valid");
    isModeValid = true;
  }

  results.push(isModeValid);

  return !results.includes(false);
}

function clearRequestFormErrors(prefix) {
  ["from","to","start","end","purpose","cost"].forEach(f => clearFieldError(`${prefix}-${f}`));
}

["a", "e"].forEach(prefix => {
  document.getElementById(`${prefix}-from`).addEventListener("blur", () => validateFromCity(prefix));
  document.getElementById(`${prefix}-to`).addEventListener("blur", () => validateToCity(prefix));
  document.getElementById(`${prefix}-start`).addEventListener("change", () => {
    validateStartDate(prefix);
    if (document.getElementById(`${prefix}-end`).value) validateEndDate(prefix);
  });
  document.getElementById(`${prefix}-end`).addEventListener("change", () => validateEndDate(prefix));
  document.getElementById(`${prefix}-purpose`).addEventListener("blur", () => validatePurpose(prefix));
  document.getElementById(`${prefix}-cost`).addEventListener("input", () => validateCost(prefix));
});

document.getElementById("addModal").addEventListener("show.bs.modal", () => clearRequestFormErrors("a"));

function displayCards() {
  let filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  if (searchTerm) {
    filtered = filtered.filter(r =>
      (r.from || "").toLowerCase().includes(searchTerm) ||
      (r.to || "").toLowerCase().includes(searchTerm) ||
      (r.purpose || "").toLowerCase().includes(searchTerm) ||
      (r.mode || "").toLowerCase().includes(searchTerm) ||
      (r.status || "").toLowerCase().includes(searchTerm)
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

    return `
    <div class="request-card" style="border-left:6px solid ${statusBorder[r.status] || '#ccc'}">
      <div class="card-header">
        <div class="card-left">
          <div class="trip-icon" style="background:${mc.bg};color:${mc.color}">
            <i class="ti ${icon}"></i>
          </div>
          <div>
            <div class="trip-title">${r.from} → ${r.to}</div>
            <div class="trip-sub">${r.purpose} · ${days || "-"} days · ₹${r.cost}</div>
          </div>
        </div>
        <div class="card-right">
          ${statusBtn(r)}

          ${r.status === "pending" ? `
            <button class="btn-info rounded-pill" onclick="openEditModal('${r.id}')"> <i class="ti ti-pencil" style="font-size:12px"></i> Edit </button>
            <button class="btn-danger" onclick="deleteCard('${r.id}')"> <i class="ti ti-trash" style="font-size:12px"></i> Delete </button> ` : ""}
        </div>
      </div>
      <button class="toggle-btn" onclick="toggleCard('${r.id}')">
        <i class="ti ti-chevron-${r.open ? "up" : "down"}"></i>
        ${r.open ? "Hide details" : "Show details"}
      </button>
      
      ${r.open ? `
      <div class="details-grid">
        <div><div class="detail-label">From</div><div class="detail-val">${r.from}</div></div>
        <div><div class="detail-label">To</div><div class="detail-val">${r.to}</div></div>
        <div><div class="detail-label">Start date</div><div class="detail-val">${formateDate(r.startDate)}</div></div>
        <div><div class="detail-label">End date</div><div class="detail-val">${formateDate(r.endDate)}</div></div>
        <div class="detail-wide"><div class="detail-label">Purpose</div><div class="detail-val">${r.purpose}</div></div>
        <div class="detail-wide"><div class="detail-label">Est. cost</div><div class="detail-val">₹${r.cost}</div></div>
        
        ${r.status !== 'pending' ? `
          <div class="detail-wide" style="border-top: 1px dashed #ccc; padding-top: 8px; margin-top: 4px;">
            <div class="detail-label">Manager Remark</div>
            <div class="detail-val" style="font-weight: 500; color: ${r.status === 'accepted' ? '#05b87f' : '#f71919'}">
              ${r.remark || "—"}
            </div>
          </div>
          <div class="detail-wide">
            <div class="detail-label">Actioned On</div>
            <div class="detail-val" style="font-size: 13px; color: #6B7280;">
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
  if (!validateRequestForm("a")) {
    Swal.fire({ icon: "warning", title: "Please fix the highlighted fields" });
    return;
  }

  const from  = document.getElementById("a-from").value.trim();
  const to    = document.getElementById("a-to").value.trim();
  const start = document.getElementById("a-start").value;
  const end   = document.getElementById("a-end").value;

  try {
    await addRequest({
      from, to,
      startDate: start,
      endDate:   end,
      purpose:   document.getElementById("a-purpose").value.trim(),
      cost:      document.getElementById("a-cost").value,
      mode:      document.getElementById("a-mode").value || "plane",
      status:    "pending"
    });

    bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();

    // Reset form
    ["a-from","a-to","a-start","a-end","a-purpose","a-cost"].forEach(id =>
      document.getElementById(id).value = "");
    document.getElementById("a-mode").value = "plane";
    clearRequestFormErrors("a");

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

  clearRequestFormErrors("e");
  document.getElementById("e-id").value= r.id;
  document.getElementById("e-from").value= r.from;
  document.getElementById("e-to").value = r.to;
  document.getElementById("e-start").value= r.startDate || "";
  document.getElementById("e-end").value= r.endDate   || "";
  document.getElementById("e-purpose").value= r.purpose;
  document.getElementById("e-cost").value= r.cost;
  document.getElementById("e-mode").value= r.mode;

  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// ── Save: Edit ────────────────────────────────────────────────────────────────
async function saveEdit() {
  const id = document.getElementById("e-id").value;

  if (!validateRequestForm("e")) {
    Swal.fire({ icon: "warning", title: "Please fix the highlighted fields" });
    return;
  }

  try {
    await updateRequest(id, {
      from:      document.getElementById("e-from").value.trim(),
      to:        document.getElementById("e-to").value.trim(),
      startDate: document.getElementById("e-start").value,
      endDate:   document.getElementById("e-end").value,
      purpose:   document.getElementById("e-purpose").value.trim(),
      cost:      document.getElementById("e-cost").value,
      mode:      document.getElementById("e-mode").value,
    });

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    await getRequest();
  } catch {
    Swal.fire({ icon: "error", title: "Could not update. Is the server running?" });
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
function displayAll() { displayMetrics(); displayFilters(); displayCards(); }

getRequest().catch(() => {
  Swal.fire({icon: "error",title: "Cannot connect to server",text: "Make sure json-server is running on port 3000."});
});