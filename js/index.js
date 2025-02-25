const apiKey = '5fc6becc'
const searchForm = document.getElementById('search-form')
const searchBar = document.getElementById('search-bar')
const moviesWrapper = document.getElementById('movies-wrapper')
const emptyStateWrapper = document.getElementById('empty-state-wrapper')
const noResultsWrapper = document.getElementById('no-results-wrapper')

let searchResultsArray = []
let watchlistArray = []

if (localStorage.getItem("watchlistIds")) {
  watchlistArray = JSON.parse(localStorage.getItem('watchlistIds'))
}

clearInp()

function clearInp() {
    searchBar.value = ''
}

// SEARCH FUNCTIONALITY
searchForm.addEventListener('submit', handleSearchButton)

async function handleSearchButton(e) {
    e.preventDefault()
    clearSearchResults()
    emptyStateWrapper.style.display = 'none'
    noResultsWrapper.style.display = 'none'
    const searchInput = searchBar.value.replace(/\s/g, '+')
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`)
    const data = await response.json()
    console.log(data)
    if (data.Response === "True"){
      saveSearchIds(data)
    } else {
      noResultsWrapper.style.display = 'block'
    }
    
}

function clearSearchResults() {
    searchResultsArray = []
    moviesWrapper.innerHTML = ''
}
    
function saveSearchIds(data) {
    // push the imdb Ids to the searchResults
    //  array so we can later grab its properties, important: plot
    data.Search.forEach(function(item) {
        searchResultsArray.push(item.imdbID)
    })
    getMovieProperties(searchResultsArray)
}

async function getMovieProperties(movieArray) {
    for (let movieItem of movieArray) {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieItem}`)
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
              <div class="rating-container">
                <img src="assets/star.svg" class="star-icon" />
                <p class="movie-rating">${movieData.imdbRating}</p>
              </div>
            </div>

            <div class="middle-container">
              <p class="movie-duration">${movieData.Runtime}</p>
              <p class="movie-genres">${movieData.Genre}</p>
              <button id="toggle-watchlist-button-${movieData.imdbID}" class="toggle-watchlist-button" data-watchlist="${movieData.imdbID}">
                <img class="toggle-icon" src="assets/add.svg" />Watchlist
              </button>
            </div>

            <p class="movie-synopsis">
              ${movieData.Plot}</p>
          </div>
        </div>
        `
    if (watchlistArray.includes(movieData.imdbID)) {
      document.getElementById(`toggle-watchlist-button-${movieData.imdbID}`).innerHTML = `<img class="toggle-icon" src="assets/remove.svg" />Remove`
    }
}

// ADD TO WATCHLIST FUNCTIONALITY
moviesWrapper.addEventListener("click", handleButtonClick)

function handleButtonClick(e) {
  if (e.target.dataset.watchlist) {
    if (!watchlistArray.includes(e.target.dataset.watchlist)) {
      watchlistArray.push(e.target.dataset.watchlist)
      localStorage.setItem('watchlistIds', JSON.stringify(watchlistArray))

      document.getElementById(e.target.id).innerHTML = `<img class="toggle-icon" src="assets/remove.svg" />Remove`
      console.log(watchlistArray)
    } 
    
    else if (watchlistArray.includes(e.target.dataset.watchlist)) {
      const index = watchlistArray.indexOf(e.target.dataset.watchlist)
      if (index > -1) { // only splice array when item is found
        watchlistArray.splice(index, 1); // 2nd parameter means remove one item only
      }
      localStorage.setItem('watchlistIds', JSON.stringify(watchlistArray))

      document.getElementById(e.target.id).innerHTML = `<img class="toggle-icon" src="assets/add.svg" />Watchlist`
      console.log(watchlistArray)
    }
    
  }
}