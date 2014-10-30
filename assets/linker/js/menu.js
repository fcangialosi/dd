simpleCart({
    checkout: {
        type: "SendForm" ,
        url: "/catering/order/submit" ,
        method: "POST",
        cartStyle: "table"
    },
     taxRate: 0.06,
     shippingCustom: function(){
        return 12;
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

  $('*#checkout-button').each(function() {
    $(this).click(function() {
      var requestText = $('#special-request').val();
      var csrf = $('#csrf').val();
      $.post("/catering/order/saveSpecialRequest", { _csrf: csrf, request : requestText });
      window.location.href= "/catering/order/payment";
    });
  });



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