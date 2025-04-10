// Function to fetch languages and populate the dropdown
const card = document.getElementById("repo-detail");

async function getLanguages() {
  const url =
    "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
  const parentEl = document.getElementById("lang");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
      return;
    }

    const json = await response.json();

    // Loop through languages and create option elements
    for (const language of json.slice(1)) {
      const opt = document.createElement("option");
      opt.innerText = language.value;
      opt.value = language.value;
      parentEl.append(opt);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Call getLanguages to populate the language dropdown on page load
getLanguages();

// Store the selected language
let selectedLang;
document.getElementById("lang").addEventListener("change", (e) => {
  selectedLang = e.target.value;
  console.log(selectedLang);
});

// Function to fetch a random repo based on the selected language
async function getRandomRepo(language) {
  const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;

  try {
    const response = await fetch(url);

    // Check if the API rate limit is exceeded
    if (response.status === 403) {
      const errorJson = await response.json();
      if (
        errorJson.message &&
        errorJson.message.includes("API rate limit exceeded")
      ) {
        card.innerHTML =
            '<div class="error-message">Error: API rate limit exceeded. Please wait or authenticate with a GitHub token.</div>';
        console.error(
          "API rate limit exceeded. Please wait or authenticate with a personal access token.",
        );
      }
    }

    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
      return;
    }

    const json = await response.json();

    if (json.items && json.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.items.length);
      const randomRepo = json.items[randomIndex];

      return {
        name: randomRepo.name,
        language: randomRepo.language,
        description: randomRepo.description ?? "No description provided.",
        stars: randomRepo.stargazers_count,
        forks: randomRepo.forks_count,
        openIssues: randomRepo.open_issues_count,
        html_url: randomRepo.html_url,
        owner: randomRepo.owner.login,
        avatar_url: randomRepo.owner.avatar_url,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Function to create a language badge with appropriate color
function createLanguageBadge(language) {
  const languageColors = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Python: "#3776AB",
    Java: "#B07219",
    "C#": "#178600",
    PHP: "#4F5D95",
    "C++": "#F34B7D",
    Ruby: "#CC342D",
    Go: "#00ADD8",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Rust: "#DEA584",
  };

  const color = languageColors[language] || "#858585";

  return `<span class="language-badge" style="background-color: ${color}4D">
    <span class="language-dot" style="background-color: ${color}"></span>
    ${language}
  </span>`;
}

// Function to handle the fetch button click event
async function fetchRepo() {
  const fetchButton = document.getElementById("fetch");
  const refreshButton = document.getElementById("refresh");
  const retryButton = document.getElementById("retry");

  // Disable the fetch button to prevent multiple clicks during the fetch
  fetchButton.disabled = true;
  card.innerHTML = '<div class="loading">Fetching repository...</div>';

  try {
    const repoDetails = await getRandomRepo(selectedLang);

    // Show refresh button after the first fetch
    refreshButton.style.display = "inline-block";

    if (repoDetails) {
      // Format stars, forks, and issues with commas for thousands
      const formattedStars = repoDetails.stars.toLocaleString();
      const formattedForks = repoDetails.forks.toLocaleString();
      const formattedIssues = repoDetails.openIssues.toLocaleString();

      card.innerHTML = `
        <div class="repo-card">
          <div class="repo-name">
            <h3><a href="${repoDetails.html_url}" target="_blank">${repoDetails.name}</a></h3>
          </div>
          
          <div class="repo-description">
            ${repoDetails.description}
          </div>
          
          <div class="repo-language">
            ${createLanguageBadge(repoDetails.language)}
          </div>
          
          <div class="repo-stats">
            <div class="stat">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star mr-2">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
              </svg>
              ${formattedStars}
            </div>
            <div class="stat">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
              </svg>
              ${formattedForks}
            </div>
            <div class="stat">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
              </svg>
              ${formattedIssues}
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    // Show the retry button if an error occurs
    retryButton.style.display = "inline-block";

    if (error.message.includes("API rate limit exceeded")) {
      card.innerHTML =
        '<div class="error-message">Error: API rate limit exceeded. Please wait or authenticate with a GitHub token.</div>';
    } else {
      card.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
  } finally {
    // Re-enable the fetch button after the fetch process is done
    fetchButton.disabled = false;
  }
}

// Event listeners for the buttons
document.getElementById("fetch").addEventListener("click", fetchRepo);

// Refresh button to fetch a new repo
document.getElementById("refresh").addEventListener("click", fetchRepo);

// Retry button (to retry fetch after an error)
document.getElementById("retry").addEventListener("click", () => {
  document.getElementById("repo-detail").innerHTML =
    '<div class="loading">Retrying...</div>';
  fetchRepo();
});
