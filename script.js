 
function toggleCustomLanguage() {

const selectedLanguage = document.getElementById("language").value;
const customBox = document.getElementById("customLanguage");

if (selectedLanguage === "Other") {
customBox.style.display = "block";
} else {
customBox.style.display = "none";
}

}


async function generateText() {

const text = document.getElementById("inputText").value.trim();
const mode = document.getElementById("mode").value;

let language = document.getElementById("language").value;

/* if user selects Other language */

if (language === "Other") {

language = document.getElementById("customLanguage").value.trim();

if (language === "") {
alert("Please enter your preferred language");
return;
}

}

/* check text */

if (text === "") {
alert("Please enter educational content");
return;
}

/* show loading */

document.getElementById("loading").style.display = "block";

try {

const response = await fetch("http://localhost:5000/generate", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
text: text,
mode: mode,
language: language
})

});

const data = await response.json();

/* hide loading */

document.getElementById("loading").style.display = "none";

/* show output */

document.getElementById("output").innerText =
data.result || "No output generated.";

/* show accessibility scores */

document.getElementById("beforeScore").innerText =
data.beforeScore ?? "--";

document.getElementById("afterScore").innerText =
data.afterScore ?? "--";

}

catch (error) {

document.getElementById("loading").style.display = "none";

console.error("Frontend Error:", error);

alert("Could not connect to backend server.");

}

}