// Sign In
const form = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  if (username === "admin" && password === "admin123") {
    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    getAllIssues();
  } else {
    alert("Invalid credentials");
  }
});

// Load All The Issues
async function getAllIssues() {
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const json = await res.json();
  displayIssues(json.data);
}

// Display Issues
function displayIssues(issues) {
  const issuesContainer = document.getElementById("issues-container");
  issues.forEach((issue) => {
    const element = document.createElement("div");
    element.innerHTML = `<div
                class="card shadow-sm divide-y divide-gray-200 space-y-2 border-t-4 ${issue.status === "open" ? "border-t-green-600" : "border-t-purple-600"} cursor-pointer"
                onclick="my_modal.showModal()"
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
    <p class="text-${color}-600 bg-${color}-100 text-sm font-medium px-4 py-0.5 rounded-full uppercase">
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
