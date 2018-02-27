var $google_type;


function youtube(url, target){

	var $url = url;
	var $target = target;
	var $widget = $('<iframe width="100%" height="100%" src="'+$url+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');

	$target.append($widget);
	return $target;
}

function picture(url, target){

	var $url = url;
	var $target = target;
	$target.css('width','auto');
	$target.css('height','auto');
	var $widget = $('<img src="'+$url+'" height="100%" width="100%" />');

	$target.append($widget);

	return $target;


}

function slide(url, target){

	var $url = url;
	var $target = target;
	$target.css('width','auto');
	$target.css('height','auto');
	var $widget = $('<iframe id="display" src="https://docs.google.com/presentation/d/13vsbKgIg2bsd21RXIVwcjSFC6Am-vm42Z5XshNAha9I/preview?start=true&loop=false&delayms=3000"'
	+'frameborder="0" width="500" height="291"	allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');

	$target.append($widget);

	return $target;


}
