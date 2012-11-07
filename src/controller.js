goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.math');
goog.require('goog.string');
goog.require('goog.net.Cookies');

// users = 
users = {"Minh Luong" : ["male", ]}

// posts = { postId: [user_name, sport, start_time, end_time, location, posted_time, like_number, comment_number] }
posts = {
	1: ["Minh Luong", "basketball", new Date(2012,11,4,21,0,0,0), new Date(2012,11,4,22,0,0), "RSF", new Date(2012,11,4,12,0,0), 3, 12],
}

var hiddenGamePosts = [];
var filterTabs = [];
var activeFilters = [];
var favorites = [];
var db = window.openDatabase('mydb', '1.0', 'Test DB', 1024);
db.transaction(function (tx) {  
   tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
});

function onLoad() {
	if (document.getElementById('filterBar')) {
		document.getElementById('filterBar').style.display = "none";
	}
}

function createGamePost(parent, postId) {
	
}

function search() {
	var gameSearchBoxInput = document.getElementById('gameSearchBox').children[1].value;
	document.getElementById('gameSearchBox').children[1].value = "";
	var locationSearchBoxInput = document.getElementById('locationSearchBox').children[1].value;
	document.getElementById('locationSearchBox').children[1].value = "";
	var gamePosts = goog.dom.getElementsByClass('gamePost');
	var sportsChange = false;
	var locationChange = false;
	
	if (gameSearchBoxInput != "") {
		// Hide all the posts that are not the same sport as inputted.
		for (var i=0; i<gamePosts.length; i++) {
			// Hide the event post if the location doesn't match the search field.
			var gameText = gamePosts[i].children[1].children[1].children[0].textContent;
			if(goog.string.caseInsensitiveCompare(gameText, gameSearchBoxInput)) {
				gamePosts[i].style.display = "none";
				hiddenGamePosts.push(gamePosts[i]);
				if (!sportsChange) {
					sportsChange = true;
				}
			}
		}
		// Update the filter bar.
		if (sportsChange) {
			activeFilters.push(gameSearchBoxInput);
			createAndAppendFilterTab(gameSearchBoxInput);
			if (activeFilters.length > 0) {
				document.getElementById('filterBar').style.display = "block";
			}
		}
	}
	
	if (locationSearchBoxInput != "") {
		// Hide all the posts that are not in the same location as the location search box field.
		for (var i=0; i<gamePosts.length; i++) {
			// Hide the event post if the location doesn't match the search field.
			var locationText = gamePosts[i].children[1].children[1].children[1].textContent.substring(2);
			if (goog.string.caseInsensitiveCompare(locationText, locationSearchBoxInput)) {
				gamePosts[i].style.display = "none";
				hiddenGamePosts.push(gamePosts[i]);
				if (!locationChange) {
					locationChange = true;
				}
			}
		}
		// Update the filter bar.
		if (locationChange) {
			activeFilters.push(locationSearchBoxInput);
			createAndAppendFilterTab(locationSearchBoxInput);
			if (activeFilters.length > 0) {
				document.getElementById('filterBar').style.display = "block";
			}
		}
	}
}

function createAndAppendFilterTab(filterString) {
	for (var i=0; i<filterTabs.length; i++) {
		if (goog.array.contains(filterTabs[i].textContent, filterString)) {
			filterTabs[i].style.display = "inline-block";
			goog.events.listen(filterTabs[i], goog.events.EventType.CLICK, this.handleFilterTabClick, this);
			return;
		}
	}
	// Create a completely new filter tab since we know one doesn't already exist.
	var filterTab = document.createElement('div');
	filterTab.innerHTML = filterString;
	filterTab.setAttribute('class', 'filter');
	document.getElementById('filterBar').appendChild(filterTab);
	filterTabs.push(filterTab);
	goog.events.listen(filterTab, goog.events.EventType.CLICK, this.handleFilterTabClick, this);
}

