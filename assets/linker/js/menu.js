simpleCart({
    checkout: { 
        type: "SendForm" , 
        url: "/catering/menu/order" ,
        method: "GET",
        cartStyle: "table"
    } 
});

ready = function() {

  // selector cache
  var
    $menuItem = $('.menu a.item, .menu .link.item'),
    $dropdown = $('.main.container .menu .dropdown'),
    // alias
    handler = {

      activate: function() {
        if(!$(this).hasClass('dropdown')) {
          $(this)
            .addClass('active')
            .closest('.ui.menu')
            .find('.item')
              .not($(this))
              .removeClass('active')
          ;
        }
      }

    }
  ;

  $menuItem
    .on('click', handler.activate)
  ;
  $('.sticky-sidebar').waypoint('sticky',{
  	offset: 30
  });
  $(function () {
    $('#delivery-datepicker').datetimepicker({
      pickTime: false,
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    });
    $('#delivery-timepicker').datetimepicker({
      pickDate: false,
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    });
  });

};


// attach ready event
$(document)
  .ready(ready)
;