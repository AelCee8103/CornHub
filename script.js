// this is the api key
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
// this is the home url 
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
// this is the image url 
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// fetching elements from indexedDB.html 
var container = document.getElementById('movie-container');
var search = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.search-conten');
var resultsDiv = document.querySelector('.results');


// this is the previous button
var pBtn = document.getElementById('prev-page');
// this is the next button
var nBtn = document.getElementById('next-page');
// count of pages 

let pageNumber = 1;
let movie = 0


// calling function to request api 
apiCall(HOMEURL);
// this is the function to get api data 
function apiCall(url){
    const x = new XMLHttpRequest();
    x.open('get',url);
    x.send();
    x.onload = function(){
        container.innerHTML="";
        var res = x.response;
        // resp to JSON data 
        var conJson = JSON.parse(res);
        // array of movies 
        var moviesArray = conJson.results;
        // create the movie cards here 
        moviesArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}
// create the home page elements 
function moviesElement(movie){
    

    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.php?id=${movie.id}"><img src= ${IMAGEURL+movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
            <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="checkSession(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement);
}


// array to store  movies 
var favMovies=[];
var oldMovies=[];

// function to add movie to a list 
function addMovie(btnId){

    console.log('addMovie function called');

    console.log(btnId);
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';
    // to avoid duplicate movies 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "addMovie.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert(xhr.responseText);
        console.log(xhr.responseText);
      }
    };
    var email = sessionStorage.getItem('email'); 
    var params = "email=" + email + "&movieId=" + btnId;
    xhr.send(params);
}

 
search.addEventListener('keyup', function(){
    var input = search.value;
    // getting all the movies related to the input in the search option 
    var inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`;
    if(input.length !=0){
        apiCall(inputUrl);
    }else{
        window.location.reload();
    }
})
//check if log in or not
function checkSession(movkey) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var isEmailSet = (response.trim() === "true");
            if(isEmailSet) {
                showModal(movkey)
                console.log("yeah");
            } else {
                alert("You must log in first");
            }
        }
    };
    xhttp.open("GET", "check_session.php", true);
    xhttp.send();
}
function isLogin() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var isEmailSet = (response.trim() === "true");
            if(isEmailSet) {
                
                console.log("yeah");
            } else {
                alert("You must log in first");
                location.reload(true);
            }
        }
    };
    xhttp.open("GET", "check_session.php", true);
    xhttp.send();
}

// disable the prev btn when the page is 1
pBtn.disabled = true;
function disablePBtn(){
    if(pageNumber ==1)pBtn.disabled=true;
    else pBtn.disabled=false;
}

// got to next page 
nBtn.addEventListener('click',()=>{
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// gor to prev page 
pBtn.addEventListener('click',()=>{
    if(pageNumber==1)return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})
var btnIdValue;
let  isLog=false;
// Function to set the value of btnId
function setBtnId(value) {
    btnIdValue = value;
}

function showOpenListModal(){
   
    
    const mylistmodal = document.getElementById('myListModal');
    mylistmodal.style.display = 'block';

    populateMyListModal();
    const closeButton = mylistmodal.querySelector('.openlistclose');
    closeButton.onclick = function() {
        mylistmodal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == mylistmodal) {
            mylistmodal.style.display = 'none';
        }
    }
   
    
}
function showModal(btnId) {
    setBtnId(btnId);
    movie = btnId
    const modal = document.getElementById('myModal');
   
   
    const watchbtn = modal.querySelector('.watchlist');
    const clistbtn = modal.querySelector('.createdlist');
    
    modal.style.display = 'block';
    populateModal()

    const closeButton = modal.querySelector('.close');
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    watchbtn.onclick = function() {
        addMovie(btnId);
       
    }
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

   

  
}
function addMovieToCreatedList(btnId, listName) {
    console.log('addMovieToCreatedList function called');
    console.log(btnId);

    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "addMovieToCreatedList.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
            console.log(xhr.responseText);
        }
    };
    var email = sessionStorage.getItem('email');
    var params = "email=" + email + "&movieId=" + btnId + "&listName=" + listName;
    xhr.send(params);
}

function openCListPage(listName) {
    window.location.href = `myList.php?listName=${listName}`;
}




function deleteItem(listName) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "deleteList.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Delete item: " + listName);
            console.log("Response from server: " + xhr.responseText);
            
            // Remove the deleted item from the modal's UI
            populateMyListModal();
           
        } else {
            console.error("Failed to delete item. Status: " + xhr.status);
        }
    };

    // Define what happens in case of error
    xhr.onerror = function() {
        console.error("Request failed.");
    };

    // Set up the request
    xhr.send("listName=" + encodeURIComponent(listName));
}



function showCreateListModal() {
    const modal = document.getElementById('createListModal');
    modal.style.display = 'block';

    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    return false;
}

function createList() {
    const listName = document.getElementById('listNameInput').value;
    
    console.log('List name:', listName);

    const modal = document.getElementById('createListModal');
    modal.style.display = 'none';
}

document.getElementById('createListForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = new FormData(this);
 
    fetch('save_list.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message); 
            document.getElementById('listNameInput').value = ''; 
            const modal = document.getElementById('createListModal');
            const listNameInput = document.getElementById('listNameInput');
    if (listNameInput) {
        listNameInput.value = ''; 
    } else {
        console.error('Element with id "listNameInput" not found');
    }
          
            
        } else {
            alert(data.message); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the list.');
    });
});

function showEditListModal(){
   
    
    const mylistmodal = document.getElementById('editListModal');
    mylistmodal.style.display = 'block';


    const closeButton = mylistmodal.querySelector('.editlistclose');
    closeButton.onclick = function() {
        mylistmodal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == mylistmodal) {
            mylistmodal.style.display = 'none';
        }
    }
    populateEditListModal();
   
}


function populateEditListModal() {
    fetch('fetch_lists.php')
        .then(response => response.json())
        .then(data => {
            if (data.htmlContent) {
                document.querySelector('.editlistwatchlist-container').innerHTML = data.htmlContent;
                addEditButtonFunctionality(); 
            } else {
                document.querySelector('.editlistwatchlist-container').innerHTML = 'Error fetching content';
            }
        })
        .catch(error => {
            console.error('Error fetching the lists:', error);
            document.querySelector('.editlistwatchlist-container').innerHTML = 'Error fetching content';
        });
}

function addEditButtonFunctionality() {
    document.querySelectorAll('.editlistdelete-icon').forEach(deleteIcon => {
        deleteIcon.addEventListener('click', () => {
            const span = deleteIcon.parentElement.querySelector('.editlistcreatedlist');
            const previousListName = span.dataset.previous; 
            toggleEditable(span, previousListName);
        });
    });
}

function toggleEditable(span) {
    if (span.contentEditable === 'true') {
        if (span.textContent.trim() !== '') { 
            const newListName = span.textContent.trim();
            const previousListName = span.getAttribute('value').trim(); 
            if (newListName !== previousListName) { // Check if the new list name is different from the previous one
                // Check if the new list name already exists in the database
                checkListNameExists(newListName)
                    .then(listExists => {
                        if (!listExists) { // Proceed with updating the list name if it doesn't exist
                            span.contentEditable = 'false';
                            span.classList.remove('editable'); 
                            span.classList.remove('editable-text'); 
                            
                            saveListName(newListName, previousListName);
                        } else {
                            alert('List name already exists');
                            console.log('List name already exists');
                        }
                    })
                    .catch(error => {
                        alert('Error checking list name:', error);
                        console.error('Error checking list name:', error);
                    });
            } else {
                span.contentEditable = 'false'; 
                span.classList.remove('editable'); 
                span.classList.remove('editable-text'); 
                console.log('Text unchanged, toggling to non-editable mode');
            }
        } else {
            alert('You must not leave it blank.');
            console.log('Cannot toggle to non-editable when the span is empty');
        }
    } else {
        span.contentEditable = 'true';
        span.classList.add('editable'); 
        span.classList.add('editable-text'); 
        span.focus();
    }
}


function checkListNameExists(listName) {
    return new Promise((resolve, reject) => {
        fetch('check_list_name.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'listName=' + encodeURIComponent(listName),
        })
        .then(response => response.json())
        .then(data => {
            resolve(data.exists);
        })
        .catch(error => {
            reject(error);
        });
    });
}


function saveListName(newListName, previousListName) {
    fetch('update_list_name.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'newListName=' + encodeURIComponent(newListName) + '&previousListName=' + encodeURIComponent(previousListName),
    })
    .then(response => response.text())
    .then(data => {
       
        console.log(data); 
    })
    .catch(error => {
        alert('Error updating list name:', error);
        console.error('Error updating list name:', error);
    });
}




function populateMyListModal() {
    fetch('fetch_my_lists.php')
        .then(response => response.json())
        .then(data => {
            if (data.htmlContent) {
                document.querySelector('.openlistwatchlist-container').innerHTML = data.htmlContent;
                console.log("content populated.");
                addDeleteButtonFunctionality()
            } else {
                document.querySelector('.openlistwatchlist-container').innerHTML = 'Error fetching content';
            }
        })
        .catch(error => {
            console.error('Error fetching the lists:', error);
            document.querySelector('.openlistwatchlist-container').innerHTML = 'Error fetching content';
        });
}


function addDeleteButtonFunctionality() {
    document.querySelectorAll('.mydelete-icon').forEach(deleteIcon => {
        deleteIcon.addEventListener('click', () => {
            const button = deleteIcon.parentElement.querySelector('.openlistcreatedlist');
            const listName = button.value;
            deleteItem(listName);
        });
    });
}

function populateModal() {
    var modalContent = document.querySelector('.watchlist-container');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'populate_lists.php', true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            modalContent.innerHTML = '';

            var data = JSON.parse(xhr.responseText);

            if (data && data.message) {
                modalContent.textContent = data.message;
            } else if (data && data.lists) {
                // Loop through the lists and create buttons
                data.lists.forEach(function(listName) {
                    var button = document.createElement('button');
                    button.textContent = listName;
                    button.classList.add('createdlist');
                    button.onclick = function() {
                        addMovieToCreatedList(btnIdValue, listName);
                    };
                    modalContent.appendChild(button);
                });
            } else {
                console.error('Unexpected response format:', data);
            }
        } else {
            console.error('Failed to fetch data:', xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('Failed to fetch data.');
    };
    xhr.send();
}


document.addEventListener("DOMContentLoaded", function() {
    const h2 = document.querySelector("#right-section h2");
    const textLength = h2.textContent.length;

    if (textLength < 10) {
        h2.style.fontSize = "2.5rem";
    } else if (textLength >= 10 && textLength <= 20) {
        h2.style.fontSize = "2rem";
    } else if (textLength > 20 && textLength <= 30) {
        h2.style.fontSize = "1.5rem";
    } else {
        h2.style.fontSize = "1rem";
    }
});

