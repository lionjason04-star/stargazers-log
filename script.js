const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const repositoryStatus = document.querySelector("#repository-status");

function getFallbackRepositories() {
  const fallback = document.querySelector("#repository-fallback");

  if (!fallback) {
    return [];
  }

  try {
    return JSON.parse(fallback.textContent);
  } catch (error) {
    console.error("Unable to parse fallback repositories.", error);
    return [];
  }
}

function validateRepositories(data) {
  if (!Array.isArray(data)) {
    throw new Error("Repository data must be an array.");
  }

  return data.filter((repository) => {
    if (!repository || typeof repository !== "object") {
      return false;
    }

    let validUrl = false;

    try {
      const url = new URL(repository.url, window.location.href);
      validUrl = url.protocol === "https:" && url.hostname === "github.com";
    } catch {
      return false;
    }
    const validDate = !Number.isNaN(new Date(repository.starredAt).getTime());

    return typeof repository.name === "string" && repository.name.trim() !== ""
      && typeof repository.description === "string"
      && typeof repository.language === "string"
      && Number.isFinite(repository.stars) && repository.stars >= 0
      && validDate && validUrl;
  });
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

function formatStars(stars) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}

function renderRepositories(repositories) {
  repositoryCount.textContent = `${repositories.length} repositories`;
  repositoryStatus.textContent = "";
  repositoryStatus.hidden = true;
  repositoryList.replaceChildren();

  if (repositories.length === 0) {
    showStatus("No starred repositories yet.");
    return;
  }

  repositories.forEach((repository) => {
    const item = document.createElement("li");
    const article = document.createElement("article");
    const heading = document.createElement("h3");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const metadata = document.createElement("p");

    item.className = "repository-card";
    article.className = "repository-card-content";
    link.href = repository.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repository.name;
    description.className = "repository-description";
    description.textContent = repository.description;
    metadata.className = "repository-meta";
    metadata.textContent = `${repository.language} | ${formatStars(repository.stars)} stars | Starred ${formatDate(repository.starredAt)}`;

    heading.append(link);
    article.append(heading, description, metadata);
    item.append(article);
    repositoryList.append(item);
  });
}

function showStatus(message) {
  repositoryStatus.textContent = message;
  repositoryStatus.hidden = false;
}

async function loadRepositories() {
  try {
    const data = window.location.protocol === "file:"
      ? getFallbackRepositories()
      : await fetch("events.json").then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load repositories: ${response.status}`);
        }

        return response.json();
      });

    const repositories = validateRepositories(data);
    renderRepositories(repositories);
  } catch (error) {
    repositoryCount.textContent = "";
    repositoryList.replaceChildren();
    showStatus("Could not load starred repositories.");
    console.error(error);
  }
}

loadRepositories();