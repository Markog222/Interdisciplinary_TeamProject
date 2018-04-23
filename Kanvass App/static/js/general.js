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
  console.log(url)
try{
    $count++;
    var $pos=$('#new_div').position();
    var $h = $('#new_div').height();
    var $w = $('#new_div').width();
    var $src = url;
    console.log($src)
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

        textPopFunctionality();
        $new=text("Please enter some text...",$new);
        widgetSettings($new, $pos)

    } else if(type.indexOf('_chart') != -1){

        var $cc = $('#header_row').prop('checked');
        $('#header_row').prop('checked',true);
        drawChart($new, url, $cc, $pos, type);

    } else if(type == 'twitter_widget'){

        $new =  twitter($src[0], $src[1], $new);
        widgetSettings($new, $pos);

    } else if(type == 'twitter_post'){

      var $i = $('<iframe src="https://twitter.com/EmerHigginsCllr/status/988077743169556481" width="400px" height="500px" frameborder="1"></iframe>');
      $('#kanvass').append($i);
      widgetSettings($new, $pos);

    }

  } catch(e) {
    console.log(e);
  }
}

function resizeButton(){

	$('.resize_icon').click(function(e){
    console.log('hey')
		e.preventDefault();
		var $par = $(e.currentTarget.parentNode);
    console.log($par)
    var $type = $par.attr('data-kan-type');
    if($type.indexOf('chart') > -1){
      var $ct=0;
      $par.children().each(function(){
        //console.log($(this))
        if($ct==1){
          console.log('resize')

          resizeFunctionality($(this),$(this).height(), $(this).width())
        }
        $ct++;
      })
    } else if($type.indexOf('twitter') > -1){
        console.log($par.children()[0])
        resizeFunctionality($($par.children()[0]),$par.height()-3, $par.width()-3)
    } else {
      console.log("yeeeeeasdasd")
      resizeFunctionality($($par.children()[0]),$par.height(), $par.width())
    }
  });
}




function delButton(){

	$('.del_icon').click(function(e){
		e.preventDefault();
		var $par = e.currentTarget.parentNode;
    var $p =/(?!.*[=])([0-9])/g
		//var $kid=window.location.href.replace("http://localhost:5000/create?id=","");
    var $kid = window.location.href.match($p,"")[0];
		var $wid=$par.getAttribute('data-kan-wid');
		$par.remove();

		var $data = {
			"delWidget":[]
		};

		$data.delWidget.push({
			"kid":$kid,
			"wid":$wid
		});
    console.log($data.delWidget);

		if($saved == 1){
			$.ajax({
				type:"POST",
				url:"/delWidget",
				data:JSON.stringify($data),
				contentType:"application/javascript",
        failure:function(err){
          console.log(err)
        }
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
  var $p =/(?!.*[=])([0-9])/g
  var $kid = window.location.href.match($p,"")[0];
  var $unshareid=$el.attr('data-kan-value');
  var data = {'kid':$kid,'unshareid':$unshareid};
  $el.remove();
  if($('#shared_with').text()==''){
    $('#shared_with').hide();
  }

  $.ajax({
    'url':'/unshare',
    'type':'POST',
    'contentType':'application/json',
    'data':JSON.stringify(data),
    success:function(res){
      console.log(res);
    }
  })

}

function getUsers(){
  var $p =/(?!.*[=])([0-9])/g
  var $kid = window.location.href.match($p,"")[0];
  $('#shared_with').html('');
  $.ajax({
      'url':'/sharePPL',
      'type':'POST',
      'contentType':'application/json',
      'data':$kid,
      success:function(res){
        var d=JSON.parse(res);
        var $source = [];
        for(i=0;i<d.source.length;i++){
          var $d={}
          $d.value = d.source[i].id;
          $d.label = d.source[i].f;
          $source.push($d);
        }
        var $sharedwith=d.sharedwith;

        for(j=0;j<$sharedwith.length;j++){
          var $el=$('<span class="btn btn-primary" style="padding:3px;margin-left:2px;margin-bottom:2px;" data-kan-value='+$sharedwith[j].id+'>'
          +$sharedwith[j].f+' <span class=badge onclick="removeShared(event)">x</badge> </span>')
          $('#shared_with').append($el);
        }
        if($sharedwith.length > 0){
          $('#shared_with').show();
        }

        //Adding user names to autocomplete
        function autoComplete(src){
          $('#share_with').autocomplete({'source':src,
            'select': function (event, ui) {
                var label = ui.item.label;
                var value = ui.item.value;

                $('#shared_with').show();
                var $item = $('<span class="btn btn-primary" style="padding:3px;margin-left:2px;margin-bottom:2px;" data-kan-value='+value+'>'+label+' <span class=badge onclick="removeShared(event)">x</badge> </span>')

                $('#shared_with').append($item);
                event.preventDefault();
                $('#share_with').val('');
                var $tmp_source=[];
                for(i=src.length-1;i>=0;i--){
                    if(src[i].value !== ui.item.value){
                        $tmp_source.push(src[i]);
                    }
                }
                $('#share_with').autocomplete('destroy');
                autoComplete($tmp_source);
            }
          });
        }
        autoComplete($source);
      },
      failure:function(err){
        console.log(err)
      }
    })

}

function share(){

  var $sharedPPL = [];
  getUsers();
  $('#share_popup').fadeIn();
  $('#vid_back').fadeIn();
  //settingsPopFunctionality();
  $('#shareYes').click(function(){
    $('#shareYes').off();
      var $child = $('#shared_with').children();
      $child.each(function(){
          $sharedPPL.push(Number($(this).attr('data-kan-value')));
      })

      var $p =/(?!.*[=])([0-9])/g
      var $kid = window.location.href.match($p,"")[0];
      var $data = JSON.stringify({"kid":$kid,"data":$sharedPPL});

      $.ajax({
        url:'/share',
        type:'POST',
        data:$data,
				contentType:"application/javascript",
        success:function(res){
            showErr("#error_out_share","Shared successfully.","green");

        },
        failure:function(err){
            showErr("#error_out_share","An unexpected error occurred! Your Kanvass could not be shared. Please reload the page and contact customer support if the issue persists.","red");
        }
      });

  })
    $('#shareNo').click(function(){
      $('#shareYes').off();
      $('#share_with').val('');
      $('#error_out_share').hide();
      $('#shared_with').hide();
      $('#share_popup').hide();
      $('#vid_back').hide();
      //resetVideoPopup();
    })
}
