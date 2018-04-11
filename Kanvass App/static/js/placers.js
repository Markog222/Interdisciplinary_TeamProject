function dragPlacer(type, url){
	$('body').mousedown(function(e) {
		var $x = e.pageX;
		var $y =e.pageY;
		dragStart=true;
    isDragging = false;
		dCount=0;
		$div = $('<div id="new_div" style="position:absolute;top:'+$y+'px; left:'+$x+'px" ></div>');
		$('#kanvass').append($div);

	})
	.mousemove(function(e) {
		console.log(dCount)
			var $x = 1;
			var $y = 1;
			if(dragStart==true){
				isDragging = true;
				if(dCount==0){
					$div.css('border','1px solid black');
					lastX=e.pageX;
					lastY=e.pageY;
					dCount++;
				} else {
				 	$x += e.pageX-lastX;
					$y += e.pageY-lastY;
					$('#new_div').css({'height':$y+'px','width': $x+'px'})
				}
			} else {
				isDragging = false;
			}
	 })
	.mouseup(function() {
			dragStart=false
			dCount=0;
	    var wasDragging = isDragging;
	    isDragging = false;
	    if (!wasDragging) {
	        $("#throbble").toggle();
	    } else{
				doKanvass(type,url)
			}
	});
}

function fixedPlacer(type, url){

	var $div = $('<div id="new_div">&#43;</div>');
	/*if(type == 'text') {
			$div.css({'height':'100px','width':'100px','line-height':'50px','z-index':'9999','margin-top':'110px','margin-left':'110px'})
	}*/
  $div.css($start_pos);
  var $src = url;
  $('#kanvass').append($div);
  $('.addBtn').off();

  $(document).on('mousemove', function(e){
    $('#new_div').css({
       left:  e.pageX-200,
       top:   e.pageY-150
    });
  });

  $('#kanvass').click(()=>{
    doKanvass(type,url);
  })

}
