simpleCart({
    checkout: {
        type: "SendForm" ,
        url: "/catering/order/submit" ,
        method: "POST",
        cartStyle: "table"
    },
    taxRate: 0.06,
    shippingCustom: function(){
      if (simpleCart.isCatering) {
        return 12;
      } else {
        return 0;
      }
     }
});
simpleCart.extend({
  isCatering : true
});

simpleCart.bind('beforeAdd' , function( item ){
    item_in_cart = simpleCart.has(item);
    if (item_in_cart) {
        item_in_cart.set('quantity',0);
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

  $('*#checkout-button').each(function() {
    $(this).click(function() {
      if (simpleCart.quantity() > 0) {
        var requestText = $('#special-request').val();
        var csrf = $('#csrf').val();
        $.post("/catering/order/saveSpecialRequest", { _csrf: csrf, request : requestText });
        window.location.href= "/catering/order/payment";
      } else {
        var cartEmptyModal =  $("#cartEmptyModal");
        $("#myModal").modal('hide')
        cartEmptyModal.modal('toggle');
      }
    });
  });

  $('.item_add').click(function(){
    set_button = $(this);
    set_button.attr('class','item_add inverted check icon');
    set_button.text("");
    set_button.attr('style','opacity:1;background-color:#5BBD72;');
  });

  var last_val;

  $('.item_Quantity').focusin(function() {
    check_box = $(this).next();
    check_box.attr('class','item_add inverted icon');
    check_box.text("Set");
    check_box.attr('style','');
    last_val = $(this).val();
  });

  $('.item_Quantity').focusout(function() {
    curr_val = $(this).val();
    if (curr_val > 0 && curr_val == last_val) {
      set_button = $(this).next();
      set_button.attr('class','item_add inverted check icon');
      set_button.text("");
      set_button.attr('style','opacity:1;background-color:#5BBD72;');
    }
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