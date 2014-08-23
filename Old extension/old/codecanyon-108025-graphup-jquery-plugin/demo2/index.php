<?php

// Function to generate a random demo data table
function table_earnings_vertical($id = '')
{
	$table = '<table id="'.$id.'" cellspacing="0">';

	for ($i = 1; $i <= 12; $i++)
	{
		$table .= "\n<tr>";
		$table .= '<th>'.date('F Y', strtotime('01-'.$i.'-'.date('Y'))).'</th>';
		$table .= '<td><span>$'.mt_rand(30, 100 * max(3, min($i, 8)) / 2).'.'.sprintf('%02d', mt_rand(0, 99)).'</span></td>';
		$table .= '</tr>';
	}

	return $table .= '</table>';
}

function table_earnings_horizontal($id = '')
{
	$table = '<table id="'.$id.'" cellspacing="0"><tr>';

	for ($i = 1; $i <= 12; $i++)
	{
		$table .= '<th>'.date('M Y', strtotime('01-'.$i.'-'.date('Y'))).'</th>';
	}

	$table .= '</tr><tr>';

	for ($i = 1; $i <= 12; $i++)
	{
		$table .= '<td><span>€'.mt_rand($i * 11 - $i * 4, min($i, 9) * 19).','.sprintf('%02d', mt_rand(0, 99)).'</span></td>';
	}

	return $table .= '</tr></table>';
}

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
	<title>GraphUp Demo 2</title>

	<style type="text/css">
	body { font:14px Helvetica,Arial,sans-serif; }
	p { max-width:40em; }
	table { margin:2em 0; border-collapse:collapse; }
	th, td { padding:0.4em; border:1px solid #ccc; }

	/* Special styles for the demo tables */
	#table1 th { width:8em; text-align:right; }
	#table1 td { width:24em; text-align:right; }
	#table1 span { padding:0.1em 0.2em; background:rgba(255,255,255,0.5); -moz-border-radius:2px; }
	#table1 .bar { -moz-border-radius-topright:5px; -moz-border-radius-bottomright:5px; -webkit-border-top-right-radius:5px; -webkit-border-bottom-right-radius:5px; }

	#table2 th { width:5em; text-align:center; }
	#table2 td { height:12em; text-align:center; }
	#table2 span { padding:1px 2px; background:#fff; }

	#table3 td { width:6em; text-align:center; color:#333; }
	</style>

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script type="text/javascript" src="../script/jquery.graphup.pack.js"></script>
	<script type="text/javascript">
	$(document).ready(function() {
		// First table
		$('#table1 td').graphup({
			min: 0,
			cleaner: 'strip',
			painter: 'bars',
			colorMap: [[145,89,117], [102,0,51]]
		});

		// Second table
		$('#table2 td').graphup({
			min: 0,
			decimalPoint: ',',
			cleaner: 'strip',
			painter: 'bars',
			barsAlign: 'bottom',
			colorMap: 'greenPower'
		});

		// Third table
		$('#table3 td').graphup({
			painter: 'bars',
			barsAlign: 'hcenter'
		});
	});
	</script>

</head>
<body>

	<h1>GraphUp Demo 2 · Bars</h1>

	<p>
		Here we've got some kind of earnings table.
		Since we're dealing with monetary values, the <code>strip</code> cleaner is used.
		We're also using a custom <code>colorMap</code> and, of course, the <code>bars</code> painter.
	</p>

	<?php echo table_earnings_vertical('table1') ?>

	<p>
		A similar table, but we're using vertical bars this time in combination with the <code>greenPower</code> color map.
		Also, since we're dealing with euros, the <code>decimalPoint</code> option has been set to a comma.
	</p>

	<?php echo table_earnings_horizontal('table2') ?>

	<p>
		The table below uses the <code>heatmap</code> color map on bars that are horizontally centers by setting <code>barsAlign</code> to <code>hcenter</code>.
	</p>

	<?php echo table_visitors('table3') ?>

	<p>
		Have a look at the source of this page to learn and see exactly how it all works.
	</p>

</body>
</html>