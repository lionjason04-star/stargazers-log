// Fetch and render the starred repositories
async function loadRepositories() {
  const container = document.getElementById('repositories-container');
  
  try {
    container.innerHTML = '<div class="loading">Loading starred repositories...</div>';
    
    // Fetch the events.json file
    const response = await fetch('events.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events.json: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.repositories || data.repositories.length === 0) {
      container.innerHTML = '<div class="error">No starred repositories found.</div>';
      return;
    }
    
    // Render each repository
    const repositoriesHTML = data.repositories
      .map(repo => createRepositoryCard(repo))
      .join('');
    
    container.innerHTML = repositoriesHTML;
  } catch (error) {
    console.error('Error loading repositories:', error);
    container.innerHTML = `
      <div class="error">
        Error loading repositories: ${error.message}
      </div>
    `;
  }
}

// Create HTML card for a single repository
function createRepositoryCard(repo) {
  const starredDate = new Date(repo.starredAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const starsFormatted = formatNumber(repo.stars);
  
  return `
    <div class="repo-card">
      <div class="repo-header">
        <a href="${repo.url}" class="repo-name" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(repo.name)}
        </a>
        <a href="${repo.url}" class="repo-link" target="_blank" rel="noopener noreferrer">
          Visit Repository →
        </a>
      </div>
      
      <p class="repo-description">${escapeHtml(repo.description)}</p>
      
      <div class="repo-meta">
        <div class="meta-item">
          <span class="language-badge">${escapeHtml(repo.language)}</span>
        </div>
        <div class="meta-item">
          <span class="stars">⭐ ${starsFormatted} stars</span>
        </div>
        <div class="meta-item">
          <span class="starred-date">Starred on ${starredDate}</span>
        </div>
      </div>
    </div>
  `;
}

// Format large numbers (e.g., 207000 -> 207K)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// Escape HTML special characters for security
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Load repositories when the page loads
document.addEventListener('DOMContentLoaded', loadRepositories);
