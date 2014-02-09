<?php

// Function to generate a random demo data table
function table_visitors($id = '')
{
	$table = '<table id="'.$id.'" cellspacing="0">
		<tr>
			<th style="width:8em"></th>
			<th>Monday</th>
			<th>Tuesday</th>
			<th>Wednesday</th>
			<th>Thursday</th>
			<th>Friday</th>
			<th>Saturday</th>
			<th>Sunday</th>
		</tr>';

	for ($i = 0; $i < 24; $i += 2)
	{
		$table .= "\n".'<tr><th scope="row">'.sprintf('%02d', $i).':00–'.sprintf('%02d', $i + 2).':00</th>';

		for ($j = 1; $j <= 7; $j++)
		{
			$min = ($i + 1) * mt_rand(40, 60);
			$max = mt_rand(mt_rand(2000, 3000), mt_rand(4000, 5000));

			// Night
			if ($i > 1 && $i < 7)
			{
				$min /= mt_rand(2, 4);
				$max /= mt_rand(2, 4);
			}
			// Morning and evening peak
			elseif (($i > 6 && $i < 11) || ($i > 16 && $i < 21))
			{
				$min *= 4;
				$max *= 1.1;
			}

			// Friday and Saturday boost
			if ($j === 5 || $j === 6)
			{
				$min *= 1.3;
			}

			$table .= '<td>'.mt_rand($min, $max).'</td>';
		}

		$table .= '</tr>';
	}

	return $table .= '</table>';
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>GraphUp Demo 1</title>

	<style type="text/css">
	body { font:14px Helvetica,Arial,sans-serif; }
	p { max-width:40em; }
	table { margin:2em 0; }
	th, td { padding:0.4em; width:6em; text-align:center; }
	th { border:1px solid #ccc; border-width:0 1px 1px 0; }

	/* Special styles for the demo tables */
	#table1 .top50 { font-weight:bold; text-shadow:0 1px 0 rgba(255,255,255,0.25); }
	#table2 td:hover span { opacity:1 !important; font-weight:bold; cursor:default; }
	</style>

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script type="text/javascript" src="../script/jquery.graphup.pack.js"></script>
	<script type="text/javascript">
	$(document).ready(function() {
		// First table
		$('#table1 td').graphup({
			colorMap: 'greenPower',
			callBeforePaint: function() {
				// Add a special CSS class to the top 50%
				if (this.data('percent') >= 50) {
					this.addClass('top50');
				}
			}
		});

		// Second table
		// Wrap each cell's value in a span element
		$('#table2 td').wrapInner('<span/>').graphup({
			colorMap: 'burn',
			callBeforePaint: function() {
				// Make opacity match the percentage
				$('span', this).css('opacity', this.data('percent') / 100);
			}
		});
	});
	</script>

</head>
<body>

	<h1>GraphUp Demo 1 · Fill</h1>

	<p>
		The demo tables below could represent the average visitor count to your website split up per day and hour.
		In the first table, the <code>greenPower</code> color map is used.
		Also, using the <code>callBeforePaint</code> callback we assign a special CSS class for all cells above 50%.
	</p>

	<?php echo table_visitors('table1') ?>

	<p>
		Obviously, in the next table another color map has been used: <code>burn</code>.
		There is more going on, though. Via the <code>callBeforePaint</code> callback we customize the opacity of each cell's text, according to its percentage.
		This creates a nice extra visual effect.
	</p>

	<?php echo table_visitors('table2') ?>

	<p>
		Have a look at the source of this page to learn and see exactly how it all works.
	</p>

</body>
</html>