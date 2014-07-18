/*

  Known bugs:
    1. ...
    2. ...


  To-do:
    1. ...
    2. ...


  Functions with placeholders:
    1. getWebsiteCategory(websiteID)
    2. ...

*/


// ---------------------> for developing <---------------------
localStorage.clear();




/***********************************************************
  **
  **    GLOBAL VARIABLES
  **
  **********************************************************/

// website that's currently being tracked
var currentSite = null;
// time when started tracking the current website
var startTime = null;
// ID of the tab that's currently being tracked
var currentlyTrackingTabID = null;
// true if extension currently tracks somtething, false otherwise
var currentlyTracking = false;

// id of a currently opened tab
var currentTabID = -1;


// some shit
var tabUrl = null;


/***********************************************************
  **
  **    TRACKING FUNCTIONS
  **    
  **    startTrackTime() - starts tracking current tab
  **    stopTrackTime() - stops tracking the last website
  **    restartTracking() - stops old tracking and starts
  **                         another for a new website
  **
  **********************************************************/



function startTrackTime() {
  // Not implemented yet:
  // 1. archive data if is next day (don't remember why need this)
  // 2. url should be cleaned before saving it to currentSite variable

  // Sacing tracking start time
  startTime = (new Date()).getTime();

  // Getting url of website to track
  // NOTE: function is asynchronous, so everything should be in a callback
  chrome.tabs.query({'currentWindow': true, 'active': true}, function (tabs) {
    tabUrl = tabs[0].url;

    currentSite = tabUrl;

    currentlyTracking = true;
    currentlyTrackingTabID = currentTabID;

    // ---------------------> for developing <---------------------
    console.log('Started tracking ' + currentSite);

  });
}


function stopTrackTime() {

  // ---------------------> for developing <---------------------
  console.log('Stopping tracking ' + currentSite + " ...");
  console.log('Time: ' + ((new Date()).getTime() - startTime))

  // Not implemented yet:
  // 1. check if category time limit has been reached
  //    if yes, redirect, else allow to continue

  // getting category of the website that's being tracked
  var websiteCategory = getWebsiteCategory(currentSite);


  currentlyTracking = false;
  currentlyTrackingTabID = null;

  // ---------------------> for developing <---------------------
  console.log('Stopped tracking');
}


function restartTracking() {
  if (currentlyTracking) {
    stopTrackTime();
  }
  startTrackTime();
}



/***********************************************************
  **
  **    LISTENERS
  **
  **    chrome.windows.onFocusChanged - user switches Chrome windows
  **                                    or leaves Chrome
  **    chrome.tabs.onUpdated - changing webpage in a tab
  **    chrome.tabs.onSelectionChanged - user selected another tab
  **    chrome.tabs.onCreated - user created a new tab
  **
  **********************************************************/


chrome.windows.onFocusChanged.addListener(function trackWindow(windowID) {

  if (windowID == "-1") {
    // Chrome became inactive -> stop tracking
    console.log('Chrome window became inactive, stopping tracking...');

    stopTrackTime();
  
  } else {
    // Chrome became active after being inactive
    // or user switched to another Chrome window
    
    if (currentlyTracking) {
      // user switched to another Chrome window
      console.log('User switched to another Chrome window, restarting tracking...');
      
      restartTracking();
    }
    else {
      // Chrome window became active 
      console.log('Chrome window became active, restarting tracking...');

      restartTracking();
    }

  }
});


chrome.tabs.onUpdated.addListener(function(tabId, props) {
  // checks if the update was made on a current and if it
  // was finished
  if (props.status == "complete" && tabId == currentTabID) {
    // Tab updates -> restart tracking
    console.log('Tab was updated, restarting tracking...');

    restartTracking();
  }
});


chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
  // User switched between tabs -> restart tracking
  console.log('Selection changed, restarting tracking...');
  currentTabID = tabId;

  restartTracking(); 
});


chrome.tabs.onCreated.addListener(function(tabId, props) {
  // user opened a new tab -> restart tracking
  console.log('New tab opened, restarting tracking...');

  currentTabID = tabId;
  restartTracking();
});




/***********************************************************
  **
  **    HELPER FUNCTIONS
  **
  **    getWebsiteCategory(id) - returns category of a website
  **                             with a given ID
  **
  **********************************************************/


function getWebsiteCategory(websiteID) {
  // WARNING: returns random category for now!

  // array with available categories
  var categories = ['social', 'professional', 'work', 'news'];
  // random number in range [0, categories.length - 1]
  var rand = Math.floor((Math.random() * 100) % (categories.length));

  // returns random category from an array
  return categories[rand];
}


/***********************************************************
  **
  **    FROM THE PREVIOUS VERSION
  **
  **    idFromUrl(url) - returns id for a given url
  **
  **********************************************************/


function idFromUrl (currentUrl) {
  currentUrl = currentUrl.substring(currentUrl.indexOf("//") + 2);
  currentUrl = currentUrl.substring(0, currentUrl.indexOf("/"));
  
  // deletes www. from the code
  if (currentUrl.indexOf("www.") !== -1) {
    currentUrl = currentUrl.substring(currentUrl.indexOf("www.") + 4);
  }
  
  // deletes TLD
  // currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('.'));

  return currentUrl;
}