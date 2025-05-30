// import { id } from "date-fns/locale";
import {
  content,
  projectArray,
  saveToStorage,
  viewAllTasks,
  formatDate,
  getRelativeTime,
  alltaskPreloader,
} from "./index.js";

// sideBar function to create the sidebar
export function sideBar() {
  // remove old gid
  const oldGrid = document.querySelector(".grid-container");
  if (oldGrid) oldGrid.remove();

  // create the container
  const gridContainer = document.createElement("div");
  gridContainer.setAttribute("class", "grid-container px-3");
  // aside
  const aside = document.createElement("aside");
  aside.setAttribute("class", "d-flex flex-column p-3 bg-light border-end");
  aside.style.width = "250px";
  aside.style.position = "fixed";
  aside.style.top = "56px";
  aside.style.left = "0";
  aside.style.bottom = "50px";
  aside.style.overflowY = "auto";
  const title = document.createElement("a");
  title.setAttribute(
    "class",
    "d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none pb-3",
  );
  title.innerHTML = `<span class="fs-4">Todo</span>`;
  const asideUl = document.createElement("ul");
  asideUl.id = "ulNav";
  asideUl.setAttribute("class", "nav nav-pills flex-column mb-auto");
  const asideLi1 = document.createElement("li");
  asideLi1.setAttribute("class", "nav-item mt-3");
  const asideA1 = document.createElement("a");
  asideA1.setAttribute("class", "nav-link text-dark active tasks");
  asideA1.innerHTML = `<i class="bi bi-speedometer2 me-2"></i>
                  All Tasks`;
  const asideLi2 = document.createElement("li");
  asideLi2.setAttribute("class", " mt-3");
  const asideP = document.createElement("p");
  asideP.setAttribute("class", "ms-3");
  asideP.innerHTML = `<i class="bi bi-journal-code me-2"></i>
                    Projects`;

  // append all elements
  content.appendChild(gridContainer);
  gridContainer.appendChild(aside);
  aside.appendChild(title);
  aside.appendChild(asideUl);
  asideUl.appendChild(asideLi1);
  asideLi1.appendChild(asideA1);
  asideUl.appendChild(asideLi2);
  asideLi2.appendChild(asideP);

  asideA1.addEventListener("click", (e) => {
    e.preventDefault();
    asideUl
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    asideLi1.classList.add("active");
    alltaskPreloader();
  });

  projectArray.forEach((proj) => {
    const projectLi = document.createElement("li");
    projectLi.setAttribute("class", "nav-item");
    const projectP = document.createElement("a");
    projectP.setAttribute("class", "nav-link text-dark");
    projectP.href = `${proj.project}`;
    projectP.innerHTML = `<i class="bi bi-archive me-2"></i> ${proj.project}`;
    asideUl.appendChild(projectLi);
    projectLi.appendChild(projectP);

    // Add click event to each project link
    projectP.addEventListener("click", (e) => {
      e.preventDefault();
      asideUl
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      // Add 'active' to the clicked link
      projectP.classList.add("active");
      displayProjectChildren(proj);
    });
  });
}
// display all todo
export function displayProjects() {
  if (projectArray.length === 0) {
    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("class", "grid-container");
    const container = document.createElement("div");
    container.setAttribute("class", "projectJsParent");
    container.innerText = "Please start by adding a project. 😗";
    content.appendChild(gridContainer);
    gridContainer.appendChild(container);
    console.log("nothing");
  } else {
    content.innerHTML = "";
    // create projectView
    const display = document.createElement("div");
    display.style.overflowY = "auto";
    const header = document.createElement("h5");
    header.setAttribute("class", "pt-4");
    header.innerHTML = `<i class="bi bi-list-task"></i> All Todo`;

    // Call sideBar once before the loop
    sideBar();

    const gridTemp = document.querySelector(".grid-container");
    if (!gridTemp) {
      console.error("grid-container element not found");
      return;
    }

    // Create projectJsParent if it doesn't exist
    let displayParent = document.querySelector(".projectJsParent");
    if (!displayParent) {
      displayParent = document.createElement("div");
      displayParent.className = "projectJsParent";
      displayParent.style.paddingBottom = "100px";
      gridTemp.appendChild(displayParent);
    }

    displayParent.appendChild(header);
    displayParent.appendChild(display);

    projectArray.forEach((project, index) => {
      // Create list group for todos
      const todoList = document.createElement("div");
      todoList.className = "d-grid";

      project.todos.forEach((todo, id) => {
        const todoContainer = document.createElement("div");
        todoContainer.setAttribute("class", "d-grid");
        const todoItem = document.createElement("div");
        todoItem.className = "project d-grid gap-3 container my-3";
        todoItem.style.gridTemplateColumns = "1fr 1fr 100px";

        // add priority styles
        if (todo.priority == "low") {
          todoItem.classList.add("low");
        } else if (todo.priority == "medium") {
          todoItem.classList.add("medium");
        } else {
          todoItem.classList.add("high");
        }

        // create edit button
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        button.type = "button";
        // Use unique id combining project index and todo index
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#collapse${index}-${id}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `collapse${index}-${id}`);
        button.textContent = "Details";

        // Create collapse container for todos
        const collapseDiv = document.createElement("div");
        collapseDiv.id = `collapse${index}-${id}`;
        collapseDiv.className = "collapse";

        todoItem.innerHTML = `
        <h5>${todo.title}</h5>
        <div>
          <i class="bi bi-calendar-event-fill"></i> ${formatDate(todo.dueDate)}
          <small class="text-muted ms-2">(${getRelativeTime(todo.dueDate)})</small>
        </div>`;

        // Populate collapseDiv with todo details and add Edit and Delete buttons
        collapseDiv.innerHTML = `
      <div class="d-grid">
        <div class="d-grid gap-2 mb-50" style="grid-column: span 3;">
          <p><strong>Description:</strong> ${todo.description}</p>
          <p><strong>Notes:</strong> ${todo.notes}</p>
          <p><strong>Priority:</strong> ${todo.priority}</p>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-sm btn-warning edit-btn">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
          </div>
        </div>
      </div>
        `;

        // Delete button event listener
        collapseDiv
          .querySelector(".delete-btn")
          .addEventListener("click", () => {
            const alert = document.createElement("div");
            alert.className =
              "alert alert-danger alert-dismissible mt-3 fade show";
            alert.textContent = "Are you sure you want to delete this?";
            alert.setAttribute("role", "alert");
            alert.setAttribute("aria-live", "assertive");
            alert.setAttribute("aria-atomic", "true");
            collapseDiv.innerHTML = "";
            alert.innerHTML = `
        <div class="container">
        <p class="py-3"> Are you sure you want to delete?</p>
        <button class="btn btn-danger yes me-2">Yes</button> 
        <button class="btn btn-success no me-2">No</button> </div>
       `;
            collapseDiv.appendChild(alert);
            confirmDelete();
          });

        // confirm delete
        function confirmDelete() {
          const yesButton = document.querySelector(".yes");
          const noButton = document.querySelector(".no");
          yesButton.addEventListener("click", () => {
            project.todos.splice(id, 1); // Remove todo from project
            saveToStorage();
            displayProjects(); // Refresh display
          });
          noButton.addEventListener("click", () => {
            displayProjects(); // Refresh display
          });
        }

        // Edit button event listener
        collapseDiv.querySelector(".edit-btn").addEventListener("click", () => {
          editTodo(project);
        });

        // edit function
        function editTodo(project) {
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
          header.innerHTML = `<i class="bi bi-card-checklist"></i> Edit Todo`;
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
          titleInput.value = todo.title;
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
          descriptionInput.value = todo.description;

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
          dateInput.value = todo.dueDate;
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
          option1.textContent = todo.priority;
          option1.setAttribute("selected", "");
          option1.setAttribute("disabled", "");
          const option2 = document.createElement("option");
          const option3 = document.createElement("option");
          const option4 = document.createElement("option");

          todo.priority === "high" ? (option2.textContent = "medium") : "low";
          todo.priority === "high" ? (option3.textContent = "low") : "medium";
          todo.priority === "high" ? (option2.value = "medium") : "low";
          todo.priority === "high" ? (option3.value = "low") : "medium";
          todo.priority === "medium" ? (option2.textContent = "low") : "high";
          todo.priority === "medium" ? (option3.textContent = "high") : "low";
          todo.priority === "medium" ? (option2.value = "low") : "high";
          todo.priority === "medium" ? (option3.value = "high") : "low";
          todo.priority === "low" ? (option2.textContent = "high") : "medium";
          todo.priority === "low" ? (option3.textContent = "medium") : "high";
          todo.priority === "low" ? (option2.value = "high") : "medium";
          todo.priority === "low" ? (option3.value = "medium") : "high";
          option4.textContent = todo.priority;
          option4.value = todo.priority;
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
          projectOption1.textContent = project.project;

          // notes
          const notesWrapper = document.createElement("div");
          notesWrapper.setAttribute("class", "form-floating mb-3");
          const notesTextarea = document.createElement("textarea");
          notesTextarea.setAttribute("class", "form-control");
          notesTextarea.placeholder = "Leave your notes here";
          notesTextarea.setAttribute("required", "");
          const notesLabel = document.createElement("label");
          notesLabel.setAttribute("for", "notes");
          notesLabel.setAttribute("class", "fw-bold");
          notesLabel.textContent = todo.notes;

          // button
          const formSubmitButton = document.createElement("button");
          formSubmitButton.type = "submit";
          formSubmitButton.setAttribute("class", "btn btn-success");
          formSubmitButton.textContent = "Save";

          // append all elements
          displayParent.appendChild(header);
          displayParent.appendChild(display);
          display.appendChild(container);
          container.appendChild(form);
          // append title
          form.appendChild(titleWrapper);
          titleWrapper.appendChild(titleLabel);
          titleWrapper.appendChild(titleInput);

          // append description
          form.appendChild(descriptionWrapper);
          descriptionWrapper.appendChild(descriptionLabel);
          descriptionWrapper.appendChild(descriptionInput);

          // append date
          form.appendChild(dateWrapper);
          dateWrapper.appendChild(dateLabel);
          dateWrapper.appendChild(dateInput);

          // append priority
          form.appendChild(priorityWrapper);
          priorityWrapper.appendChild(priorityLabel);
          priorityWrapper.appendChild(prioritySelect);
          prioritySelect.appendChild(option1);
          prioritySelect.appendChild(option2);
          prioritySelect.appendChild(option3);
          prioritySelect.appendChild(option4);

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

          // append notes
          form.appendChild(notesWrapper);
          notesWrapper.appendChild(notesTextarea);
          notesWrapper.appendChild(notesLabel);
          // append button
          form.appendChild(formSubmitButton);

          // handle form submission
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            todo.title = titleInput.value;
            todo.description = descriptionInput.value;
            todo.dueDate = dateInput.value;
            todo.priority = prioritySelect.value;
            project.project = projectSelect.value;
            todo.notes = notesTextarea.value;

            setTimeout(() => {
              viewAllTasks();
            }, 3000);
            saveToStorage();
          });
        }

        todoList.appendChild(todoContainer);
        todoContainer.appendChild(todoItem);
        todoItem.appendChild(button);
        todoContainer.appendChild(collapseDiv);
      });
      display.appendChild(todoList);
    });
  }
}

