function saveAll(){

    var $widgets=$('.new_div');
    var $data = {
      "widgets":[]
    };

    $widgets.each(function(){
      var $type = $(this).attr('data-kan-type')
      var $children = $(this).children()
      $children.each(function(){
        if($(this).attr(""))
      });
    });

}
