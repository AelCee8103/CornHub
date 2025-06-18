const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

const xhr = new XMLHttpRequest();
xhr.open("GET", "retrieveMyListMovies.php");
xhr.send();
xhr.onload = function() {
    if (xhr.status === 200) {
        try {
            const responseData = xhr.responseText;
            console.log("Response from backend:", responseData);
            const movieIds = JSON.parse(responseData);
            console.log("Movie IDs:", movieIds);
            if (movieIds && movieIds.length > 0) {
                movieIds.forEach(id => {
                    let link = `/movie/${id}?language=en-US&`;
                    let url = BASEURL + link + APIKEY;
                    apiCall(url, id);
                });
            } else {
                console.error("No movie IDs found");
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.error("Response received:", xhr.responseText);
        }
    } else {
        console.error("Failed to retrieve favorite movies");
    }
};

// Calling function to request API
function apiCall(url, id) {
    const x = new XMLHttpRequest();
    x.open('get', url);
    x.send();
    x.onload = function() {
        try {
            var resp = x.response;
            var jsonRes = JSON.parse(resp);
            favMovieData(jsonRes, id);
        } catch (e) {
            console.error("Error parsing JSON from API:", e);
            console.error("Response received:", x.responseText);
        }
    }
}

// Displaying the movies here
function favMovieData(jsonResp, id) {
    console.log("favMovieData function called");
    var eachListItem = document.createElement('div');
    eachListItem.classList.add('list-item');
    eachListItem.innerHTML = `
        <div class="movie-details">
            <div class="thumbnail">
                <a href="moviePage.php?id=${id}">
                    <img id="movieimg" src=${IMAGEURL+jsonResp.poster_path} alt="Thumbnail">
                </a>
            </div>
            <div id="details">
                <div class="title">
                    <a href="moviePage.html?id=${id}">${jsonResp.title}</a> 
                </div>
                <div class="remove-movie" id='${id}' onclick="deleteMovie(${id})">
                    <i id="removeicon" class="far fa-trash-alt"></i>
                </div>
            </div>
        </div>`;
    document.getElementById('list-container').appendChild(eachListItem);
}

// Removing all the movies from the list
document.getElementById('clear-whole-list').addEventListener('click', function() {
    // Check if the watchlist is empty
    if (!document.querySelector('.list-item')) {
        alert("Watchlist is already empty.");
        return;
    }

    if (window.confirm("Clear all favorite movies?")) {
        // Send AJAX request to clear all movies from the database
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "clearMyListMovies.php");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Reload the page after successful deletion
                window.location.reload();
            }
        };
        xhr.send();
    }
});

// Deleting single movie from  list
async function deleteMovie(id) {
    // Check if the watchlist is empty
    if (!document.querySelector('.list-item')) {
        alert("Watchlist is already empty.");
        return;
    }

    if (window.confirm('Delete this movie from favorite list?')) {
        // Send AJAX request to delete the movie from the database
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "deleteMyListMovie.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Reload the page after successful deletion
                window.location.reload();
            }
        };
        xhr.send("movieId=" + id);
    }
}
