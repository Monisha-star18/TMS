
  function clearLoginForm() {
    console.log("hi")
  $("#LoginemployeeID, #password").val("").removeClass("is-valid is-invalid");
  $("#LoginEmpidDesc").hide().text("");
}

function clearSignUpForm() {
  $("#SignName, #SignemployeeID, #email, #SignPassword, #Conformpassword, #DateOfJoin, #signProjectID, #Designation").val("").removeClass("is-valid is-invalid");
  $("#Signdepartment").val("").removeClass("is-valid is-invalid");
  $("#SignNamedesc, #Signempiddesc, #emailDesc, #passworddesc, #Conformpassworddesc, #dateOfJoinDesc, #signprojectidesc, #designationdesc, #departmentdesc").hide().text("");
}


const API = "http://localhost:3000";

const emailRegex       = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex        = /^[a-zA-Z\s]{3,30}$/;
const idRegex          = /^[A-Z0-9]{6,8}$/;
const passwordRegex    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
const designationRegex = /^[a-zA-Z\s\-\/]{2,50}$/;

// A date string is only considered valid if it parses AND its year is within
// a sane real-world range. Native <input type="date"> can otherwise accept
// typed-in years like 2222 or 222222.
function isSaneDate(dateStr, minYear, maxYear) {
  if (!dateStr) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return false;
  const year = parseInt(m[1], 10);
  if (year < minYear || year > maxYear) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

$(document).ready(function () {

  // ── Generic validator ────────────────────────────────────────────────────
  function validateInput(element, desc, regex, emptyMsg, invalidMsg) {
    const value = $(element).val().trim();
    if (value === "") {
      $(element).removeClass("is-valid").addClass("is-invalid");
      $(desc).show().text(emptyMsg);
      return false;
    }
    if (!regex.test(value)) {
      $(element).removeClass("is-valid").addClass("is-invalid");
      $(desc).show().text(invalidMsg);
      return false;
    }
    $(element).removeClass("is-invalid").addClass("is-valid");
    $(desc).hide().text("");
    return true;
  }

  // ── Login validations ────────────────────────────────────────────────────
  $("#Loginname").on("input", function () {
    validateInput(this, "#LoginNameDesc", nameRegex, "Name is required", "Name should be 3–50 letters");
  });
  $("#LoginemployeeID").on("input", function () {
    validateInput(this, "#LoginEmpidDesc", idRegex, "Employee ID is required", "Employee ID: 6–8 uppercase letters/digits (e.g. MGR0001)");
  });
  $("#ProjectID").on("input", function () {
    validateInput(this, "#projectidesc", idRegex, "Project ID is required", "Project ID: 6–8 uppercase letters/digits (e.g. PRJ0001)");
  });

  // ── Sign-up validations ──────────────────────────────────────────────────
  $("#SignName").on("input", function () {
    validateInput(this, "#SignNamedesc", nameRegex, "Name is required", "Name should be 3–50 letters");
  });
  $("#SignemployeeID").on("input", function () {
    validateInput(this, "#Signempiddesc", idRegex, "Employee ID is required", "Employee ID: 6–8 uppercase letters/digits");
  });
  $("#email").on("input", function () {
    validateInput(this, "#emailDesc", emailRegex, "Email is required", "Enter a valid email address");
  });
  $("#SignPassword").on("input", function () {
    validateInput(this, "#passworddesc", passwordRegex, "Password is required",
      "8–15 chars with uppercase, lowercase, digit and special character");
    validateConfirmPassword();
  });
  $("#signProjectID").on("input", function () {
    validateInput(this, "#signprojectidesc", idRegex, "Project ID is required", "Project ID: 6–8 uppercase letters/digits");
  });
  $("#Designation").on("input", function () {
    validateInput(this, "#designationdesc", designationRegex, "Designation is required", "Designation should be 2–50 letters (e.g. Software Engineer)");
  });
  $("#Conformpassword").on("input", validateConfirmPassword);

  function validateConfirmPassword() {
    const pw      = $("#SignPassword").val().trim();
    const confirm = $("#Conformpassword").val().trim();
    if (confirm === "") {
      $("#Conformpassword").removeClass("is-valid").addClass("is-invalid");
      $("#Conformpassworddesc").show().text("Please confirm your password");
      return false;
    }
    if (confirm !== pw) {
      $("#Conformpassword").removeClass("is-valid").addClass("is-invalid");
      $("#Conformpassworddesc").show().text("Passwords do not match");
      return false;
    }
    $("#Conformpassword").removeClass("is-invalid").addClass("is-valid");
    $("#Conformpassworddesc").hide().text("");
    return true;
  }

  // Max date = today, min already set to 1990-01-01 in markup
  const today = new Date().toISOString().split("T")[0];
  $("#DateOfJoin").attr("max", today);

  function validateDateOfJoin() {
    const val = $("#DateOfJoin").val();
    const currentYear = new Date().getFullYear();
    if (!val) {
      $("#DateOfJoin").removeClass("is-valid").addClass("is-invalid");
      $("#dateOfJoinDesc").show().text("Date of Join is required");
      return false;
    }
    if (!isSaneDate(val, 1990, currentYear)) {
      $("#DateOfJoin").removeClass("is-valid").addClass("is-invalid");
      $("#dateOfJoinDesc").show().text(`Enter a valid date between 1990 and ${currentYear}`);
      return false;
    }
    $("#DateOfJoin").removeClass("is-invalid").addClass("is-valid");
    $("#dateOfJoinDesc").hide().text("");
    return true;
  }
  $("#DateOfJoin").on("input change", validateDateOfJoin);

  // Department select
  $("#Signdepartment").on("blur", function () {
    if (!$(this).val()) {
      $(this).addClass("is-invalid");
      $("#departmentdesc").text("Please select a department.");
      return false;
    }
    $(this).removeClass("is-invalid");
    $("#departmentdesc").text("");
    return true;
  });


  // ── Sign-up submit ───────────────────────────────────────────────────────
  $("#register").on("click", async function (e) {
    e.preventDefault();

    // Run all validations and collect results
    const allValid = [
      validateInput("#SignName","#SignNamedesc",       nameRegex,     "Name is required",       "Name should be 3–50 letters"),
      validateInput("#SignemployeeID",  "#Signempiddesc",      idRegex,       "Employee ID is required", "Employee ID: 6–8 uppercase letters/digits"),
      validateInput("#email",           "#emailDesc",          emailRegex,    "Email is required",       "Enter a valid email address"),
      validateInput("#SignPassword",    "#passworddesc",       passwordRegex, "Password is required",    "8–15 chars with uppercase, lowercase, digit and special character"),
      validateConfirmPassword(),
      validateDateOfJoin(),
      validateInput("#signProjectID",   "#signprojectidesc",   idRegex,       "Project ID is required",  "Project ID: 6–8 uppercase letters/digits"),
      validateInput("#Designation",     "#designationdesc",    designationRegex, "Designation is required", "Designation should be 2–50 letters"),
      !!$("#Signdepartment").val()
    ];

    if (allValid.includes(false)) {
      Swal.fire({ icon: "warning", title: "Please fill all fields correctly" });
      return;
    }

    const signemployeeID = $("#SignemployeeID").val().trim();
    const employeeData = {
      employeeName: $("#SignName").val().trim(),
      employeeID:signemployeeID,
      email:$("#email").val().trim(),
      password:$("#SignPassword").val().trim(),
      department:$("#Signdepartment").val(),
      designation:$("#Designation").val().trim(),
      projectID:$("#signProjectID").val().trim(),
      dateOfJoin:$("#DateOfJoin").val(),
      role: "employee",      
      createdDate: new Date().toISOString()
    };

    try {
      const checkRes   = await fetch(`${API}/employees?employeeID=${signemployeeID}`);
      const existing   = await checkRes.json();
      if (existing.length > 0) {
        Swal.fire({ icon: "error", title: "Employee ID already registered" });
        return;
      }

      const saveRes = await fetch(`${API}/employees`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(employeeData)
      });

      if (!saveRes.ok) {
        Swal.fire({ icon: "error", title: "Error", text: "Could not create account. Please try again." });
        return;
      }
      clearSignUpForm();

      await Swal.fire({ icon: "success", title: "Successfully signing up !", text: "You can now log in." });
      // Close sign-up modal and open login modal
      const signUpModal = bootstrap.Modal.getInstance(document.getElementById("SignUpModal"));
      if (signUpModal) signUpModal.hide();
      new bootstrap.Modal(document.getElementById("loginModal")).show();

    } catch (err) {
      console.error("Sign-up error:", err);
      Swal.fire({ icon: "error", title: "Cannot connect to server", text: "Please try again later." });
    }
  });

  // ── Login submit ─────────────────────────────────────────────────────────
  $("#loginBtn").on("click", async function (e) {
    e.preventDefault();

    const employeeID = $("#LoginemployeeID").val().trim();
    const password   = $("#password").val().trim();

    if (!employeeID || !password) {
      Swal.fire({ icon: "warning", title: "Please enter Employee ID and Password" });
      return;
    }

    try {
      const result    = await fetch(`${API}/employees?employeeID=${employeeID}`);
      const employees = await result.json();

      if (employees.length === 0) {
        Swal.fire({ icon: "error", title: "Employee Not Found" });
        return;
      }

      const employee = employees[0];

      if (employee.password !== password) {
        Swal.fire({ icon: "error", title: "Incorrect Password" });
        return;
      }

      // Store without password
      const { password: _pw, ...safeEmployee } = employee;
      localStorage.setItem("loggedEmployee", JSON.stringify(safeEmployee));
      
      clearLoginForm();

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome, ${employee.employeeName}!`,
        timer: 1500,
        showConfirmButton: false
      });

      const loggedEmployee = JSON.parse(localStorage.getItem("loggedEmployee"));

      if (!loggedEmployee) {
        window.location.href = "../pages/index.html";
      }

      if (employee.role === "employee") {

        window.location.href = "../pages/employeeDashboard.html";

      } 
      else if (employee.role === "manager") {

        window.location.href = "../pages/managerDashboard.html";

      } 
      
      else {

        Swal.fire({
          icon: "error",
          title: "Invalid Role Assigned"
        });

      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({ icon: "warning", title: "Cannot connect to the server" });
    }
  });

});
