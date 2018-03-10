var $google_type;

function delButton(){

	$('#del_icon').click(function(e){
		e.preventDefault();
		var $par = e.currentTarget.parentNode;
		var $kid=window.location.href.replace("http://localhost:5000/create?id=","");
		var $wid=$par.getAttribute('data-kan-wid');
		$par.remove();

		var $data = {
			"delWidget":[]
		};
		
		$data.delWidget.push({
			"kid":$kid,
			"wid":$wid
		});

		if($saved == 1){
			$.ajax({
				type:"POST",
				url:"/delWidget",
				data:JSON.stringify($data),
				contentType:"application/javascript"
			}).done(function(res){
				console.log(res);
			})
		}
	});

}


function youtube(url, target){

	var $url = url;
	var $target = target;
	var $widget = $('<iframe style="width:100%;height:100%" src="'+$url+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
	$target.append($widget);
	$target.attr('data-kan-type','youtube');
	return $target;
}

function vimeo(url, target){
	var $url = url;
	var $target = target;
	var $widget = $('<iframe src="'+$url+'" style="width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
	$target.append($widget);
	$target.attr('data-kan-type','vimeo');
	return $target;

}

function picture(url, target){

	var $url = url;
	var $target = target;
	$target.css('width','auto');
	$target.css('height','auto');
	var $widget = $('<img src="'+$url+'" height="100%" width="100%" />');

	$target.append($widget);
	$target.attr('data-kan-type','image');
	return $target;


}

function slide(url, target){

	var $url = url;
	var $target = target;
	$target.css('width','auto');
	$target.css('height','auto');
	//Test: https://docs.google.com/presentation/d/13vsbKgIg2bsd21RXIVwcjSFC6Am-vm42Z5XshNAha9I/preview?start=true&loop=false&delayms=3000
	var $widget = $('<iframe id="display" src="'+$url+'"'
	+' frameborder="0" width="100%" height="100%"	allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');

	$target.append($widget);
	$target.attr('data-kan-type','slide');
	return $target;


}

function videoTrigger(){
	var $vidSrc = $('input[name="vid_source_type"]');
	console.log($vidSrc[0].checked+" "+$vidSrc[1].checked+" "+$vidSrc[2].checked);

	if(($vidSrc[0].checked && $('#youtube_url').val() =="") || ($vidSrc[1].checked && $('#vimeo_url').val()=="")){
		$('#error_out').html('<span style="color:red;">Please enter a URL.<span>')
	} else if($vidSrc[0].checked) {
		//For testing: addNew('youtube','https://www.youtube.com/embed/ic03Af0oWo0');
		var $src_original=$('#youtube_url').val();
		var $src = $src_original.replace("https://www.youtube.com/watch?v=","https://www.youtube.com/embed/");
		//Add url validation
		addNew('youtube',$src);
		$('#youtube_url').val("");
		$('#vidYes').off();
	} else if($vidSrc[1].checked){
		//For testing: addNew('vimeo','https://player.vimeo.com/video/247068452');
		var $src_original=$('#vimeo_url').val();
		https://vimeo.com/channels/staffpicks/258693816
		var $src = $src_original.replace("https://vimeo.com/","https://player.vimeo.com/video/");
		//Add url validation
		addNew('youtube',$src);
		$('#vidYes').off();
		$('#youtube_url').val("");
	} else {
		$('#vidYes').off();
		alert('This functionality is currently not supported.')
	}

	$('#video_popup').hide();
	$('#vid_back').hide();
}
