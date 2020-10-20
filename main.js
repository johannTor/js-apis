// History part
// window.history
// window.location
// API: interface to interact with software

// can stick in username:password@domainname
// http:// site-example.com :80 /path/filename.html ?query=string&num=1

// #hashValue - comes after the querystring

// Location object:
// location.username and location.password
// location.protocol / .port / .pathname / .search (querystring) / .reload (reload page) / .replace() (takes us to another page)

// History object:
// history.go() move forwards or backwards in history / .back() / .forward() / .state (properties that we pass along) / .pushState() (add things into history array) / history.replaceState() (replace current entry in history array)
// Examples:
// history.pushState(historyStateObject, "title", url); // Add to the history array
// history.replaceState(historyStateObject, "title", url); // Replace current entry
// history.pushState(null, "Title", "pretend.html"); // Push state data can be null, url can be a made up html file


// Add event listeners to all elements with the .gamePortrait class
function addEventListeners() {
    document.querySelectorAll(".gamePortrait").forEach(item => {
        item.addEventListener('click', handleGameClick);
    });
}

// Add all the event listeners once the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    //document.getElementById("link").addEventListener('click', c);
    // Set a click listener for every gameportrait item in the grid
    addEventListeners();
    window.addEventListener("hashchange", hashChange); // hashchange fires when the hash value changes in the url
    window.addEventListener("popstate", popState); // popstate fires when a link is clicked
    document.getElementById('filter-none').addEventListener('click', changeFilter);
    document.getElementById('filter-sp').addEventListener('click', changeFilter);
    document.getElementById('filter-mp').addEventListener('click', changeFilter);
});

// Function to catch the hash change event, currently not using it.
function hashChange(ev) {
    // We can grab the hash value here to see what has happened location.hash location.search OR (see the c function)
    console.log("Hash change: " + location.hash);
}

// Function to catch the popstate event
function popState(ev) {
    // console.log("Popstate fired with path: " + location.pathname);
    // Handle back clicks
    if(location.pathname != '/') {
        // Loadgame with current site info
        loadGame();
    } else {
        clearGivenDiv(infoDiv);
        toggleGridSize('normal');
    }
}

// Handle when the user clicks a game
function handleGameClick(ev) {
    ev.preventDefault(); // Can prevent forms from submitting or anchors for navigating to sites...
    let targetUrl = ev.currentTarget.href; // In this case game name
    targetArr = targetUrl.split('/'); // Split the url at '/'
    let nextTarget = targetArr.pop(); // Get the last part of the url (the game name)
    let currentPath = location.pathname.substring(1); // Get the pathname without the /
    // Check if the same game is being clicked multiple times, if that's not the case then use pushState to change the displayed game
    if(nextTarget != currentPath) {
        //console.log('This hash is: ' + location.hash);
        //targetUrl += location.hash; // add the hash value to the url
        let gameId = ev.currentTarget.getAttribute("data-game"); // Should hold the name of the game
        
        // Push state takes in ([data], [title], [url]);
        history.pushState({"gameId": gameId}, "title", targetUrl); // Add to the array
        loadGame();
    }
}

// Sends the current history.state data to be displayed in the info section
function loadGame() {
    let data = history.state;
    displayGameInfo(data.gameId);
}


// Takes in a list of games and displays it in the provided wrapper
function displayListInHtml(someList, wrapper) {
    clearGivenDiv(dropdownMenuDiv);
    clearGivenDiv(wrapper);
    // Filling genre menu with the given game list (can be a filtered list)
    fillGenreMenu(someList);
    // Go through the game list and display it in the grid
    for(let i = 0; i < someList.length; i++) {
        let div = document.createElement('div');
        let a = document.createElement('a');
        let img = document.createElement('img');

        div.classList.add('page');
        a.classList.add('gamePortrait');
        // Setting the href as each of the games names
        a.href = someList[i].name;
        // Set a data-game attribute that we can use as a game id when it's clicked
        a.setAttribute('data-game', someList[i].name);
        img.src = someList[i].img;

        a.appendChild(img);
        div.appendChild(a);
        wrapper.appendChild(div);
    }
    addEventListeners();
}

// Removes all child elements in the given element
function clearGivenDiv(givenDiv) {
    if(givenDiv != null) {
        while(givenDiv.hasChildNodes()) {
            givenDiv.removeChild(givenDiv.firstChild);
        }
    }
}

// Returns a game based on the name passed in
function getGame(gameName) {
    // Returns undefined if game is not found
    return gameList.find(game => game.name === gameName);
}

// Used to change between small and normal grid
function toggleGridSize(size) {
    switch(size) {
        case 'normal':
            wrapper.classList.remove('game-wrapper-small');
            wrapper.classList.add('game-wrapper');
            document.getElementById('page-header').innerHTML = 'Game library';
            document.body.insertBefore(wrapper, gameMenu);
            document.body.style.backgroundColor = '#2f4f4f';
            break;
        case 'small':
            wrapper.classList.remove('game-wrapper');
            wrapper.classList.add('game-wrapper-small');
            document.body.style.backgroundColor = '#4d4583';
            document.getElementById('page-header').innerHTML = 'Game Details';
            document.body.insertBefore(wrapper, gameMenu.nextSibling);
            break;
    }
}

