$(function () {

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

	function parseCategories() {
		return localStorage["allCategories"].split(",");
	}

	function topCategories (n) {
		var cat = parseCategories(localStorage["allCategories"]);
		var length = cat.length;
		if (length < n) {
			return "Visit More Websites!";
		}
		else {
			var sortable = [];
			for (var i = 0; i < cat.length; i++) {
				sortable.push([cat[i], localStorage[cat[i] + "_time"]]);
			}
			sortable.sort(function(a, b) {return b[1] - a[1]});
			var result = [];
			for (var i = 0; i < n; i++) {
				result.push(sortable[i][0]);
			}
			return result;
		}
	}	

	var topCat = topCategories(5);
	var percent;

	$('#div1 .category').text(topCat[0]);
	$('#div1 .oval').text(timeToString(localStorage[topCat[0] + "_time"]));
	percent = Math.floor((localStorage[topCat[0] + "_time"]/localStorage["totalTime"])*100);
	if (isNaN(percent)) {
		percent = 0;
	}
	$('#div1 .percent').text(percent + "%");

	$('#div2 .category').text(topCat[1]);
	$('#div2 .oval').text(timeToString(localStorage[topCat[1] + "_time"]));
	percent = Math.floor((localStorage[topCat[1] + "_time"]/localStorage["totalTime"])*100);
	if (isNaN(percent)) {
		percent = 0;
	}
	$('#div2 .percent').text(percent + "%");

	$('#div3 .category').text(topCat[2]);
	$('#div3 .oval').text(timeToString(localStorage[topCat[2] + "_time"]));
	percent = Math.floor((localStorage[topCat[2] + "_time"]/localStorage["totalTime"])*100);
	if (isNaN(percent)) {
		percent = 0;
	}
	$('#div3 .percent').text(percent + "%");

	$('#div4 .category').text(topCat[3]);
	$('#div4 .oval').text(timeToString(localStorage[topCat[3] + "_time"]));
	percent = Math.floor((localStorage[topCat[3] + "_time"]/localStorage["totalTime"])*100);
	if (isNaN(percent)) {
		percent = 0;
	}
	$('#div4 .percent').text(percent + "%");

	$('#div5 .category').text(topCat[4]);
	$('#div5 .oval').text(timeToString(localStorage[topCat[4] + "_time"]));
	percent = Math.floor((localStorage[topCat[4] + "_time"]/localStorage["totalTime"])*100);
	if (isNaN(percent)) {
		percent = 0;
	}
	$('#div5 .percent').text(percent + "%");

	

	var topCat = topCategories(8);

	var chart = AmCharts.makeChart("chartdiv", {
					    "type": "pie",	
						"theme": "none",
					    "legend": {
					        "markerType": "circle",
					        "position": "right",
							"marginRight": 80,		
							"autoMargins": false
					    },
					    "dataProvider": [{
					        "category": topCat[0],
					        "minutes": Math.floor(localStorage[topCat[0] + "_time"]/1000)
					    }, {
					        "category": topCat[1],
					        "minutes": Math.floor(localStorage[topCat[1] + "_time"]/1000)
					    }, {
					        "category": topCat[2],
					        "minutes": Math.floor(localStorage[topCat[2] + "_time"]/1000)
					    }, {
					        "category": topCat[3],
					        "minutes": Math.floor(localStorage[topCat[3] + "_time"]/1000)
					    }, {
					        "category": topCat[4],
					        "minutes": Math.floor(localStorage[topCat[4] + "_time"]/1000)
					    }, {
					        "category": topCat[5],
					        "minutes": Math.floor(localStorage[topCat[5] + "_time"]/1000)
					    }, {
					        "category": topCat[6],
					        "minutes": Math.floor(localStorage[topCat[6] + "_time"]/1000)
					    }, {
					    	"category": topCat[7],
					        "minutes": Math.floor(localStorage[topCat[7] + "_time"]/1000)
					    }],
					    "valueField": "minutes",
					    "titleField": "category",
					    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
					    "exportConfig": {
					        "menuTop":"0px",
					        "menuItems": [{
					            "icon": '/lib/3/images/export.png',
					            "format": 'png'
					        }]
					    }
					});
});

























