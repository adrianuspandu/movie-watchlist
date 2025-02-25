const apiKey = '5fc6becc'
const moviesWrapper = document.getElementById('movies-wrapper')

let searchResultsArray = []
let watchlistArray = []

if (localStorage.getItem("watchlistIds")) {
  watchlistArray = JSON.parse(localStorage.getItem('watchlistIds'))
}

renderWatchlist()

function renderWatchlist() {
    moviesWrapper.innerHTML = ''
    getMovieProperties(watchlistArray)
}


async function getMovieProperties(movieArray) {
    for (let movieItem of movieArray) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieItem}`)
        const data = await response.json()
        renderMovie(data)
    }
}

function renderMovie(movieData) {
    moviesWrapper.innerHTML += 
        `
        <div id="movie-item-${movieData.imdbID}" class="movie-item">
          <div class="poster-container">
            <img class="movie-poster" src="${movieData.Poster}" />
          </div>

          <div class="column-container">
            <div class="top-container">
              <h2 class="movie-title">${movieData.Title}</h2>
              <img src="assets/star.svg" class="star-icon" />
              <p class="movie-rating">${movieData.imdbRating}</p>
            </div>

            <div class="middle-container">
              <p class="movie-duration">${movieData.Runtime}</p>
              <p class="movie-genres">${movieData.Genre}</p>
              <button id="toggle-watchlist-button-${movieData.imdbID}" class="toggle-watchlist-button" data-watchlist="${movieData.imdbID}">
                <img class="toggle-icon" src="assets/remove.svg" />Remove
              </button>
            </div>

            <p class="movie-synopsis">
              ${movieData.Plot}</p>
          </div>
        </div>`
    if (watchlistArray.includes(movieData.imdbID)) {
      document.getElementById(`toggle-watchlist-button-${movieData.imdbID}`).innerHTML = `<img class="toggle-icon" src="assets/remove.svg" />Remove`
    }
}

// REMOVE FROM WATCHLIST FUNCTIONALITY
moviesWrapper.addEventListener("click", removeFromWatchlist)

function removeFromWatchlist(e) {
  if (e.target.dataset.watchlist) {
    const index = watchlistArray.indexOf(e.target.dataset.watchlist)
    if (index > -1) { // only splice array when item is found
        watchlistArray.splice(index, 1); // 2nd parameter means remove one item only
        }
    localStorage.setItem('watchlistIds', JSON.stringify(watchlistArray))
    console.log(watchlistArray)
    renderWatchlist()
  }
}