import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  increment,
  updateDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBQnhMU-9h2VCarsyGgEm1f2RFw5OuO84c",
  authDomain: "helpingmindesets.firebaseapp.com",
  projectId: "helpingmindesets"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentClass = "";
let currentStudentId = "";

// NAV
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

// AUTH
window.signup = async function() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "teachers", userCred.user.uid), {
    email: email
  });
};

window.login = async function() {
  await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
};

window.logout = function() {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  currentUser = user;
  document.getElementById("userInfo").innerText =
    user ? "Logged in: " + user.email : "Not logged in";
});

// CREATE CLASS
window.createClass = async function() {
  if (!currentUser) return alert("Login first");

  const code = Math.random().toString(36).substring(2, 7);
  currentClass = code;

  await setDoc(doc(db, "classes", code), {
    teacherId: currentUser.uid
  });

  document.getElementById("classCode").innerText = code;

  updateStats();
};

// JOIN CLASS
window.joinClass = async function() {
  const code = codeInput.value;
  const name = nameInput.value;

  const ref = doc(db, "classes", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) return alert("Invalid");

  currentClass = code;

  const studentRef = await addDoc(
    collection(db, "classes", code, "students"),
    { name: name, xp: 0 }
  );

  currentStudentId = studentRef.id;

  document.getElementById("studentDashboard").classList.remove("hidden");

  listenXP();
  listenAssignmentsStudent();
};

// ASSIGNMENTS
window.addAssignment = async function() {
  await addDoc(collection(db, "classes", currentClass, "assignments"), {
    text: assignmentInput.value
  });
};

// STUDENT XP LISTENER
function listenXP() {
  const ref = doc(db, "classes", currentClass, "students", currentStudentId);

  onSnapshot(ref, snap => {
    document.getElementById("xp").innerText = snap.data().xp;
  });
}

// STUDENT ASSIGNMENTS
function listenAssignmentsStudent() {
  onSnapshot(collection(db, "classes", currentClass, "assignments"), snap => {
    const list = studentAssignments;
    list.innerHTML = "";

    snap.forEach(docSnap => {
      let li = document.createElement("li");
      li.textContent = docSnap.data().text;

      let btn = document.createElement("button");
      btn.textContent = "Complete";

      btn.onclick = async () => {
        const ref = doc(
          db,
          "classes",
          currentClass,
          "students",
          currentStudentId
        );

        await updateDoc(ref, {
          xp: increment(10)
        });
      };

      li.appendChild(btn);
      list.appendChild(li);
    });
  });
}

// SAFE GLOBAL STATS
async function updateStats() {
  const teachers = await getDocs(collection(db, "teachers"));
  const classes = await getDocs(collection(db, "classes"));

  let studentTotal = 0;

  for (let c of classes.docs) {
    const students = await getDocs(
      collection(db, "classes", c.id, "students")
    );
    studentTotal += students.size;
  }

  teacherCount.innerText = teachers.size;
  classCount.innerText = classes.size;
  studentCount.innerText = studentTotal;
}

updateStats();
