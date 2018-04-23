function applySettings(child,parent,el) {
  //target.children(1).attr('src','http://www.google.com');
//  console.log(el.pos['top'])
  var $parent = parent;
  $parent.attr('style',el.style);
//  console.log(el.style);
  var m = el.style.match(/[(].+[)]/g);
//  console.log(m)
  var $child = child;

  if($parent.attr('data-kan-type').indexOf('twitter') !== -1){
      console.log('child height: '+$child.css('height'))
  }

  $child.css('height','100%');
  $child.css('width','100%');
	//if()
//	console.log($parent);
	if($parent.attr('data-kan-type')=='text'){
		$child.attr('style',el.textstyle)
		$child[0].innerText = el.link;
	} else if($parent.attr('data-kan-type').indexOf('twitter') !== -1){
      $parent.css('display','none');
  } else {
		$child[0].src = el.link;
	}
	// console.log($child);
  $parent.append($child);


  $parent.append('<div id="target2"></div>');
  $parent.append("<div id='drag_icon'></div>")
  $parent.append("<div class='del_icon'></div>")

  //$parent.resizable();
	$parent.draggable();
  $parent.rotatable({wheelRotate:false});
  $parent.append("<div class='resize_icon'></div>")
  $parent.css('transform','rotate'+m[0]);
  $parent.css({'top':el.pos['top']+'px','left':el.pos['left']+'px','height':el.height+'px','width':el.width+'px'});

  $('#kanvass').append($parent);
	$('.text_edit').dblclick(function(e){
//		console.log(e)
		editText(e)
	})
  var $cnt=0;
  setTimeout(function(){
    $parent.children().each(function(){
      if($cnt==0) {
        $(this).css({'height':el.height-3+'px','width':el.width-3+'px'});
        console.log('changed height');
        $cnt++;
      }
    })
    $parent.css('display','block');
    resizeButton();
  },4000)
}

function viewYoutube(el,dv){
    var $div = dv;
    //console.log($div)
    var $widget = $('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
    $div.attr('data-kan-type','youtube');
//    console.log($widget);
    applySettings($widget,$div,el);

}

function viewVimeo(el,dv){
  var $div = dv;
  var $widget = $('<iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
  $div.attr('data-kan-type','vimeo');
  applySettings($widget,$div,el);
}

function viewImage(el,dv){
  var $div = dv;
  var $widget = $('<img style="width:100%;height:100%;" />')
  $div.attr('data-kan-type','image');
  applySettings($widget,$div,el);
}

function viewSlides(el,dv){
  var $div = dv;
  var $widget = $('<iframe frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');
  $div.attr('data-kan-type','slide');
  applySettings($widget,$div,el);
}

function viewText(el,dv){
  var $div = dv;
  var $widget = $('<div class="text_edit"></div>');
  $div.attr('data-kan-type','text');
  applySettings($widget,$div,el);
}

function viewChart(el,dv){
  redrawChart(dv,el.chart_data,el.pos,el.type,el.style, el.height, el.width);
}

function viewTwitter(el,dv){
  var $div = dv;
  $div.css({'height':el.height+'px','width':el.width+'px'})
  var $id = el.twitter_data[0];
  var $hash = el.twitter_data[1];

  var $widget = $('<a class="twitter-timeline" href="https://twitter.com/hashtag/'+$hash+'" data-widget-id="'+$id+'">#'+$hash+' Tweets</a>'
  +'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script><br />');
  $div.attr('data-kan-type',el.type);
  $div.attr('data-twitter-id',$id);
  $div.attr('data-twitter-hashtag',$hash);
  applySettings($widget,$div,el);
}

function backBtn(){
  $('#backBtn').click(function(){
    window.location.href='/login'
  })
}


$(document).ready(function(){
	console.log('Kanvass Data')
  console.log($view.kan['heading'])

	$('#kan_heading').val($view.kan['heading']);
	$saved=1;
  for(i=0;i<$view.widgets.length;i++){
    var $div =$('<div class="new_div" data-kan-wid="'+$view.widgets[i].wid+'"></div>');
    if($view.widgets[i].type == 'youtube'){
      viewYoutube($view.widgets[i],$div);
    } else if($view.widgets[i].type == 'vimeo'){
      viewVimeo($view.widgets[i],$div);
    } else if($view.widgets[i].type == 'image'){
      viewImage($view.widgets[i],$div);
    } else if($view.widgets[i].type == 'slide'){
      viewSlides($view.widgets[i],$div);
    } else if($view.widgets[i].type == 'text'){
			viewText($view.widgets[i],$div);
		} else if($view.widgets[i].type.indexOf('chart') !== -1){
      viewChart($view.widgets[i],$div);
    } else if($view.widgets[i].type.indexOf('twitter') !== -1){
      viewTwitter($view.widgets[i],$div);
    }

  }
	backBtn();
	delButton();
	rotateBtn();
	getUsers();
})
