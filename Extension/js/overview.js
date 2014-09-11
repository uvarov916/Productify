var maxTime = 0;
var maxTime_website = "";

var maxVisits = 0;
var maxVisits_website = "";

var numberOfWebsitesVisited = 0;
var totalTimeLogged = 0;

chrome.storage.local.get('websites', function(items) {
  var websites = items['websites'];

  for (key in websites) {  
    var website = websites[key];


    if (website['day_visits'] > 0) {
      numberOfWebsitesVisited++;
      totalTimeLogged += website['day_time'];

      console.log(website['day_time']);
      if (website['day_time'] > maxTime) {
        maxTime = website['day_time'];
        maxTime_website = website['_id'];
      }

      if (website['day_visits'] > maxVisits) {
        maxVisits = website['day_visits'];
        maxVisits_website = website['_id'];
      }
    }

  }
  
  $('.overview .time-logged .description em').text(totalTimeLogged);
  $('.overview .websites-visited .description em').text(numberOfWebsitesVisited);
  $('.overview .most-visited .description').text(maxVisits_website);
  $('.overview .most-time .description').text(maxTime_website);
});




