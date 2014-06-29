simpleCart({
    checkout: { 
        type: "SendForm" , 
        url: "/catering/menu/order" ,
        method: "GET",
        cartStyle: "table"
    } 
});

ready = function() {

  // menu page
  var $menuItem = $('.menu a.item, .menu .link.item'),
      $dropdown = $('.main.container .menu .dropdown'),
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
      };
  $menuItem.on('click', handler.activate);
  $('.sticky-sidebar').waypoint('sticky',{
  	offset: 30
  });

  // delivery page
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

  // payment page
  $('#card-form').card({
    container: '.card-wrapper'
  });

};

$(document).ready(ready);