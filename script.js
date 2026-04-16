import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// NAV
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

// AUTH
window.signup = async function() {
  const user = await createUserWithEmailAndPassword(auth, email.value, password.value);

  await setDoc(doc(db, "teachers", user.user.uid), {
    email: email.value
  });
};

window.login = async function() {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

onAuthStateChanged(auth, user => {
  currentUser = user;

  if (user) {
    teacherPanel.classList.remove("hidden");
    loginWarning.style.display = "none";
  } else {
    teacherPanel.classList.add("hidden");
    loginWarning.style.display = "block";
  }
});

// CREATE CLASS
window.createClass = async function() {
  const code = Math.random().toString(36).substring(2, 7);
  currentClass = code;

  await setDoc(doc(db, "classes", code), {
    teacherId: currentUser.uid
  });

  classCode.innerText = "Class Code: " + code;
};

// GENERATE STUDENT CODES (IMPORTANT 🔑)
window.generateStudentCodes = async function() {
  studentCodes.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 7);

    await addDoc(collection(db, "classes", currentClass, "students"), {
      name: "Student",
      xp: 0,
      code: code
    });

    let li = document.createElement("li");
    li.textContent = code;
    studentCodes.appendChild(li);
  }
};

// STUDENT JOIN WITH CODE
window.joinWithCode = async function() {
  const codeInputVal = studentCodeInput.value;

  const classesSnap = await getDocs(collection(db, "classes"));

  for (let classDoc of classesSnap.docs) {
    const studentsSnap = await getDocs(
      collection(db, "classes", classDoc.id, "students")
    );

    for (let student of studentsSnap.docs) {
      if (student.data().code === codeInputVal) {
        studentDashboard.classList.remove("hidden");
        studentName.innerText = "Welcome!";
        xp.innerText = student.data().xp;
        return;
      }
    }
  }

  alert("Invalid code");
};

// SUBJECTS
window.addSubject = async function() {
  const name = subjectInput.value;

  await addDoc(collection(db, "classes", currentClass, "subjects"), {
    name: name
  });

  loadSubjects();
};

async function loadSubjects() {
  const snap = await getDocs(collection(db, "classes", currentClass, "subjects"));

  subjectList.innerHTML = "";

  snap.forEach(doc => {
    let li = document.createElement("li");
    li.textContent = doc.data().name;
    subjectList.appendChild(li);
  });
}
