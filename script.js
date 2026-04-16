let students = {};
let currentClass = "";
let loginClicks = 0;
let doubleXP = false;

// NAV
function show(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "auth") {
    loginClicks++;
    if (loginClicks === 5) {
      adminLogin();
      loginClicks = 0;
    }
  }
}

// ADMIN ACCESS
function adminLogin() {
  let pass = prompt("Enter Admin Password");
  if (pass === "F$&AdMiNPaSs*(") {
    show("admin");
    loadAdmin();
  } else {
    alert("Wrong password");
  }
}

// LOGIN
function login() {
  userInfo.innerText = "👨‍🏫 Teacher Logged In";
}

// CREATE CLASS
function createClass() {
  currentClass = Math.random().toString(36).substring(2,7);
  classCode.innerText = "Class Code: " + currentClass;
}

// GENERATE CODES
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

// GAME
function earnXP() {
  let code = studentCode.value;
  let gain = doubleXP ? 20 : 10;

  students[code].xp += gain;
  xp.innerText = students[code].xp;

  gameStatus.innerText = `+${gain} XP ⚡`;
  flash();
}

// RANDOM EVENT
function randomEvent() {
  let code = studentCode.value;

  let events = [
    { text: "🎉 +30 XP", xp: 30 },
    { text: "💀 -10 XP", xp: -10 },
    { text: "🔥 +100 XP", xp: 100 },
    { text: "😐 Nothing happened", xp: 0 }
  ];

  let e = events[Math.floor(Math.random() * events.length)];

  students[code].xp += e.xp;
  if (students[code].xp < 0) students[code].xp = 0;

  xp.innerText = students[code].xp;
  gameStatus.innerText = e.text;

  flash();
}

// FLASH EFFECT
function flash() {
  document.body.style.transform = "scale(1.02)";
  setTimeout(() => document.body.style.transform = "scale(1)", 100);
}

// ADMIN
function giveXP() {
  for (let s in students) students[s].xp += 50;
  adminStatus.innerText = "XP Boost ⚡";
  loadAdmin();
}

function resetXP() {
  for (let s in students) students[s].xp = 0;
  adminStatus.innerText = "XP Reset 🔄";
  loadAdmin();
}

function toggleDoubleXP() {
  doubleXP = !doubleXP;
  adminStatus.innerText = doubleXP ? "Double XP 🔥" : "Normal";
}

function randomBoost() {
  let keys = Object.keys(students);
  if (keys.length === 0) return;

  let r = keys[Math.floor(Math.random() * keys.length)];
  students[r].xp += 100;

  adminStatus.innerText = "Boosted " + r;
  loadAdmin();
}

// ADMIN LIST
function loadAdmin() {
  adminStudentList.innerHTML = "";

  for (let code in students) {
    let li = document.createElement("li");
    li.textContent = code + " (XP: " + students[code].xp + ")";
    adminStudentList.appendChild(li);
  }
}
