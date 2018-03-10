function saveAll(){

    var $k_id =window.location.href.replace("http://localhost:5000/create?id=","");
    var $widgets=$('.new_div');
    //var $w_id=0;
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
          var $link = $(this)[0].src;
          $tmp.link = $link
        }
      });

      $data.widgets.push($tmp);
    });

    if($data.widgets[0] !== undefined){
      $.ajax({
        type:"POST",
        contentType:"application/javascript",
        url:"/save",
        data:JSON.stringify($data)
      }).done(function(response){
        console.log(response);
        $saved = 1;
      });
    }
}
