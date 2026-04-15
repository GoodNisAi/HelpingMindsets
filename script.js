let classes = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 7);
}

function createClass() {
  let code = generateCode();
  classes[code] = [];

  alert("Class created! Code: " + code);
}

function joinClass() {
  let code = prompt("Enter class code:");

  if (classes[code]) {
    classes[code].push("Student");
    alert("Joined class!");
  } else {
    alert("Invalid code.");
  }
}
