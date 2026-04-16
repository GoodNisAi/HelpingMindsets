import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQnhMU-9h2VCarsyGgEm1f2RFw5OuO84c",
  authDomain: "helpingmindesets.firebaseapp.com",
  projectId: "helpingmindesets",
  storageBucket: "helpingmindesets.firebasestorage.app",
  messagingSenderId: "707348820262",
  appId: "1:707348820262:web:cb57c28a3e737d528911e7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentClass = "";
let currentStudentId = "";

// Navigation
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

// Generate code
function generateCode() {
  return Math.random().toString(36).substring(2, 7);
}

// Create class
window.createClass = async function() {
  const code = generateCode();
  currentClass = code;

  await setDoc(doc(db, "classes", code), {
    createdAt: new Date()
  });

  document.getElementById("classCode").innerText = "Code: " + code;

  listenStudents();
  listenAssignments();
};

// Join class
window.joinClass = async function() {
  const code = document.getElementById("codeInput").value;
  const name = document.getElementById("nameInput").value;

  const ref = doc(db, "classes", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) return alert("Invalid code");

  currentClass = code;

  const studentRef = await addDoc(
    collection(db, "classes", code, "students"),
    { name: name, xp: 0 }
  );

  currentStudentId = studentRef.id;

  document.getElementById("joinArea").classList.add("hidden");
  document.getElementById("studentDashboard").classList.remove("hidden");

  document.getElementById("welcomeName").innerText = "Welcome " + name;

  listenStudentAssignments();
};

// Add assignment
window.addAssignment = async function() {
  const text = document.getElementById("assignmentInput").value;

  await addDoc(collection(db, "classes", currentClass, "assignments"), {
    text: text
  });
};

// Listen students
function listenStudents() {
  onSnapshot(collection(db, "classes", currentClass, "students"), snap => {
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    snap.forEach(doc => {
      let li = document.createElement("li");
      li.textContent = doc.data().name + " (XP: " + doc.data().xp + ")";
      list.appendChild(li);
    });
  });
}

// Listen assignments (teacher)
function listenAssignments() {
  onSnapshot(collection(db, "classes", currentClass, "assignments"), snap => {
    const list = document.getElementById("assignmentList");
    list.innerHTML = "";

    snap.forEach(doc => {
      let li = document.createElement("li");
      li.textContent = doc.data().text;
      list.appendChild(li);
    });
  });
}

// Student view assignments
function listenStudentAssignments() {
  onSnapshot(collection(db, "classes", currentClass, "assignments"), snap => {
    const list = document.getElementById("studentAssignments");
    list.innerHTML = "";

    snap.forEach(docSnap => {
      let li = document.createElement("li");
      li.textContent = docSnap.data().text;

      let btn = document.createElement("button");
      btn.textContent = "Complete";

      btn.onclick = async () => {
        const studentRef = doc(
          db,
          "classes",
          currentClass,
          "students",
          currentStudentId
        );

        await updateDoc(studentRef, {
          xp: incrementXP()
        });
      };

      li.appendChild(btn);
      list.appendChild(li);
    });
  });
}

// XP system
function incrementXP() {
  let currentXP = parseInt(document.getElementById("xp").innerText);
  let newXP = currentXP + 10;

  document.getElementById("xp").innerText = newXP;

  return newXP;
}
