function saveAll(){

    var $k_id =window.location.href.replace("http://localhost:5000/create?id=","").replace('http://localhost:5000/edit?k=','').replace('#','');
    var $widgets=$('.new_div');
    var $heading = $('#kan_heading').val();
//    console.log($heading =='');

    var $data = {
      "widgets":[]
    };

    $widgets.each(function(){
      var $tmp = {};
    //  console.log($($(this).children()[0]).css('font-size'));
      var $type = $(this).attr('data-kan-type');
      var $w_id = $(this).attr('data-kan-wid');
      var $height = Number(getComputedStyle($(this)[0]).height);
      var $width = Number(getComputedStyle($(this)[0]).width);
      //Cannot use $(this).position() because using position() on a rotated element
      //Will give you a different top and left from the originally rotated element
      //Thus we have to use getComputedStyle() which will return the top and left before rotating
      //@reference: https://stackoverflow.com/questions/29620471/how-to-get-original-position-of-an-element-div-after-its-been-rotated
      var $pos ={}
      $pos.top = Number(getComputedStyle($(this)[0]).top.replace('px',''));
      $pos.left = Number(getComputedStyle($(this)[0]).left.replace('px',''));

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
      $tmp.textstyle = null;

      /*
       * @reference: https://stackoverflow.com/questions/3044230/difference-between-screen-availheight-and-window-height
       * @reference: https://stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen
      */
      $children.each(function(){
        if($(this)[0].src !== undefined){
          $tmp.link = $(this)[0].src;
        }
      });
        if($type == 'text'){
          var p = /["]/g
          console.log($($(this).children()[0]).css('font-family').replace(p,''))
          $tmp.link = $($(this).children()[0]).text();
          $tmp.textstyle = 'font-size:'+$($(this).children()[0]).css('font-size')+';'
                            +'font-weight:'+$($(this).children()[0]).css('font-weight')+';'
                            + 'font-family:'+$($(this).children()[0]).css('font-family').replace(p,'')+';'
                            + 'text-decoration:'+$($(this).children()[0]).css('text-decoration')+';'
                            + 'color:'+$($(this).children()[0]).css('color')+';'
                            + 'background-color:'+$($(this).children()[0]).css('background-color')+';';
          console.log($tmp.textstyle)
          //When getting the font from the element there can be some string elements (e.g.\,/.")
          //Which will break the code when trying to use JSON.parse, thus we remove them when saving
          //The style will still be applied and work
          /*var $strTemp ="";
          for(i=0;i<$tmp.textstyle.length;i++){
            if($tmp.textstyle[i] !=='\\' && $tmp.textstyle[i] !== '"' && $tmp.textstyle[i] !=='/') {
              $strTemp += $tmp.textstyle[i];
            }
          }
          $tmp.textstyle = $strTemp;*/
          //console.log("Modified Style: " + $strTemp)
          //$tmp.style = $tmp.style['font-size',$($(this).children()[0]).css('font-size')]
          console.log($tmp.textstyle)
        } else if($tmp.link == undefined){
          $tmp.link = null;
        }
        console.log($tmp.textstyle);
        $data.widgets.push($tmp);
    });
  //  console.log($data.widgets)

    if($data.widgets[0] !== undefined && $heading !== 'asdasd'){
      $('#loading').css('display','inline-block');
      console.log('sending')
      $.ajax({
        type:"POST",
        contentType:"application/javascript",
        url:"/save",
        data:JSON.stringify($data),
        success: widgetSaved,
        error: widgetSaveError
      })

      function widgetSaved(response){
        $('#loading').hide();
    //    console.log(response)
        $saved = 1;
      }
      function widgetSaveError(err){
        $('#loading').hide();
    //    console.log(response)
        $saved = 0;
      }

    }
}