// display project childrens
function displayProjectChildren(proj) {
  // Use the grid-container created by sideBar
  let gridContainer = document.querySelector(".grid-container");
  if (!gridContainer) {
    sideBar();
    gridContainer = document.querySelector(".grid-container");
  }
  // Remove any previous projectJsParent
  let parentJs = gridContainer.querySelector(".projectJsParent");
  if (parentJs) parentJs.remove();

  parentJs = document.createElement("div");
  parentJs.setAttribute("class", "projectJsParent");
  parentJs.style.paddingBottom = "100px";
  gridContainer.appendChild(parentJs);

  // Project header
  const header = document.createElement("h5");
  header.setAttribute("class", "d-grid pt-4");
  header.style.gridTemplateColumns = "1fr 1fr";
  header.innerHTML = `<div><i class="bi bi-list-task"></i> ${proj.project} Todos</div> 
  <div class="d-flex justify-content-end">
    <button class="btn btn-danger deleteProject">
      <i class="bi bi-file-earmark-x"></i>
      </div>`;
  parentJs.appendChild(header);

  // delete a project
  const deleteBtn = header.querySelector(".deleteProject");
  const projectIndex = projectArray.findIndex(
    (p) => p.project === proj.project,
  );
  if (projectIndex > -1 && projectIndex < 3) {
    deleteBtn.setAttribute("disabled", "");
  } else {
    deleteBtn.removeAttribute("disabled");
    deleteBtn.addEventListener("click", () => {
      const alert = document.createElement("div");
      alert.className = "alert alert-danger alert-dismissible mt-3 fade show";
      alert.innerHTML = `
        <div class="container">
        <p class="py-3"> Are you sure you want to delete this project?</p>
        <button class="btn btn-danger yes me-2">Yes</button> 
        <button class="btn btn-success no me-2">No</button> </div>
      `;
      parentJs.innerHTML = "";
      parentJs.appendChild(alert);

      // Confirm delete
      alert.querySelector(".yes").addEventListener("click", () => {
        projectArray.splice(projectIndex, 1);
        saveToStorage();
        displayProjects();
      });
      alert.querySelector(".no").addEventListener("click", () => {
        displayProjectChildren(proj);
      });
    });
  }

  // Todos list
  const todoList = document.createElement("div");
  todoList.className = "d-grid";
  parentJs.appendChild(todoList);

  if (proj.todos.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "alert alert-info mt-3";
    emptyMsg.textContent = "No todos in this project yet.";
    todoList.appendChild(emptyMsg);
    return;
  }

  proj.todos.forEach((todo, id) => {
    const todoContainer = document.createElement("div");
    todoContainer.setAttribute("class", "d-grid");
    const todoItem = document.createElement("div");
    todoItem.className = "project d-grid gap-3 container my-3";
    todoItem.style.gridTemplateColumns = "1fr 1fr 100px";

    // Priority styling
    if (todo.priority == "low") {
      todoItem.classList.add("low");
    } else if (todo.priority == "medium") {
      todoItem.classList.add("medium");
    } else {
      todoItem.classList.add("high");
    }

    // Details button
    const button = document.createElement("button");
    button.className = "btn btn-primary";
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${id}`);
    button.textContent = "Details";

    // Collapse div
    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse${id}`;
    collapseDiv.className = "collapse";

    todoItem.innerHTML = `
      <h5>${todo.title}</h5>
      <div>
        <i class="bi bi-calendar-event-fill"></i> ${formatDate(todo.dueDate)}
        <small class="text-muted ms-2">(${getRelativeTime(todo.dueDate)})</small>
      </div>`;

    collapseDiv.innerHTML = `
      <div class="d-grid">
        <div class="d-grid gap-2 mb-50" style="grid-column: span 3;">
          <p><strong>Description:</strong> ${todo.description}</p>
          <p><strong>Notes:</strong> ${todo.notes}</p>
          <p><strong>Priority:</strong> ${todo.priority}</p>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-sm btn-warning edit-btn">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
          </div>
        </div>
      </div>
    `;

    // Delete button event
    collapseDiv.querySelector(".delete-btn").addEventListener("click", () => {
      const alert = document.createElement("div");
      alert.className = "alert alert-danger alert-dismissible mt-3 fade show";
      alert.innerHTML = `
        <div class="container">
        <p class="py-3"> Are you sure you want to delete?</p>
        <button class="btn btn-danger yes me-2">Yes</button> 
        <button class="btn btn-success no me-2">No</button> </div>
      `;
      collapseDiv.innerHTML = "";
      collapseDiv.appendChild(alert);

      // Confirm delete
      alert.querySelector(".yes").addEventListener("click", () => {
        proj.todos.splice(id, 1);
        saveToStorage();
        displayProjectChildren(proj);
      });
      alert.querySelector(".no").addEventListener("click", () => {
        displayProjectChildren(proj);
      });
    });

    // Edit button event
    collapseDiv.querySelector(".edit-btn").addEventListener("click", () => {
      editTodo(proj);
    });

    function editTodo(project) {
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
      header.innerHTML = `<i class="bi bi-card-checklist"></i> Edit Todo`;
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
      titleInput.value = todo.title;
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
      descriptionInput.value = todo.description;

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
      dateInput.value = todo.dueDate;
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
      option1.textContent = todo.priority;
      option1.setAttribute("selected", "");
      option1.setAttribute("disabled", "");
      const option2 = document.createElement("option");
      const option3 = document.createElement("option");
      const option4 = document.createElement("option");

      todo.priority === "high" ? (option2.textContent = "medium") : "low";
      todo.priority === "high" ? (option3.textContent = "low") : "medium";
      todo.priority === "high" ? (option2.value = "medium") : "low";
      todo.priority === "high" ? (option3.value = "low") : "medium";
      todo.priority === "medium" ? (option2.textContent = "low") : "high";
      todo.priority === "medium" ? (option3.textContent = "high") : "low";
      todo.priority === "medium" ? (option2.value = "low") : "high";
      todo.priority === "medium" ? (option3.value = "high") : "low";
      todo.priority === "low" ? (option2.textContent = "high") : "medium";
      todo.priority === "low" ? (option3.textContent = "medium") : "high";
      todo.priority === "low" ? (option2.value = "high") : "medium";
      todo.priority === "low" ? (option3.value = "medium") : "high";
      option4.textContent = todo.priority;
      option4.value = todo.priority;
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
      projectOption1.textContent = project.project;

      // notes
      const notesWrapper = document.createElement("div");
      notesWrapper.setAttribute("class", "form-floating mb-3");
      const notesTextarea = document.createElement("textarea");
      notesTextarea.setAttribute("class", "form-control");
      notesTextarea.placeholder = "Leave your notes here";
      notesTextarea.setAttribute("required", "");
      const notesLabel = document.createElement("label");
      notesLabel.setAttribute("for", "notes");
      notesLabel.setAttribute("class", "fw-bold");
      notesLabel.textContent = todo.notes;

      // button
      const formSubmitButton = document.createElement("button");
      formSubmitButton.type = "submit";
      formSubmitButton.setAttribute("class", "btn btn-success");
      formSubmitButton.textContent = "Save";

      // append all elements
      displayParent.appendChild(header);
      displayParent.appendChild(display);
      display.appendChild(container);
      container.appendChild(form);
      // append title
      form.appendChild(titleWrapper);
      titleWrapper.appendChild(titleLabel);
      titleWrapper.appendChild(titleInput);

      // append description
      form.appendChild(descriptionWrapper);
      descriptionWrapper.appendChild(descriptionLabel);
      descriptionWrapper.appendChild(descriptionInput);

      // append date
      form.appendChild(dateWrapper);
      dateWrapper.appendChild(dateLabel);
      dateWrapper.appendChild(dateInput);

      // append priority
      form.appendChild(priorityWrapper);
      priorityWrapper.appendChild(priorityLabel);
      priorityWrapper.appendChild(prioritySelect);
      prioritySelect.appendChild(option1);
      prioritySelect.appendChild(option2);
      prioritySelect.appendChild(option3);
      prioritySelect.appendChild(option4);

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

      // append notes
      form.appendChild(notesWrapper);
      notesWrapper.appendChild(notesTextarea);
      notesWrapper.appendChild(notesLabel);
      // append button
      form.appendChild(formSubmitButton);

      // handle form submission
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        todo.title = titleInput.value;
        todo.description = descriptionInput.value;
        todo.dueDate = dateInput.value;
        todo.priority = prioritySelect.value;
        project.project = projectSelect.value;
        todo.notes = notesTextarea.value;

        setTimeout(() => {
          viewAllTasks();
        }, 3000);
        saveToStorage();
      });
    }

    todoList.appendChild(todoContainer);
    todoContainer.appendChild(todoItem);
    todoItem.appendChild(button);
    todoContainer.appendChild(collapseDiv);
  });
}
