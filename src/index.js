import "./style.css";
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import {
  format,
  compareAsc,
  parseISO,
  isValid,
  formatDistanceToNow,
} from "date-fns";
import image from "./img/ripples.svg";
import { displayProjects } from "./display";
// import {sideBar} from './display';

// Format the date in a readable format for display
export function formatDate(dateString) {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "Invalid Date";
  }
  return format(date, "MMM dd, yyyy");
}

// Get relative time (e.g., "2 days ago", "in 3 days")
export function getRelativeTime(dateString) {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "Invalid Date";
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

// Sort todos by date
export function sortByDate(todos) {
  return todos.sort((a, b) =>
    compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)),
  );
}

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
      viewTodoForm();
    }, 300); // Wait for fade animation to complete
  }, 1000);
}

// alltask preloader
export function alltaskPreloader() {
  const preloaderDiv = preloader();
  setTimeout(() => {
    preloaderDiv.classList.add("fade-out");
    setTimeout(() => {
      preloaderDiv.remove();
      viewAllTasks();
    }, 300); // Wait for fade animation to complete
  }, 1000);
}

// Dark mode toggle logic
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
export const content = document.querySelector("#content");
const addTodoButton = document.querySelector(".addTodoButton");
const addProjectButton = document.querySelector(".addProjectButton");
export let projectArray = [];

// save to storage
export function saveToStorage() {
  localStorage.setItem("projectArray", JSON.stringify(projectArray));
}

// load from storage
export function loadFromStorage() {
  const data = localStorage.getItem("projectArray");
  if (data) {
    const parsed = JSON.parse(data);
    projectArray.length = 0; // Clear current array
    parsed.forEach((projData) => {
      const project = new Project(projData.project);
      projData.todos.forEach((todoData) => {
        const todo = new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.notes,
        );
        project.addTodo(todo);
      });
      projectArray.push(project);
    });
  } else if (!data && projectArray.length === 0) {
    projectArray = [
      {
        project: "My life",
        todos: [
          {
            title: "Esther's Birthday",
            description: "This is my wife's birthday",
            dueDate: "2025-06-12",
            priority: "high",
            notes: "we gonna celebrate it in style😉",
          },
        ],
      },
      {
        project: "Test",
        todos: [
          {
            title: "Run tests on the singularity app",
            description: "Check if the app is working as expected",
            dueDate: "2025-07-08",
            priority: "low",
            notes: "This is a test todo",
          },
        ],
      },
      {
        project: "Work",
        todos: [
          {
            title: "Listen to the new song",
            description: "Listen to the new song by the Mercy Chinwo",
            dueDate: "2025-08-08",
            priority: "low",
            notes: "This is a work todo",
          },
        ],
      },
    ];
  }
}

//project object
class Project {
  constructor(project) {
    this.project = project;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }
}

