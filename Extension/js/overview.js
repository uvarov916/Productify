var unproductiveCategories = [
  "Gambling",
  "Games",
  "Internet and Telecom",
  "Social",
  "People and Society",
  "Sports",
  "Shopping",
  "Adult",
  "News and Media",
  "Arts and Entertainment"
];

var productiveCategories = [
  "Books",
  "Business",
  "Beauty and Fitness",
  "Finance",
  "Career and Education",
  "Law and Government",
  "Science",
  "Search",
  "Reference",
  "Computer and Electronics"
];

var pieData = [];

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
  
  $('.overview .time-logged .description').html(formatTime(totalTimeLogged));
  $('.overview .websites-visited .description em').text(numberOfWebsitesVisited);
  $('.overview .most-visited .description').text(maxVisits_website);
  $('.overview .most-time .description').text(maxTime_website);
});

function formatTime(timeInMilliseconds) {
  var timeInSeconds = Math.floor(timeInMilliseconds / 1000);
  var timeInMinutes = Math.floor(timeInSeconds / 60);

  if (timeInMinutes < 60) {
    if (timeInMinutes == 1) {
      return "<em>" + timeInMinutes + "</em> minute logged";
    }
    else {
      return "<em>" + timeInMinutes + "</em> minutes logged";
    }
  }
  else {
    var timeInHours = Math.floor(timeInMinutes / 60);
    if (timeInHours == 1) {
      return "<em>" + timeInHours + "</em> hour logged";
    }
    else {
      return "<em>" + timeInHours + "</em> hours logged";
    }
  }
}



chrome.storage.local.get('categories', function(items) {
  console.log("First checkpoint");
  var categories = items['categories'];

  var topSixCategories = [];
  for (var i = 0; i <= 5; i++) {
    topSixCategories[i] = {'_id': '-', 'day_time' : 0};
  }

  for (key in categories) {
    var category = categories[key];
    var categoryTime = category['day_time'];

    if (categoryTime > topSixCategories[5].day_time) {
      topSixCategories[5] = category;
      
      for (var i=4; i >= 0; i--) {
        if (categoryTime > topSixCategories[i].day_time) {
          topSixCategories[i+1] = topSixCategories[i];
          topSixCategories[i] = category;
        }
      }
    }

  }


  pieData = [
    {
      value: topSixCategories[0].day_time,
      color:"#F7464A",
      highlight: "#FF5A5E",
      label: topSixCategories[0]['_id']
    },
    {
      value: topSixCategories[1].day_time,
      color: "#568DCD",
      highlight: "#769ECD",
      label: topSixCategories[1]['_id']
    },
    {
      value: topSixCategories[2].day_time,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: topSixCategories[2]['_id']
    },
    {
      value: topSixCategories[3].day_time,
      color: "#FDB45C",
      highlight: "#FFC870",
      label: topSixCategories[3]['_id']
    },
    {
      value: topSixCategories[4].day_time,
      color: "#949FB1",
      highlight: "#A8B3C5",
      label: topSixCategories[4]['_id']
    },
    {
      value: topSixCategories[5].day_time,
      color: "#4D5360",
      highlight: "#616774",
      label: topSixCategories[5]['_id']
    }
  ];

  loadPieGraph();

});


function loadPieGraph() {
  var ctx = document.getElementById("myChart").getContext("2d");
  window.myPie = new Chart(ctx).Pie(pieData, {segmentShowStroke : false});
  
  printProductivityScore();

  $(".pie-stat.first .name").text(pieData[0].label);
  $(".pie-stat.first .time").text(timeForPieGraphLabels(pieData[0].value));

  $(".pie-stat.second .name").text(pieData[1].label);
  $(".pie-stat.second .time").text(timeForPieGraphLabels(pieData[1].value));

  $(".pie-stat.third .name").text(pieData[2].label);
  $(".pie-stat.third .time").text(timeForPieGraphLabels(pieData[2].value));

  $(".pie-stat.fourth .name").text(pieData[3].label);
  $(".pie-stat.fourth .time").text(timeForPieGraphLabels(pieData[3].value));

  $(".pie-stat.fifth .name").text(pieData[4].label);
  $(".pie-stat.fifth .time").text(timeForPieGraphLabels(pieData[4].value));

  $(".pie-stat.sixth .name").text(pieData[5].label);
  $(".pie-stat.sixth .time").text(timeForPieGraphLabels(pieData[5].value));
}

function timeForPieGraphLabels(timeInMilliseconds) {
  var timeInSeconds = Math.floor(timeInMilliseconds / 1000);
  var timeInMinutes = Math.floor(timeInSeconds / 60);
  var percentage = Math.floor((timeInMilliseconds / totalTimeLogged) * 100);

  if (timeInMinutes < 60) {
    return timeInMinutes + "m / " + percentage + "%";
  }
  else {
    var timeInHours = Math.floor(timeInMinutes / 60);
    return timeInHours + "h / " + percentage + "%";
  }
}

function printProductivityScore() {
  var productiveTime = 0;
  var unproductiveTime = 0;

  chrome.storage.local.get('categories', function(items) {
    var categories = items['categories'];

    for (key in categories) {
      var category = categories[key];

      if ($.inArray(category['_id'], unproductiveCategories) > -1) {
        unproductiveTime += category['day_time'];
      }
      else if ($.inArray(category['_id'], productiveCategories) > -1) {
        productiveTime += category['day_time'];
      }

    }

    var productivityScore = Math.floor((productiveTime / (productiveTime + unproductiveTime))*100);
    console.log("Productive time: " + productiveTime);
    console.log("Unproductive time: " + unproductiveTime);
    console.log("Productivity score: " + productivityScore);
    
    $(".productivity-score").text(productivityScore);
    
    var productivityScorePieData = [
      {
        value: productivityScore,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "productive"
      },
      {
        value: (100 - productivityScore),
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "unproductive"
      }
    ];

    var ctx = document.getElementById("productivityScoreChart").getContext("2d");
    window.myPie = new Chart(ctx).Doughnut(productivityScorePieData, {segmentShowStroke : false, percentageInnerCutout: 85});

  });
}




