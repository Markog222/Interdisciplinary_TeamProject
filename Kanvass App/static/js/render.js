function applySettings(target,el) {
  console.log(el)
  console.log(el.link)
  target.prop('src', el.link);
  target.attr('style', el.style);
  target.css('position', 'absolute');
  target.position(el.pos)
  target.css('height', el.height+'px');
  target.css('width', el.width+'px');
  if(target.attr('data-kan-type')=='text'){
    target.attr('style',target.attr('style')+';'+el.textstyle);
    target.text(el.link)
  }



  return target

}


function viewYoutube(el){
    var $widget = $('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
    $widget = applySettings($widget,el);
    $('#kanvass').append($widget);

}

function viewVimeo(el){
  var $widget = $('<iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
  $widget = applySettings($widget,el);
  $('#kanvass').append($widget);
}

function viewImage(el){
  var $widget = $('<img />')
  $widget = applySettings($widget,el);
  $('#kanvass').append($widget);

}

function viewSlides(el){
  var $widget = $('<iframe frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>')
  $widget = applySettings($widget,el);
  $('#kanvass').append($widget);
}

function viewText(el){
  var $widget = $('<div></div>');
  $widget.attr('data-kan-type','text');
  applySettings($widget,el);
  $('#kanvass').append($widget);
}

function viewChart(el){
  var $new_chart=$('<div class="chart-container new_div" style="display:none; position:absolute; width:400px;"><canvas id="tmp_chart"></canvas></div>');
  $('#kanvass').append($new_chart);

  var $chart_details = el.chart_data;
  var $chart_type = el.type.replace('_chart','');
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
  $('#'+chartid).parent().css({'top':el.pos.top,'left':el.pos.left,'display':'block','height':el.height+'px','width':el.width+'px'})
}

function viewTwitter(el){
    var $hash = el.twitter_data[1];
    var $id = el.twitter_data[0];
    console.log('Left: '+el.pos.left)
    var $target = $('<div></div>')
    $target.css('width','auto');
    $target.css('height','auto');
    $target.css('display','none');
    $target.css({'position':'absolute','top':el.pos.top+'px','left':el.pos.left+'px'});
    //Test: https://docs.google.com/presentation/d/13vsbKgIg2bsd21RXIVwcjSFC6Am-vm42Z5XshNAha9I/preview?start=true&loop=false&delayms=3000
    var $widget = $('<a class="twitter-timeline" href="https://twitter.com/hashtag/'+$hash+'" data-widget-id="'+$id+'">#'+$hash+' Tweets</a>'
    +'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script><br />');

    $target.append($widget);
    $('#kanvass').append($target);

    var $cnt=0;
    setTimeout(function(){
      $target.children().each(function(){
        if($cnt==0) {
          $(this).css({'height':el.height-3+'px','width':el.width-3+'px'});
          console.log('changed height');
          $cnt++;
        }
      })
      $target.css('display','block');
    },4000)
}

function backBtn(){
  $('#backBtn').click(function(){
    window.location.href='/login'
  })
}


$(document).ready(function(){
  console.log($view.widgets)
  $('#kan_heading').val($view.kan['headindg']);
  for(i=0;i<$view.widgets.length;i++){
    //var $div =$('<div class="new_div" data-kan-wid="'+$view.widgets[i].wid+'"></div>');
    if($view.widgets[i].type == 'youtube'){
      viewYoutube($view.widgets[i]);
    } else if($view.widgets[i].type == 'vimeo'){
      viewVimeo($view.widgets[i]);
    } else if($view.widgets[i].type == 'image'){
      viewImage($view.widgets[i]);
    } else if($view.widgets[i].type == 'slide'){
      viewSlides($view.widgets[i]);
    } else if($view.widgets[i].type == 'text'){
      	viewText($view.widgets[i]);
		} else if($view.widgets[i].type.indexOf('chart') !== -1){
      	viewChart($view.widgets[i]);
		} else if($view.widgets[i].type.indexOf('twitter') !== -1){
      	viewTwitter($view.widgets[i]);
		}

    backBtn();

  }
})
