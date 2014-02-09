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
	<title>GraphUp Demo 3</title>

	<style type="text/css">
	body { font:14px Helvetica,Arial,sans-serif; }
	p { max-width:40em; }
	table { margin:2em 0; }
	th, td { padding:0.4em; width:6em; text-align:center; }
	th { border:1px solid #ccc; border-width:0 1px 1px 0; }

	/* Special styles for the demo tables */
	#table1 td:hover { font-weight:bold; cursor:default; }
	#table1 td:hover .bubble { opacity:1 !important; z-index:101 !important; }
	</style>

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script type="text/javascript" src="../script/jquery.graphup.pack.js"></script>
	<script type="text/javascript">
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
	</script>

</head>
<body>

	<h1>GraphUp Demo 3 · Bubbles</h1>

	<p>
		Watch the <code>bubbles</code> painter doing its job! Nice, huh.
		Note that if your browser does not support CSS <code>border-radius</code>, it will be squares.
		The lower 50% of the values are hidden automatically for clarity.
		This is done via the <code>callBeforePaint</code> callback.
	</p>

	<?php echo table_visitors('table1') ?>

	<p>
		Have a look at the source of this page to learn and see exactly how it all works.
	</p>

</body>
</html>