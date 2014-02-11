$(function () {

	function parseCategories() {
		return localStorage["allCategories"].split(",");
	}

	var allCat = parseCategories(localStorage["allCategories"]);
	for (var i = 0; i < allCat.length; i++) {
		var temp = '<option value="' + allCat[i] + '">' + allCat[i] + '</option>';
		$('select option.first').after(temp);
	}

	var keys = Object.keys(localStorage);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i].indexOf('_goal') !== -1) {
			var time = Math.floor(parseInt(localStorage[keys[i]]) / 3600000);
			var name = keys[i].substring(0, keys[i].indexOf('_goal'));
			if (time !== 0) {
				$('.no_goals').hide();
				$('.right h3').after('<span><b>' + name + '</b> set to <b>' + time +'</b> hour(s)');
			}
		}
	}

	$('#submit').click(function () {
		var name = $('#choose_category').val() + "_goal";
		var time = parseInt($('#num_hours').val()) * 1000 * 3600;
		if (time !== 0) {
			localStorage[name] = time;
		}
	});


});