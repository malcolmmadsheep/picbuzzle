<?php
	$url = $_GET['url'];
	$type = mime_content_type($url);
	$json 	= array();

	$imageData = base64_encode(file_get_contents($url));
	$src = 'data: '.$type.';base64,'.$imageData;
	
	$bus = array(
		'data' => $src
		);

	array_push($json, $bus);
	$jsonstring = json_encode($json);
	echo $jsonstring;
?>