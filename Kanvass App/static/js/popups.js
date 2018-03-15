function videoTrigger(){
	var $vidSrc = $('input[name="vid_source_type"]');
	var $src_original=$('#video_url').val();
	console.log($vidSrc[0].checked+" "+$vidSrc[1].checked+" "+$vidSrc[2].checked);

	if(($vidSrc[0].checked || $vidSrc[1].checked) && $src_original==""){
		showErr('Please enter a URL.','red');
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
		showErr('This feature is currently not available yet.','yellow');
	}

}

function settingsTrigger(){
	var $color=$('#background_colorpicker').val();
	$('body').css('background',$color);
	resetSettings();
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

function showErr(text,color){
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

  $('#error_out').attr('class',$color);
  $('#error_out').css({'margin-bottom':'0px','margin-top':'5px','padding':'5px'})
  $('#error_out').html(text);
  $('#error_out').show();
}

function chartPopFunctionality(){
  $('input[type="file"]').change(function(){
    var $file=document.getElementById('upload_chartpickerBtn').files[0];
    console.log($file);
    var $fr=new FileReader();
    $fr.readAsText($file)
    $fr.onload = function(d){
      var dj=d.currentTarget.result.split('\n');
      
      console.log(dj)
    }
  })
}

function chartTrigger(){

}

function resetChartPopup(){


}
