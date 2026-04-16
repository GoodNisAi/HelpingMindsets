import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc,
  collection, addDoc, onSnapshot, increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp({
  apiKey: "AIzaSy...",
  authDomain: "helpingmindesets.firebaseapp.com",
  projectId: "helpingmindesets"
});

const db = getFirestore(app);
const auth = getAuth(app);

let user = null;
let currentClass = "";
let currentSubject = "";

// NAV
window.show = (id) => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

// AUTH
window.signup = async () => {
  const u = await createUserWithEmailAndPassword(auth, email.value, password.value);
  await setDoc(doc(db, "teachers", u.user.uid), { email: email.value });
};

window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

onAuthStateChanged(auth, u => {
  user = u;
  userInfo.innerText = u ? u.email : "Not logged in";

  if (u) {
    teacherPanel.classList.remove("hidden");
    teacherLock.style.display = "none";
  }
});

// CLASS
window.createClass = async () => {
  currentClass = Math.random().toString(36).substring(2, 7);

  await setDoc(doc(db, "classes", currentClass), {
    teacherId: user.uid
  });

  classCode.innerText = currentClass;
};

// STUDENT CODES
window.generateCodes = async () => {
  codesList.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    let code = Math.random().toString(36).substring(2, 7);

    await setDoc(doc(db, "studentCodes", code), {
      classId: currentClass,
      xp: 0
    });

    let li = document.createElement("li");
    li.textContent = code;
    codesList.appendChild(li);
  }
};

// SUBJECTS
window.addSubject = async () => {
  await addDoc(collection(db, "classes", currentClass, "subjects"), {
    name: subjectInput.value
  });

  loadSubjects();
};

async function loadSubjects() {
  const snap = await getDocs(collection(db, "classes", currentClass, "subjects"));

  subjectList.innerHTML = "";

  snap.forEach(d => {
    let li = document.createElement("li");
    li.textContent = d.data().name;

    li.onclick = () => {
      currentSubject = d.id;
      loadAssignments();
    };

    subjectList.appendChild(li);
  });
}

// ASSIGNMENTS
window.addAssignment = async () => {
  await addDoc(
    collection(db, "classes", currentClass, "subjects", currentSubject, "assignments"),
    { text: assignmentInput.value }
  );
};

function loadAssignments() {
  onSnapshot(
    collection(db, "classes", currentClass, "subjects", currentSubject, "assignments"),
    snap => {
      assignmentList.innerHTML = "";

      snap.forEach(d => {
        let li = document.createElement("li");
        li.textContent = d.data().text;
        assignmentList.appendChild(li);
      });
    }
  );
}

// STUDENT JOIN
window.join = async () => {
  const code = studentCodeInput.value;
  const snap = await getDoc(doc(db, "studentCodes", code));

  if (!snap.exists()) return alert("Invalid code");

  currentClass = snap.data().classId;

  studentDash.classList.remove("hidden");

  loadStudentAssignments(code);
};

// STUDENT ASSIGNMENTS
function loadStudentAssignments(code) {
  onSnapshot(
    collection(db, "classes", currentClass, "subjects", currentSubject, "assignments"),
    snap => {
      studentAssignments.innerHTML = "";

      snap.forEach(d => {
        let li = document.createElement("li");
        li.textContent = d.data().text;

        let btn = document.createElement("button");
        btn.textContent = "Complete";

        btn.onclick = async () => {
          await updateDoc(doc(db, "studentCodes", code), {
            xp: increment(10)
          });
        };

        li.appendChild(btn);
        studentAssignments.appendChild(li);
      });
    }
  );
}
