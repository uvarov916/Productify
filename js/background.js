// for developing purposes
localStorage.clear();

var currentSite = null;
var startTime = null;

// social category
localStorage["facebook_cat"] = "social";
localStorage["twitter_cat"] = "social";
localStorage["plus.google_cat"] = "social";
localStorage["instagram_cat"] = "social";
localStorage["linkedin_cat"] = "social";
localStorage["pinterest_cat"] = "social";
localStorage["vk_cat"] = "social";

// work category
localStorage["google_cat"] = "work";
localStorage["yahoo_cat"] = "work";
localStorage["bing_cat"] = "work";


function resetInformation() {

	// social networks
	localStorage["facebook"] = 0;
	localStorage["twitter"] = 0;
	localStorage["instagram"] = 0;
	localStorage["linkedin"] = 0;
	localStorage["pinterest"] = 0;
	localStorage["vk"] = 0;

	localStorage["facebook_vis"] = 0;
	localStorage["twitter_vis"] = 0;
	localStorage["instagram_vis"] = 0;
	localStorage["linkedin_vis"] = 0;
	localStorage["pinterest_vis"] = 0;
	localStorage["vk_vis"] = 0;


	localStorage["totalTime"] = 60000;

	localStorage["work_time"] = 0;
	localStorage["learning_time"] = 0;
	localStorage["shopping_time"] = 0;
	localStorage["entertainment_time"] = 0;
	localStorage["email_time"] = 0;
	localStorage["reference_time"] = 0;
	localStorage["social_time"] = 0;
	localStorage["other_time"] = 60000;

	localStorage["dayChecker"] = (new Date()).getDate();

	currentSite = null;
	startTime = null;

	for (var i = 0; i < localStorage[length]; i++) {
		if (Object.keys(localStorage)[i].indexOf('_time') !== -1) {
			localStorage[Object.keys(localStorage)[i]] = 0;
		}
	}
}

function checkGoals() {
	var key = localStorage[currentSite + "_cat"] + "_goal";
	if (localStorage[localStorage[currentSite + "_cat"] + "_time"] >= localStorage[key]) {
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.update(tab.id, {url: "../notimeleft.html"});
		});
	}
}

localStorage["allCategories"] = "work,learning,shopping,entertainment,email,reference,social,other";

var cat = parseCategories(localStorage["allCategories"]);
for (var i = 0; i < cat.length; i++) {
	name = cat + "_time";
	localStorage[name] = 0;
}



function addTimeToCategory(website, time) {
	var catKey = website + "_cat";
	var category = localStorage[catKey];

	var name = category + "_time";
	if (localStorage[name] === undefined) {
		localStorage[name] = time;
	}
	else {
		localStorage[name] = parseInt(localStorage[name]) + time;
	}
}

function timeToString(time) {
	time = Math.floor(time / 1000);
	var hours = Math.floor(time / 3600);
	time = time - hours * 3600;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	if (hours > 0) {
		return hours + "h " + minutes + "m"
	}
	else {
		return minutes + "m " + seconds +"s"
	}
}

// takes full website's url and returns its name
function cleanUrl (currentUrl) {
	currentUrl = currentUrl.substring(currentUrl.indexOf("//") + 2);
	currentUrl = currentUrl.substring(0, currentUrl.indexOf("/"));
	
	// deletes www. from the code
	if (currentUrl.indexOf("www.") !== -1) {
		currentUrl = currentUrl.substring(currentUrl.indexOf("www.") + 4);
	}
	
	// deletes TLD
	currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('.'));

	return currentUrl;
}

function parseCategories() {
	return localStorage["allCategories"].split(",");
}

function assignCategory() {
	var name = currentSite + "_cat";
	if (localStorage[name] === undefined) {
		//gets category from prompt
		var category = prompt("Please enter the category of this website:\n1. Work\n2. Learning\n3. Shopping\n4. Entertainment\n5. Email\n6. Social\n7. Reference\n8. Other", "Other");
		
		if (category === null) {
			localStorage[name] = "other";
		}
		else {
			localStorage[name] = category.toLowerCase();
		}

	}

	console.log(currentSite + ", category: " + localStorage[name]);

}


function updateCounter() {

	//n is the day of the month, we use this to reset the data daily
	var todayDate = (new Date()).getDate();
	if (todayDate === parseInt(localStorage["dayChecker"])) {
		console.log("Same day");
	}
	else {
		resetInformation();
		console.log("Date changed, information reseted");
	}


	chrome.tabs.query({'active': true}, function (tabs) {
		var cleanedUrl = cleanUrl(tabs[0].url);
		
		// console.log("You're now on '" + cleanedUrl + "'!");
		// console.log("The 'currentSite' = '" + currentSite + "'");

		if (currentSite === null) {

			// console.log("first condition");

			currentSite = cleanedUrl;
			startTime = (new Date).getTime();
			assignCategory();
		}
		// if user opened a new website
		else if (currentSite !== cleanedUrl) {

			// console.log("second condition");
			
			var timeSpent = (new Date).getTime() - startTime;

			var totalTime;

			// if website wasn't previously stored, adds new field to storage
			if (localStorage[currentSite] === undefined) {
				totalTime = timeSpent;
			}
			// if website wasn previously stored, updates total time
			else {
				totalTime = timeSpent + parseInt(localStorage[currentSite]);
			}

			localStorage[currentSite] = totalTime;
			addTimeToCategory(currentSite, timeSpent);
			localStorage["totalTime"] = parseInt(localStorage["totalTime"]) + timeSpent;

			currentSite = cleanedUrl;
			if (localStorage[currentSite + "_vis"] === undefined) {
				localStorage[currentSite + "_vis"] = 1;
			}
			else {
				localStorage[currentSite + "_vis"] = parseInt(localStorage[currentSite + "_vis"]) + 1;
			}


			checkGoals(currentSite);

			startTime = (new Date).getTime();
			assignCategory();
		}
	});


	console.log(localStorage);
}


var updateCounterInterval = 1000 * 2; // 2 seconds

resetInformation();

function initialize () {
	window.setInterval(updateCounter, updateCounterInterval);
}

initialize();



















