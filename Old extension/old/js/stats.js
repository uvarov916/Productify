$(document).ready(function() {
	

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



	// First table
	$('#table1 td').graphup({
		painter: 'bubbles',
		bubblesDiameter: 80, // px
		callBeforePaint: function() {
			// Hide all values under 50%
			if (this.data('percent') < 50) {
				this.text('');
			}
		}
	});



	$('#facebook span.visits').text(localStorage["facebook_vis"]);
	$('#twitter span.visits').text(localStorage["twitter_vis"]);
	$('#linkedin span.visits').text(localStorage["linkedin_vis"]);
	$('#pinterest span.visits').text(localStorage["pinterest_vis"]);
	$('#instagram span.visits').text(localStorage["instagram_vis"]);
	$('#vk span.visits').text(localStorage["vk_vis"]);
	var sumTimes = parseInt(localStorage["facebook_vis"]) + parseInt(localStorage["twitter_vis"]) + parseInt(localStorage["linkedin_vis"]) + parseInt(localStorage["pinterest_vis"]) + parseInt(localStorage["instagram_vis"]) + parseInt(localStorage["vk_vis"]);
	$('#total span.visits').text(sumTimes);


	$('#facebook span.time').text(timeToString(localStorage["facebook"]));
	$('#twitter span.time').text(timeToString(localStorage["twitter"]));
	$('#linkedin span.time').text(timeToString(localStorage["linkedin"]));
	$('#pinterest span.time').text(timeToString(localStorage["pinterest"]));
	$('#instagram span.time').text(timeToString(localStorage["instagram"]));
	$('#vk span.time').text(timeToString(localStorage["vk"]));
	var sumTime = parseInt(localStorage["facebook"]) + parseInt(localStorage["twitter"]) + parseInt(localStorage["linkedin"]) + parseInt(localStorage["pinterest"]) + parseInt(localStorage["instagram"]) + parseInt(localStorage["vk"]); 
	$('#total span.time').text(timeToString(sumTime));

});