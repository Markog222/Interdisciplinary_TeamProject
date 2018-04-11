var $data_loaded=0;
var $chart_data;

function videoTrigger(){
	var $vidSrc = $('input[name="vid_source_type"]');
	var $src_original=$('#video_url').val();
	console.log($vidSrc[0].checked+" "+$vidSrc[1].checked+" "+$vidSrc[2].checked);

	if(($vidSrc[0].checked || $vidSrc[1].checked) && $src_original==""){
		showErr('#error_out','Please enter a URL.','red');
	} else if($vidSrc[0].checked) {
		console.log("youtube")
		//For testing: addNew('youtube','https://www.youtube.com/embed/ic03Af0oWo0');
		var $src = $src_original.replace("https://www.youtube.com/watch?v=","https://www.youtube.com/embed/");
		//Add url validation
		addNew('youtube',$src);
		resetVideoPopup();
	} else if($vidSrc[1].checked){
		//For testing: addNew('vimeo','https://player.vimeo.com/video/247068452');
		//https://vimeo.com/channels/staffpicks/258693816
		var $src = $src_original.replace("https://vimeo.com/","https://player.vimeo.com/video/");
		//Add url validation
		addNew('youtube',$src);
		resetVideoPopup()
	} else {
		$('#vidYes').off();
		showErr('#error_out','This feature is currently not available yet.','yellow');
	}

}

function settingsTrigger(){
	var $color=$('#background_colorpicker').val();
	$('body').css('background',$color);
	resetSettings();
}

function deleteKanvass(){
	var $k_id =window.location.href.replace("http://localhost:5000/create?id=","").replace('http://localhost:5000/edit?k=','').replace('#','');

	if(confirm('Are you sure?') == true){
		$.ajax({
			type:"POST",
			url:"/delKanvass",
			data:$k_id,
			contentType:"application/javascript"
		}).done(function(res){
			if(Number(res) > 0){
				window.location.href='/login';
			} else {
				console.log("An error occurred.");
			}
		})
	} else {
		console.log('cancelled')
	}


}

function videoPopFunctionality(){

  $('#video_dropdown').change(function(){
    $('#error_out').hide();
    // @reference: https://stackoverflow.com/questions/10659097/jquery-get-selected-option-from-dropdown
    var $vid_select = $(this).find(":selected").text();
    console.log($vid_select);
    $('#src_'+$vid_select.toLowerCase().replace(" ","_")).prop('checked',true);

    if($vid_select !== 'Google Drive'){
      $('#video_url_div').css('display','block');
    } else {
      $('#video_url_div').css('display','none ');
    }

    //console.log($el.innerText);

  })

}

function settingsPopFunctionality(){
  $('#background_dropdown').change(function(){
    $(this).val()
    var $back=$('#background_colorpicker');
    if($(this).val()=='Color'){
      $back.show();
      $('#background_imglinkpicker').hide();
      $('#background_imggdrivepicker').hide();
      //$back.css({'display':'inline-block','width':'18%','border':'1px solid gray'});
    } else if($(this).val()=='Image'){
      $('#background_imglinkpicker').show();
      $('#background_imggdrivepicker').show();
      $back.hide();
    }
  })
  $('#background_colorpicker').change(function(){
    console.log($(this).val());
  })
}



function resetVideoPopup(){
  $('#video_url').val("");
  $('#vidYes').off();
  $('#video_popup').hide();
  $('#vid_back').hide();
  $('#error_out').hide();
  $('#vid_default').prop('selected',true);
  $('#video_url_div').hide();
}

function resetSettings(){
  $('#setYes').off();
	$('#settings_popup').hide();
	$('#vid_back').hide();
  $('#error_out').hide();
  $('#back_default_setting').prop('selected',true);
}

function showErr(div,text,color){
  var $color;
  switch(color){
    case 'red':
      $color ='alert alert-danger'
      break;
    case 'yellow':
      $color ='alert alert-warning'
      break;
    case 'blue':
      $color ='alert alert-info'
      break;
    case 'green':
      $color ='alert alert-success'
      break;
    default:
      $color ='alert alert-danger'
      break;
  }

  $(div).attr('class',$color);
  $(div).css({'margin-bottom':'0px','margin-top':'5px','padding':'5px'})
  $(div).html(text);
  $(div).show();
}

function chartPopFunctionality(){
  $('input[type="file"]').change(function(){
    var $file=document.getElementById('upload_chartpickerBtn').files[0];
    console.log("File: "+$file);
    var $fr=new FileReader();
    $fr.readAsText($file)
    $fr.onload = function(d){
			$chart_data = []
      var $temp=d.currentTarget.result.split('\n');
			console.log($temp[0].toString().split(','))
			for(i=0;i<$temp.length;i++){
				if(i == 0) {
					$chart_data.push($temp[i].split(','));
				} else if($temp[i].toString() != "") {
					$chart_data.push([$temp[i].split(',')[0],Number($temp[i].split(',')[1])]);
				}
			}
			$data_loaded=1;
    }

  })
}

