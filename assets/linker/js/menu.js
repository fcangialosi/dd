simpleCart({
    checkout: {
        type: "SendForm" ,
        url: "/catering/order/submit" ,
        method: "POST",
        cartStyle: "table"
    },
     taxRate: 0.06,
     shippingCustom: function(){
        return 10;
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
  $('.sticky-leftbar').waypoint('sticky',{
  	offset: 55,
      stuckClass: 'stuck-leftbar',
  });
  $('.sticky-topbar').waypoint('sticky',{
    offset: 0,
    stuckClass: 'stuck-topbar',
  });
  $('.ui.checkbox').checkbox();

  // delivery page
  $(function () {
    $('#delivery-datepicker').datetimepicker({
      pickTime: false,
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