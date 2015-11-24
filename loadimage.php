<?php
	$url = $_GET['url'];
	$json 	= array();
	
	$imageData = base64_encode(file_get_contents($url));
	$src = 'data:false;base64,'.$imageData;
	
	$bus = array(
		'data' => $src
		);

	array_push($json, $bus);
	$jsonstring = json_encode($json);
	echo $jsonstring;
?>