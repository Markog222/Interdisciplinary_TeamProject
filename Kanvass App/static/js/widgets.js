var $google_type;
var $chart_body =[];

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

function twitter(id, hashtag, target){
    var $id = id;
    var $hash = hashtag;
  	var $target = target;;
  	//Test: https://docs.google.com/presentation/d/13vsbKgIg2bsd21RXIVwcjSFC6Am-vm42Z5XshNAha9I/preview?start=true&loop=false&delayms=3000
  	var $widget = $('<a class="twitter-timeline" href="https://twitter.com/hashtag/'+$hash+'" data-widget-id="'+$id+'">#'+$hash+' Tweets</a>'
    +'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script><br />');
  	$target.append($widget);
  	$target.attr('data-kan-type','twitter_widget');
		$target.attr('data-twitter-id',$id);
		$target.attr('data-twitter-hashtag',$hash);
  	return $target;

}

function getChartDetails(deets){

  var $details = {};
  $details.legend = deets[0][1];
  $details.labels=[];
  $details.data=[];
  $details.bgColors=[];
  $details.borColors=[];

  var bgColors=['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgb(33, 77, 255, 0.2)','rgb(58, 0, 193, 0.2)','rgb(193, 0, 119, 0.2)',
  'rgba(255, 159, 0, 0.2)'];
  var borColors=['rgba(255,99,132,1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)','rgb(33, 77, 255, 1)','rgb(58, 0, 193, 1)','rgb(193, 0, 119, 1)','rgba(255, 159, 0, 1)'];

  for(i=1;i<deets.length;i++){
    $details.labels.push(deets[i][0]);
    $details.data.push(deets[i][1]);
    $details.bgColors.push(bgColors[i-1]);
    $details.borColors.push(borColors[i-1]);
  }

  return $details;
}


function drawChart(el,dat,header,pos,typ){

  var $target = el;

  var $new_chart=$('<div class="chart-container new_div" style="display:none; position:absolute; width:400px;"><canvas id="tmp_chart"></canvas></div>');
  $new_chart.attr('data-kan-type',typ);
  $new_chart.attr('data-kan-wid',$target.attr('data-kan-wid'));

  $('#kanvass').append($new_chart);
  $new_chart.draggable();

  var $chart_details = getChartDetails(dat);
	$chart_body.push($chart_details);
  var $chart_type = typ.replace('_chart','');

  var ctx = document.getElementById('tmp_chart');
  var chartid = 'chart_'+parseInt(Math.random()*100000);
  ctx.setAttribute('id',chartid);
  var myChart = new Chart(ctx, {
    type: $chart_type,
    data: {
        labels: $chart_details.labels,
        datasets: [{
            label: $chart_details.legend,
            data: $chart_details.data,
            backgroundColor: $chart_details.bgColors,
            borderColor: $chart_details.borColors,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes:[{
              display:false
            }]
        },
        legend:{
          position:'bottom'
        },
        title: {
            display: true,
            text: 'Pizza'
        }
    }
});


  $new_chart.append('<div id="drag_icon"></div>');
  $new_chart.append('<div class="del_icon"></div>');
  $new_chart.append('<div class="resize_icon"></div>');
  //$new_chart.rotatable({wheelRotate:false});
  var $n_pos = $('#new_div').position();
  $('#new_div').remove();
	console.log(pos)
	console.log($('#'+chartid).parent().css('position'))
	var position = '{"top":,"left":}'
	$('#'+chartid).parent().css({'top':pos.top,'left':pos.left,'display':'block'},)

  $('upload_chartpickerBtn').val('');
  menuActions();
	delButton();
	resizeButton();

}

function redrawChart(el,dat,pos,typ,style, h, w){

  var $target = el;
	var m = style.match(/[(].+[)]/g);
  var $new_chart=$('<div class="chart-container new_div" style="display:none; position:absolute; width:400px;"><canvas id="tmp_chart"></canvas></div>');
  $new_chart.attr('data-kan-type',typ);
  $new_chart.attr('data-kan-wid',$target.attr('data-kan-wid'));


  $('#kanvass').append($new_chart);
  $new_chart.draggable();
	console.log(dat)
  var $chart_details = dat;
	$chart_body.push($chart_details);
  var $chart_type = typ.replace('_chart','');

  var ctx = document.getElementById('tmp_chart');
  var chartid = 'chart_'+parseInt(Math.random()*100000);
  ctx.setAttribute('id',chartid);
  var myChart = new Chart(ctx, {
    type: $chart_type,
    data: {
        labels: $chart_details.labels,
        datasets: [{
            label: $chart_details.legend,
            data: $chart_details.data,
            backgroundColor: $chart_details.bgColors,
            borderColor: $chart_details.borColors,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes:[{
              display:false
            }]
        },
        legend:{
          position:'bottom'
        },
        title: {
            display: true,
            text: 'Pizza'
        }
    }
});

  $new_chart.append('<div id="drag_icon"></div>');
  $new_chart.append('<div class="del_icon"></div>');
  $new_chart.append('<div class="resize_icon"></div>');
  //$new_chart.rotatable({wheelRotate:false});
	//$new_chart.css('transform','rotate'+m[0]);

	$('#'+chartid).parent().css({'top':pos.top,'left':pos.left,'display':'block','height':h+'px','width':w+'px'})
	delButton();
	resizeButton();

}
