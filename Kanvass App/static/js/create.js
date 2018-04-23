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
	console.log($new.attr('data-kan-type'))
	var $pos = pos;

	$new.css($pos);
	if($new.attr('data-kan-type').indexOf('twitter') !== -1 && $new.attr('data-kan-type') !== 'chart'){
		$new.resizable();
	}
	$new.draggable();
	$new.rotatable({wheelRotate:false});

	$new.append("<div id='drag_icon'></div>");
	$new.append("<div class='del_icon'></div>");
	//if($new.attr('data-kan-type').indexOf('twitter') !== -1 || $new.attr('data-kan-type') == 'chart'){
	$new.append("<div class='resize_icon'></div>");
	//}
	$('#kanvass').append($new);
	var $ct=0;
	console.log("DataKanType: "+$new.attr('data-kan-type'))
	if($new.attr('data-kan-type').indexOf('twitter') !== -1) {
		console.log('setTimeout')
			setTimeout(function(){
					//console.log("starttimeout")
					//console.log($new.children())
					//console.log($new.children().children())
					//$new.css({'min-width':'252px'})
					$new.css('min-width','');
					$new.children().each(function(){
						//console.log($(this))
							if($ct == 0){
									//console.log($(this));
									$(this).css({'height':'350px','width':'250px'})
									$ct=1;
									//console.log('changed size')
							}
					})
					resizeButton();
			},3000)
	}

	$('#new_div').remove();
	$('body').off();
	$('body').css('cursor','default');
	menuActions();
	delButton();
	resizeButton();
}

var $saved = 0;
var isDragging,dragStart,dCount=0;
var lastX, lastY;
var $div;
$('body').css('cursor','crosshair');

function addNew(type, url){
		fixedPlacer(type, url);
}

function radialM(){
	//moving the div overlay over the menu button
	$('#m_icon').css({'margin-left':'-38px','cursor':'pointer'});

	//Because the radial menu is so big and needs to be in the foreground when adding new widgets
	//It was ultimately on top of every element between top 0px and 350px
	//In order to fix it we added an invisible div overlay at the point where the menu button is
	//which pushes the circular-menu div in the front when mouseover
	//And pushes it back to the back when mousout and circular menu is not open
	$('#m_icon').mouseover(function(){

		$('.circular-menu').css({'position':'relative','z-index':9999});
		console.log($('.circular-menu'))
	}).mouseout(function(){
		if(!$('.circle').hasClass('open')){
			$('.circular-menu').css('z-index',0);
		}
		//$('.circular-menu').css('z-index',0);
	})
	/*
	 * @reference: http://creative-punch.net/2014/02/making-animated-radial-menu-css3-javascript/
	 */
	//$('.menu-button.fas.fa-plus.fa-2x').click(function(e) {
	$('#m_icon').click(function(e){
			   e.preventDefault();
				 if($('.circle').hasClass('open')){
					 $('.circular-menu').css({'position':'relative','z-index':0});
				 } else {
					 $('.circular-menu').css({'position':'relative','z-index':9999});
				 }

				 $('.circle').toggleClass('open');

				var items = document.querySelectorAll('.circle a');
				for(var i = 0, l = items.length; i < l; i++) {
				  items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
				  items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
				}
			});
}

//Adding functionality to the radial button menu
function menuActions(){

	$('.addBtn').click(function(e){
		//Prevent Default otherwise clicking the addBtn will reload the page
		e.preventDefault();
		//Set the starting position of your new widget div where your mouse is at the moment
		//To allow for a smoother transition. Otherwise the div will appear at the top of the screen and
		//Then abruptly jump to where your mouse is at.
		$start_pos={
		   left:  e.pageX-200,
		   top:   e.pageY-150
		}

		//Getting the class from the clicked button to get the type of widget to be added
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
			$('#image_popup').fadeIn();
			$('#vid_back').fadeIn();
			imagePopFunctionality();

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
			addNew('text','text');
		} else if($class.indexOf('twitter') !== -1){
			twitterPopFunctionality();
			//addNew('twitter',null);
		}


		$('.circle').toggleClass('open');
		$('.circular-menu').css('z-index',1);
		$('.menu-button.fas.fa-plus.fa-2x').css('z-index',9999);
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
		$('#setDel').click(deleteKanvass);
		$('#setNo').click(function(){
			$('#settings_popup').hide();
			$('#vid_back').hide();
			//resetVideoPopup();
		})
	})
}

$(document).ready(()=>{

	//Function for the radial Menu button
	radialM();
	//Function for the individual radial Menu buttons
	menuActions();
	//Function to add functionality
	smallMenu();
	//Function to add functionality
	heading();
  //Function to add functionality
	settings();

	rotateBtn();

})
