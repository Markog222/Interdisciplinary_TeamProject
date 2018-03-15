function saveAll(){

    var $k_id =window.location.href.replace("http://localhost:5000/create?id=","").replace('http://localhost:5000/edit?k=','').replace('#','');
    var $widgets=$('.new_div');
    var $heading = $('#kan_heading').val();
    console.log($heading =='');

    var $data = {
      "widgets":[]
    };

    $widgets.each(function(){
      var $tmp = {};
      var $type = $(this).attr('data-kan-type');
      var $w_id = $(this).attr('data-kan-wid');
      var $height = $(this).height();
      var $width = $(this).width();
      var $pos = $(this).position();
      var $style = $(this).attr('style');
      var $children = $(this).children()
      if(window.fullscreen){
        var $res = {"viewHeight":screen.availHeight, "viewWidth":screen.availWidth}
      } else {
        var $res = {"viewHeight":$(window).height(), "viewWidth":$(window).width()}
      }

      $tmp.kid = $k_id;
      $tmp.wid = $w_id;
      $tmp.heading = $heading;
      $tmp.type = $type;
      $tmp.height = $height;
      $tmp.width = $width;
      $tmp.pos = $pos;
      $tmp.style = $style;
      $tmp.viewSize = $res;

      /*
       * @reference: https://stackoverflow.com/questions/3044230/difference-between-screen-availheight-and-window-height
       * @reference: https://stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen
      */
      $children.each(function(){
        if($(this)[0].src !== undefined){
          $tmp.link = $(this)[0].src;
        }
      });

        if($tmp.link == undefined){
          $tmp.link = null;
        }

        $data.widgets.push($tmp);
    });
    console.log($data.widgets)

    if($data.widgets[0] !== undefined && $heading !== 'asdasd'){
      $('#loading').css('display','inline-block');
      console.log('sending')
      $.ajax({
        type:"POST",
        contentType:"application/javascript",
        url:"/save",
        data:JSON.stringify($data),
        success: widgetSaved
      })

      function widgetSaved(response){
        $('#loading').hide();
        $saved = 1;
      }

    }
}
