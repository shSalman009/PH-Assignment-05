// Sign In
const form = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");
let allIssues = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username-input").value.trim();
  const password = document.getElementById("password-input").value.trim();

  if (username === "admin" && password === "admin123") {
    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    getAllIssues();
  } else {
    alert("Invalid credentials");
  }
});

// Toggle Tab
const tabContainer = document.getElementById("tab-buttons");
tabContainer.addEventListener("click", (event) => {
  const targets = ["all", "open", "closed"];
  const currentTarget = event.target.dataset.tab;

  if (!targets.includes(currentTarget)) return;

  const buttons = document.querySelectorAll("#tab-button");
  buttons.forEach((btn) => {
    btn.classList.remove("btn-primary");
  });

  event.target.classList.add("btn-primary");

  if (currentTarget === "all") {
    displayIssues(allIssues);
    return;
  }

  const filteredIssues = allIssues.filter((i) => i.status === currentTarget);
  displayIssues(filteredIssues);
});

// Update Count Status
function updateCount(count) {
  const element = document.getElementById("count-status");
  element.textContent = count;
}

// Fetch All The Issues
async function getAllIssues() {
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const json = await res.json();
  allIssues = json.data;
  displayIssues(allIssues);
}
// Fetch Single Issue
async function getSingleIssue(id) {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const json = await res.json();
  displaySingleIssue(json.data);
}

// Display Issues
function displayIssues(issues) {
  updateCount(issues.length);
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = "";
  issues.forEach((issue) => {
    const element = document.createElement("div");
    element.innerHTML = `<div
                class="card shadow-sm divide-y divide-gray-200 space-y-2 border-t-4 ${issue.status === "open" ? "border-t-green-600" : "border-t-purple-600"} cursor-pointer"
                onclick="getSingleIssue(${issue.id})"
              >
                <div class="p-4">
                  <div class="flex justify-between items-center mb-4">
                        ${issue.status === "open" ? '<img class="w-7" src="./assets/Open-Status.png" alt="" />' : ""}
                        ${issue.status === "closed" ? '<img class="w-7" src="./assets/Closed-Status.png" alt="" />' : ""}
                    
                        ${renderPriority(issue.priority)}
                  </div>
                  <h4 class="card-title mb-1">
                    ${issue.title}
                  </h4>
                  <p class="line-clamp-2 text-sm text-gray-500">
                    ${issue.description}
                  </p>
                  <div class="flex justify-start flex-wrap gap-2 mt-4">

                  ${renderLabels(issue.labels)}
              
                  </div>
                </div>
                <div class="p-4 space-y-1 text-start">
                  <p class="text-sm text-gray-500">#${issue.id} by ${issue.author}</p>
                  <p class="text-sm text-gray-500">${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>`;
    issuesContainer.appendChild(element);
  });
}
function renderPriority(priority) {
  const colors = {
    high: "red",
    medium: "yellow",
    low: "gray",
  };

  const color = colors[priority];
  if (!color) return "";

  return `
    <p class="text-${color}-600 bg-${color}-100 text-sm font-medium px-4 py-0.5 rounded-full uppercase inline-block">
      ${priority}
    </p>
  `;
}
function renderLabels(labels) {
  const labelConfig = {
    bug: {
      icon: "fa-solid fa-bug",
      color: "red",
    },
    "help wanted": {
      icon: "fa-regular fa-life-ring",
      color: "yellow",
    },
    enhancement: {
      icon: "fa-solid fa-wand-magic-sparkles",
      color: "green",
    },
    "good first issue": {
      icon: "fa-solid fa-seedling",
      color: "blue",
    },
    documentation: {
      icon: "fa-solid fa-book",
      color: "purple",
    },
  };

  return labels
    .map((l) => {
      const label = labelConfig[l];
      return `<p class="text-${label.color}-600 bg-${label.color}-100 font-medium px-3 py-0.5 rounded-full uppercase border border-${label.color}-200">
        <i class="${label.icon}"></i>
        ${l}
      </p>`;
    })
    .join("");
}

// Display Single Issue in Modal
function displaySingleIssue(issue) {
  const modalContainer = document.getElementById("modal-container");
  const modalEl = `<h3 class="text-xl font-bold mb-2">${issue.title}</h3>
          <div class="flex justify-start items-center gap-2">
            <div class="badge rounded-full text-white ${issue.status === "open" ? "bg-green-600" : "bg-purple-600"}">
              ${issue.status}
            </div>
            <p class="text-sm text-gray-500">
              • Opened by ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div class="flex justify-start flex-wrap gap-2 my-5">
              ${renderLabels(issue.labels)}
          </div>
          <p class="line-clamp-2 text-base text-gray-500">
           ${issue.description}
          </p>

          <div class="bg-base-200 rounded-md grid grid-cols-2 p-4 mt-5">
            <div class="text-start">
              <p class="text-lg text-gray-500">Assignee:</p>
              <h4 class="text-lg font-semibold">${issue.assignee}</h4>
            </div>
            <div class="text-start">
              <p class="text-lg text-gray-500">Priority:</p>
              ${renderPriority(issue.priority)}
            </div>
          </div>`;
  modalContainer.innerHTML = modalEl;
  document.getElementById("my_modal").showModal();
}

// Search Issues
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchValue = searchInput.value.trim();
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/${searchValue && `search?q=${searchValue}`}`;
  const res = await fetch(url);
  const json = await res.json();
  allIssues = json.data;
  displayIssues(json.data);
});