// Create the game info section
function displayGameInfo(gameName) {
    clearGivenDiv(infoDiv);
    // Change the styling of the game wrapper div to show smaller icons
    toggleGridSize('small');

    const gameObj = getGame(gameName);
    if(gameObj != undefined) {
        let gameImg = document.createElement('img');
        let gameText = document.createElement('div');
        let infoList = document.createElement('ul');
        let gameHeader = document.createElement('h2');
        let listGenre = document.createElement('li');
        let listDeveloper = document.createElement('li');
        let listYear = document.createElement('li');
        let backLink = document.createElement('a');

        gameImg.classList.add('game-info-img');
        gameImg.src = gameObj.img;
        gameText.classList.add('game-info-content');
        gameHeader.innerHTML = `${gameObj.name}`;
        listGenre.innerHTML = `Genre: ${gameObj.genre}`;
        listDeveloper.innerHTML = `Developer: ${gameObj.developer}`;
        listYear.innerHTML = `Released: ${gameObj.year}`;
        backLink.innerHTML = 'Back to menu';
        backLink.href = '/';

        // Event listener for back link, want to go back to menu
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            history.pushState(null, "frontpage", e.currentTarget.href); // Add to the array
            toggleGridSize('normal');
            clearGivenDiv(infoDiv);
        });

        infoList.appendChild(listGenre);
        infoList.appendChild(listDeveloper);
        infoList.appendChild(listYear);
        
        gameText.appendChild(gameHeader);
        gameText.appendChild(infoList);
        gameText.appendChild(backLink);
        infoDiv.appendChild(gameImg);
        infoDiv.appendChild(gameText);
        gameMenu.appendChild(infoDiv);        
    } else {
        console.log("Gameobject not found");
    }
}

// Return an array of games based on the filter type
function getFilteredList(option) {
    let tmpList = [];
    // First deal with single and multiplayer filter
    if(option === 'sp') {
        for(let i = 0; i < gameList.length; i++) {
            if(gameList[i].singlePlayer) {
                tmpList.push(gameList[i]);
            }
        }
        return tmpList;
    }
    if(option === 'mp') {
        for(let i = 0; i < gameList.length; i++) {
            if(gameList[i].multiPlayer) {
                tmpList.push(gameList[i]);
            }
        }
        return tmpList;
    }
    // If the function reaches this point, we can assume the filter type is a genre
    for(let i = 0; i < gameList.length; i++) {
        if(gameList[i].genre === option) {
            tmpList.push(gameList[i]);
        }
    }
    return tmpList;
}

// Gets called when a filter is chosen from the option bar
function changeFilter(ev) {
    // What To Do in here: 
    // Refresh wrapper with a new gameList that is filtered according to data-filter
    ev.preventDefault();
    let filteredGames = [];
    const filterType = ev.currentTarget.getAttribute('data-filter');
    if(filterType != 'none') {
        filteredGames = getFilteredList(filterType);
    } else {
        filteredGames = gameList;
    }
    // Storing last used list in local storage
    localStorage.setItem('lastList', JSON.stringify(filteredGames));
    displayListInHtml(filteredGames, wrapper);
}

// Returns an array of unique genres of a provided game list
function getAllGenres(gameList) {
    let tmpArr = [];
    for(let i = 0; i < gameList.length; i++) {
        // Using find to search for duplicates in the genre array and add them if none are found
        if(tmpArr.find(item => item === gameList[i].genre) === undefined) {
            tmpArr.push(gameList[i].genre);
        }
    };
    return tmpArr;
}

// Fills in the genre dropdown menu with each genre that's present in the gamelist
function fillGenreMenu(gameListBeingDisplayed) {
    const dropdownMenu = document.querySelector('.dropdown-content');
    let genreArray = getAllGenres(gameListBeingDisplayed);
    for(let i = 0; i < genreArray.length; i++) {
        let genreLink = document.createElement('a');
        // Set each dropdown menu link href to the value of the genre
        genreLink.href = '';
        genreLink.innerHTML = genreArray[i];
        genreLink.setAttribute('data-filter', genreArray[i]);
        genreLink.addEventListener('click', changeFilter);
        dropdownMenu.appendChild(genreLink);
    }
}

// Data to display on the site
const hades = new Game('Hades', 'Roguelike', 'Supergiant Games', '2020', true, false, false, 'images/HadesCover.jpg');
const darkSouls3 = new Game('Dark Souls 3', 'RPG', 'FromSoftware', '2016', true, true, false, 'images/DarkSouls3Cover.jpg');
const modernWarfare = new Game('Modern Warfare', 'FPS', 'Infinity Ward', '2019', true, true, false, 'images/ModernWarfareCover.jpg');
const pubg = new Game('PUBG', 'FPS', 'PUBG Corporation', '2017', false, true, false, 'images/PUBGCover.jpg');
const gtav = new Game('GTA V', 'Action', 'Rockstar Studios', '2013', true, true, false, 'images/GTAVCover.jpg');
const ck3 = new Game('Crusader Kings 3', 'Strategy', 'Paradox Development Studio', '2020', true, true, false, 'images/CK3Cover.jpg');
const doom4 = new Game('Doom Eternal', 'FPS', 'id software', '2020', true, true, false, 'images/doomEternal.png');

let dropdownMenuDiv = document.querySelector('.dropdown-content');

const gameList = [];
gameList.push(hades);
gameList.push(darkSouls3);
gameList.push(modernWarfare);
gameList.push(pubg);
gameList.push(gtav);
gameList.push(ck3);
gameList.push(doom4);

const wrapper = document.getElementById('game-wrapper');
const gameMenu = document.getElementById('game-menu-info');
const infoDiv = document.getElementById('game-info');

//let gameMenuDiv = undefined;

// Display the original game list if local storage is empty
if(localStorage.getItem('lastList') === null) {
    displayListInHtml(gameList, wrapper);
} else {
    let storageString = localStorage.getItem('lastList');
    let lastListObject = JSON.parse(storageString);
    displayListInHtml(lastListObject, wrapper);
}