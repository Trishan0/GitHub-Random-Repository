async function getLanguages() {
  const url =
    "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
  const parentEl = document.getElementById("lang");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Response status : ${response.status}`);
    }

    const json = await response.json();

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

getLanguages();

let select = document.getElementById("lang");
let selectedLang;
select.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  console.log(selectedLang);
});

async function getRandomRepo(language) {
  const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;

  try {
    const response = await fetch(url);

    // Check if rate limit is exceeded
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

    // Check for other response errors
    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
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

async function fetchRepo() {
  const card = document.getElementById("repo-detail");
  card.innerText = "Fetching...";
  console.log("Fetching...");
  console.log("aaa...");

  try {
    const repoDetails = await getRandomRepo(selectedLang);

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
    if (error.message.includes("API rate limit exceeded")) {
      card.innerText =
        "Error: API rate limit exceeded. Please wait or authenticate with a GitHub token.";
    } else {
      card.innerText = `Error: ${error.message}`;
    }
  }
}

document.getElementById("fetch").addEventListener("click", fetchRepo);
document.getElementById("refresh").addEventListener("click", fetchRepo);
