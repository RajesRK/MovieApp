const apiKey = '938397df32ab30b968e4458ae98a9231'; // Replace with your TMDb API key
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const moviesContainer = document.getElementById('movies-container');
const favoritesButton = document.getElementById('favorites-button');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const overlay = document.querySelector('.overlay');
let favorites = [];

document.addEventListener('DOMContentLoaded', function () {
    fetchUpcomingMovies();
});

function fetchUpcomingMovies() {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error fetching upcoming movies:', error));
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        fetchMovies(query);
    }
});

favoritesButton.addEventListener('click', () => {
    favoritesSidebar.classList.toggle('visible');
    overlay.style.display = favoritesSidebar.classList.contains('visible') ? 'block' : 'none';
    updateFavoritesSidebar(); // Call to update favorites sidebar
});

overlay.addEventListener('click', () => {
    favoritesSidebar.classList.remove('visible');
    overlay.style.display = 'none';
});

function fetchMovies(query) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error fetching movies:', error));
}

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        const releaseDate = new Date(movie.release_date).toLocaleDateString();
        movieElement.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Release Date: ${releaseDate}</p>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p class="overview">${movie.overview}</p>
            <button class="favorite-button">Add to Favorites</button>
        `;
        movieElement.querySelector('.overview').style.display = 'none';
        movieElement.addEventListener('click', () => {
            const overview = movieElement.querySelector('.overview');
            overview.style.display = overview.style.display === 'none' ? 'block' : 'none';
        });
        const favoriteButton = movieElement.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!isFavorite(movie.id)) {
                addToFavorites(movie);
                favoriteButton.textContent = 'Remove from Favorites'; // Update button text
            } else {
                removeFromFavorites(movie.id);
                favoriteButton.textContent = 'Add to Favorites'; // Update button text
            }
        });
        moviesContainer.appendChild(movieElement);
    });
}

function isFavorite(movieId) {
    return favorites.some(fav => fav.id === movieId);
}

function addToFavorites(movie) {
    favorites.push(movie);
    updateFavorites();
}

function removeFromFavorites(movieId) {
    favorites = favorites.filter(movie => movie.id !== movieId);
    updateFavorites();
}

function updateFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(movie => {
        const li = document.createElement('li');
        li.classList.add('favorite-item');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
            <button class="remove-button">Remove</button>
        `;
        li.querySelector('.remove-button').addEventListener('click', () => {
            removeFromFavorites(movie.id);
        });
        favoritesList.appendChild(li);
    });
}
