const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

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

  if (repositories.length === 0) {
    repositoryList.innerHTML = '<p class="status-message">No starred repositories yet.</p>';
    return;
  }

  repositoryList.innerHTML = repositories.map((repository) => `
    <article class="repository-card">
      <h3><a href="${repository.url}" target="_blank" rel="noreferrer">${repository.name}</a></h3>
      <p class="repository-description">${repository.description}</p>
      <p class="repository-meta">
        <span>${repository.language}</span>
        <span>${formatStars(repository.stars)} stars</span>
        <span>Starred ${formatDate(repository.starredAt)}</span>
      </p>
    </article>
  `).join("");
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Unable to load repositories: ${response.status}`);
    }

    const repositories = await response.json();
    renderRepositories(repositories);
  } catch (error) {
    repositoryCount.textContent = "";
    repositoryList.innerHTML = '<p class="status-message">Could not load starred repositories.</p>';
    console.error(error);
  }
}

loadRepositories();