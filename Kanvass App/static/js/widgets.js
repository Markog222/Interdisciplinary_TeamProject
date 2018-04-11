 var $google_type;

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
	$target.css('min-width','335px');
	//Test: https://docs.google.com/presentation/d/13vsbKgIg2bsd21RXIVwcjSFC6Am-vm42Z5XshNAha9I/preview?start=true&loop=false&delayms=3000
	var $widget = $('<iframe id="display" src="'+$url+'"'
	+' frameborder="0" width="100%" height="100%"	allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');
	$target.append($widget);
	$target.attr('data-kan-type','slide');
	return $target;

}

function text(text, target){

	var $text = text;
	var $target = target;
	console.log($text)
	//var $widget = $('<textarea class="text_create"></textarea>');
	var $widget = $('<div class="text_create">'+$text+'</div>');
	$widget.css({'font-size':'16px','width':'100%','height':'100%'});
	//$widget.attr('placeholder',$text)
	$target.append($widget);
	$target.attr('data-kan-type','text');
	return $target;

}

function drawChart(el, dat, header, pos, typ) {

		var $target =el;
	  var $new_chart=$('<div id="tmp_chart" style="display:none;"></div>')
		$('#kanvass').append($new_chart);
        var data = new google.visualization.DataTable();
				if(header == true) {

				}

				data.addColumn('string', dat[0][0]);
        data.addColumn('number', dat[0][1]);
				dat.splice(0,1);
				data.addRows(dat);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night','max-width':$target.height()+'px','max-height':$target.width()+'px'};

        // Instantiate and draw our chart, passing in some options.
				var $tmp=$('#tmp_chart');
				console.log(typ);
				if(typ == 'pie_chart'){
						var $chart = new google.visualization.PieChart($tmp[0]);
				} else if(typ == 'line_chart') {
					 var $chart = new google.visualization.LineChart($tmp[0]);
				} else if(typ == 'bar_chart') {
					 var $chart = new google.visualization.BarChart($tmp[0]);
				}

				$chart.draw(data, options);

				$target.append($('#tmp_chart').removeAttr('id').css('display','block'))
				$('#tmp_chart').remove();

				$target.css($('#new_div').position())
				$target.attr('data-kan-type','chart');
				$target.attr('data-kan-wid',$count);
				widgetSettings($target, $('#new_div').position());
}
