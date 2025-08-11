const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const searchForm = document.getElementById('searchForm');
const details = document.getElementById('details');
const recommend = document.getElementById('recommendSection');

// Filter Elements
const filterSelect = document.getElementById('filterSelect');
const ratingsFilter = document.getElementById('ratingsFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingRange = document.getElementById('ratingRange');
const ratingValue = document.getElementById('ratingValue');
const yearSelect = document.getElementById('yearSelect');

const HASH = 'MTNhMjJhZTA='; 
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


window.addEventListener('DOMContentLoaded', async () => {
  const keyword = '2024'; // Focus on latest movies from 2024
  recommend.innerHTML = '<p>🎬 Loading latest movies...</p>';

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${keyword}&y=2024`);
    const data = await response.json();

    if (!data.Search) {
      recommend.innerHTML = '<p>😕 No recent movies found.</p>';
      return;
    }

    // Fetch detailed info for each movie
    const detailedMovies = await Promise.all(
      data.Search.map(async movie => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        return await res.json();
      })
    );

    // Filter movies with valid ratings and sort by IMDb rating descending
    const sortedRatedMovies = detailedMovies
      .filter(m => m.imdbRating && !isNaN(parseFloat(m.imdbRating)))
      .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
      .slice(0, 20); // Limit to top 5 rated movies

    recommend.innerHTML = sortedRatedMovies.length > 0
      ? `
        ${sortedRatedMovies.map(movie => `
          <div class="recommendSection" data-id="${movie.imdbID}">
            <div class="movie" data-id="${movie.imdbID}">
              <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}" height="100">
              <div>
                <h3>${movie.Title}</h3>
                <p>Rating: ${movie.imdbRating}</p>
                <p>Year: ${movie.Year}</p>
              </div>
            </div>
          </div>
        `).join('')}
      `
      : '<p>😐 No top-rated 2024 movies found.</p>';
  } catch (error) {
    recommend.innerHTML = '<p>⚠️ Error loading latest movies.</p>';
    console.error(error);
  }
});

// Fetch and display movies for the selected year
async function fetchMoviesByYear(year) {
  recommend.innerHTML = '<p>🎬 Loading movies...</p>';
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${year}`);
    const data = await response.json();

    if (!data.Search) {
      recommend.innerHTML = '<p>😕 No movies found for the selected year.</p>';
      return;
    }

    const detailedMovies = await Promise.all(
      data.Search.map(async movie => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        return await res.json();
      })
    );

    const sortedMovies = detailedMovies
      .filter(m => m.imdbRating && !isNaN(parseFloat(m.imdbRating)))
      .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

    recommend.innerHTML = sortedMovies.length > 0
      ? sortedMovies.map(movie => `
          <div class="recommendSection" data-id="${movie.imdbID}">
            <div class="movie">
              <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}" />
              <h3>${movie.Title}</h3>
              <p>Rating: ${movie.imdbRating}</p>
              <p>Year: ${movie.Year}</p>
            </div>
          </div>
        `).join('')
      : '<p>😐 No top-rated movies found for the selected year.</p>';
  } catch (error) {
    recommend.innerHTML = '<p>⚠️ Error loading movies.</p>';
    console.error(error);
  }
}

// Event listener for year selection
yearSelect.addEventListener('change', () => {
  const selectedYear = yearSelect.value;
  fetchMoviesByYear(selectedYear);
});


