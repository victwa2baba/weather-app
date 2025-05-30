import "./style.css";
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import image from "./img/ripples.svg";


// preloader
function preloader() {
  // Create preloader element
  const preloaderDiv = document.createElement("div");
  preloaderDiv.className = "preloader";

  // Add loading spinner image
  const loadingImg = document.createElement("img");
  loadingImg.src = image;
  loadingImg.alt = "Loading...";

  // Append elements
  preloaderDiv.appendChild(loadingImg);
  content.appendChild(preloaderDiv);

  return preloaderDiv;
}

// view form preloader
function viewFormPreloader() {
  const preloaderDiv = preloader();
  setTimeout(() => {
    preloaderDiv.classList.add("fade-out");
    setTimeout(() => {
      preloaderDiv.remove();
      // viewTodoForm();
    }, 300); // Wait for fade animation to complete
  }, 1000);
}


// Dark mode toggle logic
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const content = document.querySelector("#content");



// set theme
function setTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    toggleButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    body.classList.remove("dark-mode");
    toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  if (body.classList.contains("dark-mode")) {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

toggleButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleTheme();
});

// On page load, set theme from localStorage or system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}
