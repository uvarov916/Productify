/*

  Known bugs:
    1.  When user switches to another Chrome window, start tracking 2 times
        (doesn't affect anything)
    2.  ...


  To-do:
    1. ...
    2. ...


  Functions with placeholders:
    1. getWebsiteCategory(websiteID)
    2. ...

*/


// ---------------------> for developing <---------------------
//chrome.storage.local.clear();

initialize();
function initialize() {
  chrome.storage.local.get('websites', function(items) {
    if (items.websites == undefined) {
      chrome.storage.local.set({'websites' : {}}, function() {
        console.log('Initialized storage for websites data');
      });
    }
  });
  chrome.storage.local.get('categories', function(items) {
    if (items.categories == undefined) {
      chrome.storage.local.set({'categories' : {}}, function() {
        console.log('Initialized storage for categories data');
      });
    }
  });
}


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

    currentSite = idFromUrl(tabUrl);

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

  var totalTime = (new Date()).getTime() - startTime;

  if (currentSite !== 'local') {
    addNewData(currentSite, totalTime);
  }
  

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

function addNewData(websiteId, time) {
  
  var websiteObject = null;
  var categoryObject = null;
  // var websiteCategory = getWebsiteCategory(websiteId);

  getWebsiteCategory(websiteId, function(websiteCategory) {


    // Saving new data for the website
    chrome.storage.local.get('websites', function(items) {
      item = items.websites[websiteId];

      if (item == null) {
        
        // Website not in DB -> creating new object
        websiteObject = {
          '_id' : websiteId,
          'category' : websiteCategory,
          'total_visits' : 0,
          'total_time' : 0,
          'month_visits' : 0,
          'month_time' : 0,
          'week_visits' : 0,
          'week_time' : 0,
          'day_visits' : 0,
          'day_time' : 0,
          'last_visit' : null
        };

      }
      else {
        // Object is already in DB -> use this object
        websiteObject = item;
      }

      // Updates visits and time for this website
      websiteObject = updateTimeAndVisits(websiteObject, time);

      items.websites[websiteId] = websiteObject;
      
      // Saving data to storage
      chrome.storage.local.set(items, function() {
        console.log('New data for the ' + websiteId + ' was added successfully');
      }); 
    });

    // Saving new data for the category
    chrome.storage.local.get('categories', function(items) {
      item = items.categories[websiteCategory];

      if (item == null) {

        // Website not in DB -> creating new object
        categoryObject = {
          '_id' : websiteCategory,
          'total_visits' : 0,
          'total_time' : 0,
          'month_visits' : 0,
          'month_time' : 0,
          'week_visits' : 0,
          'week_time' : 0,
          'day_visits' : 0,
          'day_time' : 0,
          'last_visit' : null
        };

      }
      else {
        // Object is already in DB -> use this object
        categoryObject = item;
      }

      // Updates visits and time for this website
      categoryObject = updateTimeAndVisits(categoryObject, time);

      items.categories[websiteCategory] = categoryObject;
      
      // Saving data to storage
      chrome.storage.local.set(items, function() {
        console.log('New data for the ' + websiteCategory + ' category was added successfully');
      });

    });
  });
}

function updateTimeAndVisits(object, time) {
  
  // Incrementing number of visits by 1
  object['total_visits'] += 1;
  object['month_visits'] += 1;
  object['week_visits'] += 1;
  object['day_visits'] += 1;

  // Incrementing time
  object['total_time'] += time;
  object['month_time'] += time;
  object['week_time'] += time;
  object['day_time'] += time;

  // Updating date for the last of this website
  object['last_visit'] = (new Date()).getTime();

  return object;
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


function getWebsiteCategory(websiteId, callback) {
  // WARNING: returns random category for now!

  
  // Check if category is already saved for this website
  chrome.storage.local.get('websites', function(items) {

    var websiteObject = items.websites[websiteId];

    if (websiteObject != null) {
      console.log('RETURNED CATEGORY: ' + websiteObject['category']);
      return callback(websiteObject['category']);
    }
    else {
      // // array with available categories
      // var categories = ['social', 'professional', 'work', 'news'];
      // // random number in range [0, categories.length - 1]
      // var rand = Math.floor((Math.random() * 100) % (categories.length));

      // // returns random category from an array
      // console.log('RETURNED CATEGORY: ' + categories[rand]);
      // 
      var category = "undefined"
      var url = "http://productify.herokuapp.com/getwebsitecategory/"+websiteId;
      $.ajax({url:url,success:function(result){
          category = result.trim();
          console.log(category);

          return callback(category);
      }});

    }

  });
}


/***********************************************************
  **
  **    FROM THE PREVIOUS VERSION
  **
  **    idFromUrl(url) - returns id for a given url
  **
  **********************************************************/


function idFromUrl (currentUrl) {
  // deletes protocol, like 'http://'
  currentUrl = currentUrl.substring(currentUrl.indexOf("//") + 2);
  
  // delete all subpages
  if (currentUrl.indexOf("/") !== -1) {
    currentUrl = currentUrl.substring(0, currentUrl.indexOf("/"));  
  }
  
  // deletes www. from the url
  if (currentUrl.indexOf("www.") !== -1) {
    currentUrl = currentUrl.substring(currentUrl.indexOf("www.") + 4);
  }

  if (currentUrl.indexOf(".") == -1) {
    currentUrl = "local";
  } 

  // deletes TLD
  // currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('.'));

  return currentUrl;
}