function chartTrigger(){
	if($chart_data == undefined){
		showErr("#error_out_chart","Please select a data file.","red");
	} else {
		var $ctype=$('#chart_type_dropdown').val();
		resetChartPopup();
		console.log($ctype.replace("\s","").toLowerCase())
		addNew($ctype,$chart_data);
	}
}

function resetChartPopup(){
	$('#chartYes').off();
	$('#chart_popup').hide();
	$('#vid_back').hide();
  $('#error_out_chart').hide();
	$('#upload_chartpickerBtn').val("");
}

function editText(e){
	//console.log(e)
	$('#text_popup').fadeIn();
	$('#vid_back').fadeIn();
	textBind(e);
	$('#textYes').click(function(){
		resetTextPopup();
		$('.text_create').addClass('text_edit').removeClass('text_create');
		$('.text_edit').dblclick(function(e){
				$text_edit=1;
				editText(e);
		});
	});
	$('#textNo').off();
	$('#textNo').click(function(){
		resetTextPopup();
		$('.text_create').addClass('text_edit').removeClass('text_create');
		//$('.text_create').parent().remove();
	})
}

function textBind(e){
	//console.log(e)
	if(e == undefined) {
		console.log(0)
	} else {
		//@reference: https://www.w3schools.com/howto/howto_js_add_class.asp
		//@reference: https://www.w3schools.com/howto/howto_js_remove_class.asp
		console.log(e.currentTarget.classList);
		e.currentTarget.classList.add('text_create');
		e.currentTarget.classList.remove('text_edit');
		$('#text_popup_input').val(e.currentTarget.innerText);
		var $fSize = e.currentTarget.style.fontSize == '' ? 10 : e.currentTarget.style.fontSize.replace('px','');
		var $fWeight  = e.currentTarget.style.fontWeight == '' ? 'Normal' : e.currentTarget.style.fontWeight;
		var $fFamily  = e.currentTarget.style.fontFamily == '' ? 'Helvetica' : e.currentTarget.style.fontFamily;
		var $fDecorationLine  = e.currentTarget.style.textDecorationLine == '' ? 'None' : e.currentTarget.style.textDecorationLine;
		var $fColor  = e.currentTarget.style.color == '' ? '#000000' : e.currentTarget.style.color;
		var $fBackColor  = e.currentTarget.style.backgroundColor == '' ? '#FFFFFF' : e.currentTarget.style.backgroundColor;

		$('#fontsize').val($fSize);
		$('#font_family_dropdown').val($fFamily);
		$('#font_weight_dropdown').val($fWeight);
		$('#font_style_dropdown').val($fDecorationLine);
		$('#font_color_picker').val($fColor);
		$('#back_color_picker').val($fBackColor);
	}
		$('#text_popup').draggable();
		//console.log(e.currentTarget.innerText);
		$('#text_popup_input').keyup(function() {

			$('.text_create').text($(this).val());
		});

		$('#font_family_dropdown').change(function(){
			$('.text_create').css('font-family',$(this).val());
		})

		//For input type=slider the event to trigger without releasing is oninput
		// @reference: https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging
		$('#fontsize').on('input',function(){
			$('.text_create').css('font-size',$(this).val()+'px');
		})
		$('#font_color_picker').on('input',function(){
			$('.text_create').css('color',$(this).val());
		})
		$('#back_color_picker').on('input',function(){
			$('.text_create').css('background',$(this).val());
		})

		$('#font_weight_dropdown').change(function(){
			$('.text_create').css('font-weight',$(this).val());
		})

		$('#font_style_dropdown').change(function(){
			$('.text_create').css('text-decoration',$(this).val());
		})
		$('.text_create').parent().css({'width':'auto','height':'auto'})

		//e.currentTarget.classList.add('text_edit');
		//e.currentTarget.classList.remove('text_create');
}


function resetTextPopup(){
	$('#textYes').off();
	$('#text_popup').hide();
	$('#vid_back').hide();
  $('#error_out_text').hide();

	$('#text_popup').css({'margin-top':'-150px','top':'40%','left':'40%'})
	$('.text_create').parent().css({'height':'auto','width':'auto'});
	$('#text_popup_input').val("");

	$('#fontsize').val(10);
	$('#font_family_dropdown').val("Helvetica");
	$('#font_weight_dropdown').val("Normal");
	$('#font_style_dropdown').val("None");
	$('#font_color_picker').val("#000000");
	$('#back_color_picker').val("#FFFFFF");
}
