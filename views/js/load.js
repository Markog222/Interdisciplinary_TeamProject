function resizeWindow() {
  var $height = $(window).height();
  var $width = $(window).width();
  //Height minus the combined height of header and footer
  var $acHeight = $height-(80+60);
  $('.row.scnd').css('max-height',$acHeight);
  $('.row.scnd').css('min-height',$acHeight)

}

$(document).ready(function(){

  resizeWindow();


  $('#inputBox').keyup((event)=>{
    if(event.key === "Enter"){

      var $el = $('<li></li>');
      $el.addClass('convo');
      $el.text($('#inputBox').val());
      $el.prepend("<span style='font-size:80%;font-weight:bold;color:red;'>Stefan</span><br />")
      $('#conversation').append($el);
      $('#inputBox').val("");
    }
  })


})