function handleFilterTabClick(e) {
	var filterString = e.target.textContent;
	var tempArray = [];
	e.target.style.display = "none";
	goog.array.remove(activeFilters, filterString);
	// Unhide any relevant posts
	for (var i=0; i<hiddenGamePosts.length; i++){
		var postString = hiddenGamePosts[i].children[1].children[1].children[1].textContent.substring(2);
		// Unhide the event post if needed.
		if (goog.string.caseInsensitiveCompare(postString, filterString) &&
		    ((activeFilters.length == 0) || (goog.array.contains(activeFilters, postString)))) {
			hiddenGamePosts[i].style.display = "block";
			tempArray.push(hiddenGamePosts[i]);
		}
	}
	for (var i=0; i<tempArray.length; i++) {
		goog.array.remove(hiddenGamePosts, tempArray[i]);
	}
	goog.events.unlisten(e.target, goog.events.EventType.CLICK, this.handleFilterTabClick, this);
	if (activeFilters.length == 0) {
		document.getElementById('filterBar').style.display = "none";
	}
}

function walterProfileOnLoad() {
	var element = document.getElementById('addToFavorites');
	goog.events.listen(element, goog.events.EventType.CLICK, this.handleWalterAddToFavorites, this);
}

function handleWalterAddToFavorites(e) {
	favorites.push("Walter White");
}

function sumedhProfileOnLoad() {
	var element = document.getElementById('addToFavorites');
	goog.events.listen(element, goog.events.EventType.CLICK, this.handleSumedhAddToFavorites, this);
}

function handleSumedhAddToFavorites(e) {
	favorites.push("Sumedh Sawant");
}

function minhProfileOnLoad() {
	var element = document.getElementById('addToFavorites');
	goog.events.listen(element, goog.events.EventType.CLICK, this.handleMinhAddToFavorites, this);
}

function handleMinhAddToFavorites(e) {
	favorites.push("Minh Luong");
}

function handleAdvancedSearch() {
	document.getElementById('advancedSearchMaaan').style.display = 'none';
	var gameSearchBoxInput = document.getElementById('sport-name').value;
	var startTime = document.getElementById('start-time').value;
	var duration = document.getElementById('duration').value;
	var locationSearchBoxInput = document.getElementById('location').value;
	var gamePosts = goog.dom.getElementsByClass('gamePost');
	for (var i=0; i< gamePosts.length; i++) {
		hiddenGamePosts.push(gamePosts[i]);
	}
	
	var sportsChange = false;
	var locationChange = false;
	
	if (gameSearchBoxInput != "") {
		// Hide all the posts that are not the same sport as inputted.
		for (var i=0; i<gamePosts.length; i++) {
			// Hide the event post if the location doesn't match the search field.
			var gameText = gamePosts[i].children[1].children[1].children[0].textContent;
			if(!goog.string.caseInsensitiveCompare(gameText, gameSearchBoxInput)) {
				gamePosts[i].style.display = "block";
				goog.array.remove(hiddenGamePosts, gamePosts[i]);
				if (!sportsChange) {
					sportsChange = true;
				}
			}
		}
		// Update the filter bar.
		if (sportsChange) {
			activeFilters.push(gameSearchBoxInput);
			createAndAppendFilterTab(gameSearchBoxInput);
			if (activeFilters.length > 0) {
				document.getElementById('filterBar').style.display = "block";
			}
		}
	}
	
	if (locationSearchBoxInput != "") {
		// Hide all the posts that are not in the same location as the location search box field.
		for (var i=0; i<gamePosts.length; i++) {
			// Hide the event post if the location doesn't match the search field.
			var locationText = gamePosts[i].children[1].children[1].children[1].textContent.substring(2);
			if (!goog.string.caseInsensitiveCompare(locationText, locationSearchBoxInput)) {
				gamePosts[i].style.display = "block";
				goog.array.remove(hiddenGamePosts, gamePosts[i]);
				if (!locationChange) {
					locationChange = true;
				}
			}
		}
		// Update the filter bar.
		if (locationChange) {
			activeFilters.push(locationSearchBoxInput);
			createAndAppendFilterTab(locationSearchBoxInput);
			if (activeFilters.length > 0) {
				document.getElementById('filterBar').style.display = "block";
			}
		}
	}
}