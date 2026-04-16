let currentClass = "";
let students = {};
let loginClicks = 0;
let doubleXPActive = false;

// NAVIGATION
function show(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "auth") {
    loginClicks++;

    if (loginClicks === 5) {
      askAdmin();
      loginClicks = 0;
    }
  }
}

// ADMIN PASSWORD
function askAdmin() {
  let pass = prompt("Please Enter The Administrator Password");

  if (pass === "F$&AdMiNPaSs*(") {
    show("admin");
  } else {
    alert("Wrong password");
  }
}

// LOGIN (demo)
function login() {
  userInfo.innerText = "👨‍🏫 Logged in as Teacher";
}

// CREATE CLASS
function createClass() {
  currentClass = Math.random().toString(36).substring(2,7);
  classCode.innerText = "Class Code: " + currentClass;
}

// GENERATE STUDENTS
function generateCodes() {
  codesList.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let code = Math.random().toString(36).substring(2,7);
    students[code] = { xp: 0 };

    let li = document.createElement("li");
    li.textContent = code;
    codesList.appendChild(li);
  }
}

// JOIN
function join() {
  let code = studentCode.value;

  if (!students[code]) {
    alert("Invalid code");
    return;
  }

  studentDash.classList.remove("hidden");
  xp.innerText = students[code].xp;
}

// ADMIN CONTROLS
function giveXP() {
  for (let s in students) {
    students[s].xp += 50;
  }
  alert("⚡ Everyone gained XP!");
}

function resetXP() {
  for (let s in students) {
    students[s].xp = 0;
  }
  alert("🔄 XP Reset");
}

function doubleXP() {
  doubleXPActive = true;
  alert("🔥 Double XP Activated");
}

function clearStudents() {
  students = {};
  codesList.innerHTML = "";
  alert("🧹 Students Cleared");
}
