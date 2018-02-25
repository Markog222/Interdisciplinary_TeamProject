function youtube(url, target){
	
	var $url = url;
	//var $url = 'https://www.youtube.com/embed/ic03Af0oWo0';
	var $target = target;
	
	var $widget = $('<iframe width="inherit" height="inherit" src="'+$url+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
	
	$target.append($widget);
	
	return $target;
}