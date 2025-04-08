// Function to fetch languages and populate the dropdown
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
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Function to handle the fetch button click event
async function fetchRepo() {
  const card = document.getElementById("repo-detail");
  const fetchButton = document.getElementById("fetch");
  const refreshButton = document.getElementById("refresh");
  const retryButton = document.getElementById("retry");

  // Disable the fetch button to prevent multiple clicks during the fetch
  fetchButton.disabled = true;
  card.innerText = "Fetching...";

  try {
    const repoDetails = await getRandomRepo(selectedLang);

    // Show refresh button after the first fetch
    refreshButton.style.display = "inline-block";

    if (repoDetails) {
      card.innerText = `
                Repo Name: ${repoDetails.name}
                Language: ${repoDetails.language}
                Description: ${repoDetails.description}
                Stars: ${repoDetails.stars}
                Forks: ${repoDetails.forks}
                Open Issues: ${repoDetails.openIssues}
            `;
    } else {
      card.innerText = "No repository found!";
    }
  } catch (error) {
    // Show the retry button if an error occurs
    retryButton.style.display = "inline-block";

    if (error.message.includes("API rate limit exceeded")) {
      card.innerText =
        "Error: API rate limit exceeded. Please wait or authenticate with a GitHub token.";
    } else {
      card.innerText = `Error: ${error.message}`;
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
  document.getElementById("repo-detail").innerText = "Retrying...";
  fetchRepo();
});