// create todo constructor
class Todo {
  constructor(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
  saveTodo(project) {
    project.addTodo(this);
  }
}

// helper function to find project by name
function findProjectByName(name) {
  return projectArray.find((proj) => proj.project === name);
}

// function to create and add new project to projectArray
function createProject(name) {
  const newProject = new Project(name);
  projectArray.push(newProject);
  return newProject;
}

// create project form view
function newProjectForm() {
  const projectContainer = document.createElement("div");
  projectContainer.id = "newProjectModal";
  projectContainer.setAttribute("class", "modal fade");
  projectContainer.setAttribute("aria-labelledby", "newProjectModal");
  const modalDialog = document.createElement("div");
  modalDialog.setAttribute("class", "modal-dialog modal-dialog-centered");
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");

  // Modal Header
  const modalHeader = document.createElement("div");
  modalHeader.setAttribute("class", "modal-header");
  const modalH1 = document.createElement("h1");
  modalH1.setAttribute("class", "modal-title fs-5");
  modalH1.id = "newProjectModalLabel";
  modalH1.textContent = "Create New Project";
  const closeBtnTop = document.createElement("button");
  closeBtnTop.type = "button";
  closeBtnTop.setAttribute("class", "btn-close");
  closeBtnTop.setAttribute("data-bs-dismiss", "modal");
  closeBtnTop.setAttribute("aria-label", "close");

  // Modal Body
  const modalBody = document.createElement("div");
  modalBody.setAttribute("class", "modal-body");
  const form = document.createElement("form");
  form.id = "newProjectForm";

  // Form Group
  const formGroup = document.createElement("div");
  formGroup.setAttribute("class", "mb-3");
  const formLabel = document.createElement("label");
  formLabel.setAttribute("for", "projectTitle");
  formLabel.setAttribute("class", "form-label");
  formLabel.textContent = "Project Title";
  const formInput = document.createElement("input");
  formInput.setAttribute("class", "form-control");
  formInput.type = "text";
  formInput.id = "projectTitle";
  formInput.name = "title";
  formInput.setAttribute("required", "");
  formInput.setAttribute("aria-describedby", "titleHelp");
  const formTitleHelp = document.createElement("div");
  formTitleHelp.setAttribute("class", "form-text");
  formTitleHelp.id = "titleHelp";
  formTitleHelp.textContent = "Let's give this project a name 😎";

  // Modal Footer
  const modalFooter = document.createElement("div");
  modalFooter.setAttribute("class", "modal-footer");
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("class", "btn btn-secondary");
  closeBtn.setAttribute("data-bs-dismiss", "modal");
  closeBtn.textContent = "Close";
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.setAttribute("class", "btn btn-primary");
  submitBtn.textContent = "Create Project";

  // Append elements
  content.appendChild(projectContainer);
  projectContainer.appendChild(modalDialog);
  modalDialog.appendChild(modalContent);

  // Append header
  modalContent.appendChild(modalHeader);
  modalHeader.appendChild(modalH1);
  modalHeader.appendChild(closeBtnTop);

  // Append body
  modalContent.appendChild(modalBody);
  modalBody.appendChild(form);
  form.appendChild(formGroup);
  formGroup.appendChild(formLabel);
  formGroup.appendChild(formInput);
  formGroup.appendChild(formTitleHelp);

  // Move submit button to form
  form.appendChild(submitBtn);

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectTitle = formInput.value.trim();

    if (projectTitle) {
      // Check if project already exists
      if (findProjectByName(projectTitle)) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "alert alert-danger mt-2";
        errorDiv.textContent = "A project with this name already exists!";
        formGroup.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
        return;
      }

      // Create new project
      createProject(projectTitle);

      // Close modal using Bootstrap Modal instance
      const modal = bootstrap.Modal.getInstance(projectContainer);
      if (modal) {
        modal.hide();
      }

      // Show success message
      const successAlert = document.createElement("div");
      successAlert.className =
        "alert alert-success alert-dismissible fade show position-fixed top-8 start-50 translate-middle-x mt-3";
      successAlert.setAttribute("role", "alert");
      successAlert.innerHTML = `<div class='container'>
        <p>Project "${projectTitle}" created successfully!</p>
        <button type="button" class="btn-close btn " data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => successAlert.remove(), 10000);

      // Reset form
      form.reset();

      // Refresh display
      displayProjects();
    }
    saveToStorage();
  });

  // Append modal to DOM
  document.body.appendChild(projectContainer);

  // Initialize Bootstrap modal
  return new bootstrap.Modal(projectContainer);
}

// project form preloader
function projectFormPreloader() {
  const preloaderDiv = preloader();
  setTimeout(() => {
    preloaderDiv.classList.add("fade-out");
    setTimeout(() => {
      preloaderDiv.remove();
      const modal = newProjectForm();
      modal.show();
    }, 300); // Wait for fade animation to complete
  }, 1000);
}

// launch create project form
addProjectButton.addEventListener("click", () => {
  projectFormPreloader();
});

// create todo View
const viewTodoForm = () => {
  const displayParent = document.querySelector(".projectJsParent");
  if (!displayParent) {
    console.error("projectJsParent element not found");
    return;
  }

  // Clear existing content
  displayParent.innerHTML = "";

  const display = document.createElement("div");
  display.style.overflowY = "auto";
  const header = document.createElement("h5");
  header.setAttribute("class", "pt-4");
  header.innerHTML = `<i class="bi bi-card-checklist"></i> Create Todo`;
  displayParent.appendChild(header);

  const container = document.createElement("div");
  container.setAttribute("class", "container pt-4 pb-100");
  const form = document.createElement("form");
  form.setAttribute("class", "addTodoForm");
  // title
  const titleWrapper = document.createElement("div");
  titleWrapper.setAttribute("class", "mb-3");
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.setAttribute("class", "form-label");
  titleLabel.textContent = "Title";
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("class", "form-control");
  titleInput.setAttribute("aria-describedby", "titleHelp");
  titleInput.setAttribute("required", "");
  titleInput.id = "title";
  const titleHelp = document.createElement("div");
  titleHelp.setAttribute("class", "form-text");
  titleHelp.id = "titleHelp";
  titleHelp.textContent = "What do you want to call this todo?";
  // description
  const descriptionWrapper = document.createElement("div");
  descriptionWrapper.setAttribute("class", "mb-3");
  const descriptionLabel = document.createElement("label");
  descriptionLabel.setAttribute("for", "description");
  descriptionLabel.setAttribute("class", "form-label");
  descriptionLabel.textContent = "Description";
  const descriptionInput = document.createElement("input");
  descriptionInput.setAttribute("type", "text");
  descriptionInput.setAttribute("class", "form-control");
  descriptionInput.setAttribute("aria-describedby", "descriptionHelp");
  descriptionInput.setAttribute("required", "");
  descriptionInput.id = "description";
  const descriptionHelp = document.createElement("div");
  descriptionHelp.setAttribute("class", "form-text");
  descriptionHelp.id = "descriptionHelp";
  descriptionHelp.textContent = "Describe this todo.";
  // date
  const dateWrapper = document.createElement("div");
  dateWrapper.setAttribute("class", "mb-3");
  const dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "date");
  dateLabel.setAttribute("class", "form-label");
  dateLabel.textContent = "Date";
  const dateInput = document.createElement("input");
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("class", "form-control");
  dateInput.setAttribute("aria-describedby", "dateHelp");
  dateInput.setAttribute("required", "");
  dateInput.id = "date";
  const dateHelp = document.createElement("div");
  dateHelp.setAttribute("class", "form-text");
  dateHelp.id = "dateHelp";
  dateHelp.textContent = "What is the deadline of this todo?";
  //priority
  const priorityWrapper = document.createElement("div");
  priorityWrapper.setAttribute("class", "mb-3");
  const priorityLabel = document.createElement("label");
  priorityLabel.setAttribute("for", "priority");
  priorityLabel.setAttribute("class", "form-label");
  priorityLabel.textContent = "Priority";
  const prioritySelect = document.createElement("select");
  prioritySelect.name = "priority";
  prioritySelect.id = "priority";
  prioritySelect.setAttribute("class", "form-select");
  prioritySelect.setAttribute("aria-describedby", "priHelp");
  prioritySelect.setAttribute("required", "");
  const option1 = document.createElement("option");
  option1.setAttribute("selected", "");
  option1.setAttribute("disabled", "");
  option1.textContent = "Select priority";
  const option2 = document.createElement("option");
  option2.value = "high";
  option2.textContent = "High";
  const option3 = document.createElement("option");
  option3.value = "medium";
  option3.textContent = "Medium";
  const option4 = document.createElement("option");
  option4.value = "low";
  option4.textContent = "Low";
  const priorityHelp = document.createElement("div");
  priorityHelp.id = "priHelp";
  priorityHelp.setAttribute("class", "form-text");
  priorityHelp.textContent = "How important is this todo?";
  //project
  const projectWrapper = document.createElement("div");
  projectWrapper.setAttribute("class", "mb-3");
  const projectLabel = document.createElement("label");
  projectLabel.setAttribute("for", "project");
  projectLabel.setAttribute("class", "form-label");
  projectLabel.textContent = "Project";
  const projectSelect = document.createElement("select");
  projectSelect.name = "project";
  projectSelect.id = "project";
  projectSelect.setAttribute("class", "form-select");
  projectSelect.setAttribute("aria-describedby", "proHelp");
  projectSelect.setAttribute("required", "");
  const projectOption1 = document.createElement("option");
  projectOption1.setAttribute("selected", "");
  projectOption1.setAttribute("disabled", "");
  projectOption1.textContent = "Existing projects";

  const projectHelp = document.createElement("div");
  projectHelp.id = "projectHelp";
  projectHelp.setAttribute("class", "form-text");
  projectHelp.textContent = "What project category does it fit into?";
  // notes
  const notesWrapper = document.createElement("div");
  notesWrapper.setAttribute("class", "form-floating mb-3");
  const notesTextarea = document.createElement("textarea");
  notesTextarea.setAttribute("class", "form-control");
  notesTextarea.placeholder = "Leave your notes here";
  notesTextarea.setAttribute("aria-describedby", "notesHelp");
  notesTextarea.setAttribute("required", "");
  const notesLabel = document.createElement("label");
  notesLabel.setAttribute("for", "notes");
  notesLabel.setAttribute("class", "fw-bold");
  notesLabel.textContent = "Notes";
  const notesHelp = document.createElement("div");
  notesHelp.id = "notesHelp";
  notesHelp.setAttribute("class", "form-text");
  notesHelp.textContent = "He who wants to be noticed must take notes 😃";
  // button
  const formSubmitButton = document.createElement("button");
  formSubmitButton.type = "submit";
  formSubmitButton.setAttribute("class", "btn btn-primary");
  formSubmitButton.textContent = "Create";

  // append all elements
  displayParent.appendChild(header);
  displayParent.appendChild(display);
  display.appendChild(container);
  container.appendChild(form);
  // append title
  form.appendChild(titleWrapper);
  titleWrapper.appendChild(titleLabel);
  titleWrapper.appendChild(titleInput);
  titleWrapper.appendChild(titleHelp);
  // append description
  form.appendChild(descriptionWrapper);
  descriptionWrapper.appendChild(descriptionLabel);
  descriptionWrapper.appendChild(descriptionInput);
  descriptionWrapper.appendChild(descriptionHelp);
  // append date
  form.appendChild(dateWrapper);
  dateWrapper.appendChild(dateLabel);
  dateWrapper.appendChild(dateInput);
  dateWrapper.appendChild(dateHelp);
  // append priority
  form.appendChild(priorityWrapper);
  priorityWrapper.appendChild(priorityLabel);
  priorityWrapper.appendChild(prioritySelect);
  prioritySelect.appendChild(option1);
  prioritySelect.appendChild(option2);
  prioritySelect.appendChild(option3);
  prioritySelect.appendChild(option4);
  priorityWrapper.appendChild(priorityHelp);
  // append project
  form.appendChild(projectWrapper);
  projectWrapper.appendChild(projectLabel);
  projectWrapper.appendChild(projectSelect);
  projectSelect.appendChild(projectOption1);
  // get the existing projects from the array
  projectArray.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.value = project.project;
    projectOption.textContent = project.project;
    projectSelect.appendChild(projectOption);
  });

  projectWrapper.appendChild(projectHelp);

  // append notes
  form.appendChild(notesWrapper);
  notesWrapper.appendChild(notesTextarea);
  notesWrapper.appendChild(notesLabel);
  notesWrapper.appendChild(notesHelp);
  // append button
  form.appendChild(formSubmitButton);

  // Add form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const description = descriptionInput.value;
    const dueDate = dateInput.value;
    const priority = prioritySelect.value;
    const notes = notesTextarea.value;
    const selectedProject = projectSelect.value;

    // Create new todo
    const newTodo = new Todo(title, description, dueDate, priority, notes);

    // Find selected project and save todo
    const targetProject = findProjectByName(selectedProject);
    if (targetProject) {
      newTodo.saveTodo(targetProject);
      displayProjects(); // Refresh display
      saveToStorage();
    }
  });
};

//display view for add todo
addTodoButton.addEventListener("click", () => {
  viewFormPreloader();
});

// view all tasks with button
export function viewAllTasks() {
  loadFromStorage();
  displayProjects();

  if (projectArray.length === 0) {
    return;
  }
}

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

// show all task, this is the landing page
viewAllTasks();
