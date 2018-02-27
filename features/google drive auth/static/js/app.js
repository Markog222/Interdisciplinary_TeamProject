// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.



var $count = 0;

function drawChart() {
		if($('div[class*=chart_div]').length !== 0) {
        // Create the data table.
		var $e1 = document.getElementById('chart_div');
		var $e2 = $('.chart_div')[0];
		console.log($e1);
		console.log($e2);
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
		/*$('div[class*=chart_div]').resizable();
		$('div[class*=chart_div]').draggable();
		$('div[class*=chart_div]').rotatable();*/
	}
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

		$('#kanvass').click(()=>{
			try{
				$count++;
				var $pos=$('#new_div').position();
				var $new = $('<div class="new_div">'
				+'<div id="target2"></div></div>');
				if(type=='video') {
					//Get user input for this
					$new = youtube($src,$new);
				} else if (type=='image'){
					$new = picture($src,$new);
				} else if(type=='slide'){
					$new = slide($src,$new);
				}

				$new.css($pos);
				$new.resizable();
				$new.draggable();
				$new.rotatable();
				$new.append("<div id='drag_icon'></div>");
				$('#kanvass').append($new);
				$('#new_div').remove();
				$('#kanvass').off();
				$(document).off();
				radialBtn();

			} catch(e) {
				console.log(e);
			}

		})

	});

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
				var $tmp_url = "";
				$tmp_url = prompt('Please enter the URL of the video you want to add');
				if($tmp_url !== "") {
					var $urlId = $tmp_url.replace("https://www.youtube.com/watch?v=","");
					addNew('video','https://www.youtube.com/embed/'+$urlId);
				}
		} else if ($class.indexOf('image') !== -1){
			console.log($class);
			$google_type = 'image';
		} else if ($class.indexOf('slide') !== -1){
			$google_type = 'slide';
		}

		$('.circle').toggleClass('open');
	})

}


$(document).ready(()=>{

	//$('#addBtn').click(addNew);
	radialM();
	radialBtn();
})
