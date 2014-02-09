$(document).ready(function() {
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
	});