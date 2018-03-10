// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.



var $count = 0;
var $saved = 0;

function drawChart(el) {
		//if($('div[class*=chart_div]').length !== 0) {

		var $e2 = el;

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
        var chart = new google.visualization.PieChart($e2);
        chart.draw(data, options);
				chart.style="border:1px solid black";
				return chart;
	//}
}

function Test(){
	console.log("test");
}

function addNew(type, url){
	console.log(url);
	var $div = $('<div id="new_div">&#43;</div>');
	var $src = url;
	$('#kanvass').append($div);
	$('.addBtn').off();

	$(document).on('mousemove', function(e){
		$('#new_div').css({
		   left:  e.pageX-125,
		   top:   e.pageY-50
		});
	});

	$('#kanvass').click(()=>{
		try{
			$count++;
			var $pos=$('#new_div').position();

			var $new = $('<div class="new_div" data-kan-wid='+$count+'>'
			+'<div id="target2"></div></div>');
			if(type=='youtube') {
				$new = youtube($src,$new);
			} else if (type=='vimeo'){
				$new = vimeo($src,$new);
			} else if (type=='image'){
				$new = picture($src,$new);
			} else if(type=='slide'){
				$new = slide($src,$new);
			} else if(type=='text'){

			} else if(type=='chart'){
				$new=drawChart($new);
			}

			$new.css($pos);
			$new.resizable();
			//$new.resizable({alsoResize:'.new_div iframe'});
			$new.draggable();
			$new.rotatable({wheelRotate:false});
			$new.append("<div id='drag_icon'></div>")
			$new.append("<div id='del_icon'></div>")
			//$new.css('height','auto');
			//$new.css('width','auto');
			$('#kanvass').append($new);
			$('#new_div').remove();
			$('#kanvass').off();
			$(document).off();
			radialBtn();
			delButton();
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
		var $class = $(this).attr('class');
		if($class.indexOf('video') !== -1){

				$('#video_popup').fadeIn();
				$('#vid_back').fadeIn();

				$('#vidYes').click(videoTrigger);

				$('#vidNo').click(function(){
					$('#video_popup').fadeOut();
					$('#vid_back').fadeOut();
				})
		} else if ($class.indexOf('image') !== -1){
			$google_type = 'image';
		} else if ($class.indexOf('slide') !== -1){
			$google_type = 'slide';
		} else if ($class.indexOf('chart') !== -1){
			addNew('chart',null);
		} else if ($class.indexOf('font') !== -1){
			$google_type = 'slide';
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

$(document).ready(()=>{

	//$('#addBtn').click(addNew);
	radialM();
	radialBtn();
	smallMenu();

})
