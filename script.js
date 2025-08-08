
const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const details = document.getElementById('details');
const HASH = 'NzNmMmI3NjU='; 
const API_KEY = atob(HASH); 

input.addEventListener('input', async () => {
  const query = input.value.trim();
  details.innerHTML = ''; 
  if (!query) {
    results.innerHTML = '';
    return;
  }

  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
  const data = await response.json();

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
});

// Click handler for movie cards
results.addEventListener('click', async (e) => {
  const movieCard = e.target.closest('.movie');
  if (!movieCard) return;

  const imdbID = movieCard.getAttribute('data-id');
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const movie = await response.json();

  details.innerHTML = `
    <h2>${movie.Title} (${movie.Year})</h2>
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}" height="200">
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
  `;
});
