// API KEY = 

// import CONFIG from "./config.js";
// console.log(CONFIG.API_KEY);
const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const searchForm = document.getElementById('searchForm');
const HASH = 'NzNmMmI3NjU='; 
const API_KEY = atob(HASH); 

async function searchMovies(query) {
  results.innerHTML = '';
  if (!query) {
    loading.style.display = 'none';
    return;
  }
  loading.style.display = 'block';
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
  const data = await response.json();
  loading.style.display = 'none';
  if (data.Search) {
    results.innerHTML = data.Search.map(movie => `
      <div class="movie" data-id="${movie.imdbID}">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}" height="100">
        <div>
          <h2>${movie.Title}</h2>
          <p>${movie.Year}</p>
        </div>
      </div>
    `).join('');
  } else {
    results.innerHTML = '<p>No results found.</p>';
  }
}

// Trigger search on form submit
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchMovies(input.value.trim());
});

// Click handler for movie cards
results.addEventListener('click', (e) => {
  const movieCard = e.target.closest('.movie');
  if (!movieCard) return;
  const imdbID = movieCard.getAttribute('data-id');
  window.location.href = `details.html?id=${imdbID}`;
});

input.addEventListener('input', () => {
  searchMovies(input.value.trim());
});
