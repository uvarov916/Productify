$(function () {

	function parseCategories() {
		return localStorage["allCategories"].split(",");
	}

	var allCat = parseCategories(localStorage["allCategories"]);
	for (var i = 0; i < allCat.length; i++) {
		var temp = '<option value="' + allCat[i] + '">' + allCat[i] + '</option>';
		$('select option.first').after(temp);
	}

	$('#submit').click(function () {
		var name = $('#choose_category').val() + _goal;
		var time = parseInt($('#num_hours').val() * 1000 * 3600);
		localStorage[name] = time;
	});


});