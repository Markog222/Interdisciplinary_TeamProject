function applySettings(target,el) {
  console.log(el)
  console.log(el.link)
  target.prop('src', el.link);
  target.attr('style', el.style);
  target.css('position', 'absolute');
  target.position(el.pos)
  target.css('height', el.height+'px');
  target.css('width', el.width+'px');

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

function backBtn(){
  $('#backBtn').click(function(){
    window.location.href='/'
  })
}


$(document).ready(function(){
  console.log($view.widgets)
  for(i=0;i<$view.widgets.length;i++){
    if($view.widgets[i].type == 'youtube'){
      viewYoutube($view.widgets[i]);
    } else if($view.widgets[i].type == 'vimeo'){
      viewVimeo($view.widgets[i]);
    } else if($view.widgets[i].type == 'image'){
      viewImage($view.widgets[i]);
    } else if($view.widgets[i].type == 'slide'){
      viewSlides($view.widgets[i]);
    }

    backBtn();

  }
})
