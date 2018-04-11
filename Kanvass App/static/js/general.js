var $text_edit = 0;


//rotationInfo function from Stackoverflow to normalize rotated position
//Otherwise the rotated divs would move further to the top with every saved edit
//@reference: https://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery
//@author: Pigalev Pavel from Jan 13 '15 at 19:11; edited Jan 21 '15 at 15:47

$.fn.rotationInfo = function() {
    var el = $(this),
        tr = el.css("-webkit-transform") || el.css("-moz-transform") || el.css("-ms-transform") || el.css("-o-transform") || '',
        info = {rad: 0, deg: 0};
    if (tr = tr.match('matrix\\((.*)\\)')) {
        tr = tr[1].split(',');
        if(typeof tr[0] != 'undefined' && typeof tr[1] != 'undefined') {
            info.rad = Math.atan2(tr[1], tr[0]);
            info.deg = parseFloat((info.rad * 180 / Math.PI).toFixed(1));
        }
    }
    return info;
};

//Assigns function to the menu items on the top left
function smallMenu(){

		$('#backBtn').click(function(){
			window.location.href = '/login';
		})

		$('#saveBtn').click(function(){
			saveAll();
		})
		$('#shareBtn').click(function(){
			share();
		})
}

function doKanvass(type, url) {
  $('#kanvass').off();

try{
  $count++;
  var $pos=$('#new_div').position();
  var $h = $('#new_div').height();
  var $w = $('#new_div').width();
  var $src = url;
  var $new = $('<div class="new_div" data-kan-wid='+$count+'></div>');
  $new.css({'height':$h+'px','width':$w+'px'})
  if(type=='youtube') {
    $new = youtube($src,$new);
    widgetSettings($new, $pos);
  } else if (type=='vimeo'){
    $new = vimeo($src,$new);
    widgetSettings($new, $pos);
  } else if (type=='image'){
    $new = picture($src,$new);
    widgetSettings($new, $pos);
  } else if(type=='slide'){
    $new = slide($src,$new);
    widgetSettings($new, $pos);
  } else if(type=='text'){

      $('#vid_back').fadeIn();
      $('#text_popup').fadeIn();
      textBind();
      $('#textYes').click(function(){
        resetTextPopup();
        $('.text_create').addClass('text_edit').removeClass('text_create');
        $('.text_edit').dblclick(function(e){
            $text_edit=1;
            editText(e);
        });
      });
      $('#textNo').click(function(){
        resetTextPopup();
      })

      $new=text("Please enter some text...",$new);
      widgetSettings($new, $pos)

  } else if(type.indexOf('_chart') > -1){
    var $cc = $('#header_row').prop('checked');
    $('#header_row').prop('checked',true);
    drawChart($new, url, $cc, $pos, type);
  }

  } catch(e) {
    console.log(e);
  }
}


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

function textBtns(){

  $('.font_bold').click(function(e){
    var $sel = window.getSelection();
    console.log($sel)
  })

}

function textBold(e){


    var $select=e.currentTarget.parentNode.childNodes[0]
    console.log(window.getSelection().anchorOffset);
    var $sStart = $select.selectionStart;
    var $sEnd = $select.selectionEnd;
    console.log($sStart)
    if(($sStart+$sEnd) !== 0) {
      var $txt = $select.innerText;
      $select.value = $txt.substr(0, $sStart) + '<b>' + $txt.substr($sStart,$sEnd-$sStart)+ '</b>' + $txt.substr($sEnd, $txt.length-$sEnd);
    }
}

var $textSize=0;


function textSizePl(e){
  $textSize++;
  var $select=e.currentTarget.parentNode.childNodes[0]
  var $sStart = $select.selectionStart;
  var $sEnd = $select.selectionEnd;

  if(($sStart+$sEnd) !== 0) {
    var $txt = $select.value;
    if($textSize==0) {
      $select.value = $txt.substr(0, $sStart) + $txt.substr($sStart,$sEnd-$sStart) + $txt.substr($sEnd, $txt.length-$sEnd);
    } else if($textSize < 0 && $textSize> -7){
      $select.value = $txt.substr(0, $sStart) +'<tm'+Math.abs($textSize)+'>' + $txt.substr($sStart,$sEnd-$sStart)+'</tm'+Math.abs($textSize)+'>' + $txt.substr($sEnd, $txt.length-$sEnd);
    } else if($textSize > 0 && $textSize < 7){

      $select.value = $txt.substr(0, $sStart) +'<tp'+Math.abs($textSize)+'>' + $txt.substr($sStart,$sEnd-$sStart)+'</tp'+Math.abs($textSize)+'>' + $txt.substr($sEnd, $txt.length-$sEnd);
    }


  }


}

function textSizeMin(e){

}

function textConf(e){
  //For the tickbox
        var $text=$('.text_create');
        $text.parent().draggable( 'disable' );
        $('.font_conf').replaceWith('<div class="font_edit"></div>');
        $('.font_edit').parent().append('<div class="font_bold"></div>');
        $('.font_edit').parent().append('<div class="font_type"></div>')
        var $text_edit=$('<div class="text_edit"></div>');
        $text_edit.attr('style',$text.attr('style'));
        if($text.val()==""){
          $text_edit.text("Please enter some text...");
        } else {
          $text_edit.text($text.val());
        }
        $text_edit.css({'margin-bottom':'6px','padding':'2px'});
        $text_edit.attr('contentEditable',true)
        $text.replaceWith($text_edit);

}

function rotateBtn(){
  $('.ui-rotatable-handle.ui-draggable').mousedown(function(e){
    console.log('height: '+$(this).parent().height()+'; width:'+$(this).parent().width())
    console.log((getComputedStyle($(this).parent()[0]).width));
  })
}

var $shared = null;

function removeShared(e){
  e.preventDefault();
  var $el = $(e.currentTarget.parentNode);
  $el.remove();
  if($('#shared_with').text()==''){
    $('#shared_with').hide();
  }
}

function getUsers(){
  $.ajax({
      'url':'/sharePPL',
      'type':'GET',
      success:function(res){
        var d=JSON.parse(res);
        var $source = [];
        for(i=0;i<d.source.length;i++){
          var $d={}
          $d.value = d.source[i].id;
          $d.label = d.source[i].f;
          $source.push($d);
        }

        //$('#share_with').autocomplete({'source':['jQuery','JavaScript','Node.js']});
        $('#share_with').autocomplete({'source':$source, 'select': function (event, ui) {
            var label = ui.item.label;
            var value = ui.item.value;
           //store in session
          //document.valueSelectedForAutocomplete = value;
          $('#shared_with').show();

          var $item = $('<span class="shared_lbl" value='+value+'>'+label+' <button class="shared_delete" onclick="removeShared(event)">x</button></span>')
          $('#shared_with').append($item);
          event.preventDefault();
          $('#share_with').val('')
          console.log(value)
          console.log(label)

        }});
      },
      failure:function(err){
        console.log(err)
      }
    })




}

function share(){

  getUsers();

  $('#share_popup').fadeIn();
  $('#vid_back').fadeIn();
  //settingsPopFunctionality();
  $('#shareYes').click(function(){

  });
  $('#shareNo').click(function(){
    $('#shared_with').html('').hide();
    $('#share_popup').hide();
    $('#vid_back').hide();
    //resetVideoPopup();
  })
}
