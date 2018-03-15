// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
var $start_pos;
// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

function widgetSettings(el,pos){

	var $new = $(el);
	console.log("Position: "+$pos)
	var $pos = pos;

	$new.css($pos);
	$new.resizable();
	//$new.resizable({alsoResize:'.new_div iframe'});
	$new.draggable();
	$new.rotatable({wheelRotate:false});
	$new.append("<div id='drag_icon'></div>")
	$new.append("<div class='del_icon'></div>")
	//$new.css('height','auto');
	//$new.css('width','auto');
	$('#kanvass').append($new);
	$('#new_div').remove();
	$('#kanvass').off();
	$(document).off();
	radialBtn();
	delButton();

}

var $saved = 0;

function drawChart(el, pos) {
		var $target =el;
	  var $new_chart=$('<div id="tmp_chart" style="display:none;"></div>')
		$('#kanvass').append($new_chart);

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night','max-width':150,'max-height':100};

        // Instantiate and draw our chart, passing in some options.
				var $tmp=$('#tmp_chart');
				console.log($tmp);
        var $chart = new google.visualization.PieChart($tmp[0]);
				$chart.draw(data, options);
				$chart.style="height:100%;width:100%";

				$target.append($('#tmp_chart').removeAttr('id').css('display','block'))
				$('#tmp_chart').remove();

				$target.css($('#new_div').position())
				$target.attr('data-kan-type','chart');
				$target.attr('data-kan-wid',$count);
				widgetSettings($target, $('#new_div').position());
}

function Test(){
	console.log("test");
}

function addNew(type, url){
	console.log(url);
	var $div = $('<div id="new_div">&#43;</div>');
	$div.css($start_pos);
	var $src = url;
	$('#kanvass').append($div);
	$('.addBtn').off();

	$(document).on('mousemove', function(e){
		$('#new_div').css({
		   left:  e.pageX-200,
		   top:   e.pageY-150
		});
		console.log($('#new_div').position())
	});

	$('#kanvass').click(()=>{
		console.log("click Kanvas")
		try{
			$count++;
			var $pos=$('#new_div').position();

			var $new = $('<div class="new_div" data-kan-wid='+$count+'></div>');
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

			} else if(type=='chart'){
				//$new.css($pos);
				//$new=$('#kanvass').append($new);
				drawChart($new, $pos);
			}

		} catch(e) {
			console.log(e);
		}
	})
}

/*
 * @reference: http://creative-punch.net/2014/02/making-animated-radial-menu-css3-javascript/
 */

function radialM(){
	/*
	 * @reference: http://creative-punch.net/2014/02/making-animated-radial-menu-css3-javascript/
	 */

	$('.menu-button.fas.fa-plus.fa-2x').click(function(e) {
			   e.preventDefault();
			   $('.circle').toggleClass('open');
				var items = document.querySelectorAll('.circle a');

				for(var i = 0, l = items.length; i < l; i++) {
				  items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
				  items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
				}

			})


}

function radialBtn(){

	$('.addBtn').click(function(e){
		e.preventDefault();
		$start_pos={
		   left:  e.pageX-200,
		   top:   e.pageY-150
		}

		var $class = $(this).attr('class');
		if($class.indexOf('video') !== -1){

				$('#video_popup').fadeIn();
				$('#vid_back').fadeIn();
				videoPopFunctionality();
				$('#vidYes').click(videoTrigger);
				$('#vidNo').click(function(){
					resetVideoPopup();
				})
		} else if ($class.indexOf('image') !== -1){
			$google_type = 'image';
		} else if ($class.indexOf('slide') !== -1){
			$google_type = 'slide';
		} else if ($class.indexOf('chart') !== -1){
			$('#chart_popup').fadeIn();
			$('#vid_back').fadeIn();
			chartPopFunctionality();
			$('#chartYes').click(chartTrigger);
			$('#chartNo').click(function(){
				resetChartPopup();
			})
			//addNew('chart',null);
		} else if ($class.indexOf('font') !== -1){
			//$google_type = 'slide';
		}
		$('.circle').toggleClass('open');
	})

}

function smallMenu(){

		$('#backBtn').click(function(){
			window.location.href = '/';
		})

		$('#saveBtn').click(function(){
			saveAll();
		})

}

function heading(){
	$('#kan_heading').focus(function(){
		$(this).on('keyup',function(e){
			if(e.key == 'Enter'){
				$(this).blur();
			}
		})
	})

}

function settings(){
	$('#settingsBtn').click(function(){
		$('#settings_popup').fadeIn();
		$('#vid_back').fadeIn();
		settingsPopFunctionality();
		$('#setYes').click(settingsTrigger);
		$('#setNo').click(function(){
			$('#settings_popup').hide();
			$('#vid_back').hide();
			//resetVideoPopup();
		})
	})
}

$(document).ready(()=>{

	//$('#addBtn').click(addNew);
	radialM();
	radialBtn();
	smallMenu();
	heading();
	settings();
})
