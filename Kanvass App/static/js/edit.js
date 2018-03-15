function delButton(){

	$('.del_icon').click(function(e){
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

function applySettings(child,parent,el) {
  //target.children(1).attr('src','http://www.google.com');
  console.log(el.pos['top'])
  var $parent = parent;
  $parent.attr('style',el.style);
  console.log(el.style);
  var m = el.style.match(/[(].+[)]/g);
  console.log(m)
  var $child = child;
  $child.css('height','100%');
  $child.css('width','100%');
  $child[0].src = el.link;
  $parent.append($child);


  $parent.append('<div id="target2"></div>');
  $parent.append("<div id='drag_icon'></div>")
  $parent.append("<div class='del_icon'></div>")
  $parent.resizable();
	$parent.draggable();
  $parent.rotatable({wheelRotate:false});
  $parent.css('transform','rotate'+m[0])
  $parent.css({'top':el.pos['top']+'px','left':el.pos['left']+'px','height':el.height+'px','width':el.width+'px'});

  $('#kanvass').append($parent);
}

function viewYoutube(el,dv){
    var $div = dv;
    //console.log($div)
    var $widget = $('<iframe frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
    $div.attr('data-kan-type','youtube');
    console.log($widget);
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
  var $widget = $('<img />')
  $div.attr('data-kan-type','image');
  applySettings($widget,$div,el);
}

function viewSlides(el,dv){
  var $div = dv;
  var $widget = $('<iframe frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');
  $div.attr('data-kan-type','slide');
  applySettings($widget,$div,el);
}

function backBtn(){
  $('#backBtn').click(function(){
    window.location.href='/'
  })
}


$(document).ready(function(){
  console.log($view.widgets)
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
    }

    backBtn();

  }
})
