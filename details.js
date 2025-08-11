const API_KEY = '73f2b765';
const details = document.getElementById('details');

function getImdbID() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchMovieDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  return await response.json();
}

(async () => {
  const imdbID = getImdbID();
  if (!imdbID) {
    details.innerHTML = '<p>No movie selected.</p>';
    return;
  }
  const movie = await fetchMovieDetails(imdbID);
  details.innerHTML = `
    <div class="details-title-row">
      <h2>${movie.Title} (${movie.Year})</h2>
    </div>
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}">
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
  `;
})();