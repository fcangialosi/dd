$(document).ready(function() {

  $('#delivery-datepicker').focusout(function(){
    date = $('#delivery-datepicker').val()
    $('#delivery-date').attr('value', date);
  });
  $('#delivery-timepicker').focusout(function(){
    time = $('#delivery-timepicker').val()
    $('#delivery-time').attr('value', time);
  });
  $('#start-over').on('click', function(){
    $('input[type=text]').val(0);
  });

  var $delivery_change = $('.ui.grid.delivery-option');
  var $delivery_button = $('.ui.delivery-change.button');
  var last_delivery = null;
  var delivery_handler = {
    activate: function() {
      if (!last_delivery) {
        last_delivery = $('.ui.grid.delivery-option.active');
      }
      if (typeof last_delivery != 'undefined' && typeof last_delivery.children()[1] != 'undefined') {
        last_delivery.removeClass('active');
        last_delivery.children()[1].children[0].innerHTML = " Select Location";
      }
      $(this).addClass("active");
      $(this).children()[1].children[0].innerHTML = '<i class="ui large icon check" style="margin-left:10px;padding-top:5px;margin-bottom:9px;"></i>';
      $('#option-index').attr('value', $(this).attr('index'));
      last_delivery = $(this);
    }
  };

  $delivery_change.on('click', delivery_handler.activate);

  var $payment_change = $('.item.payment-option');
  var $payment_button = $('.ui.payment-change.button');
  var last_payment = null;
  var payment_handler = {
    activate: function() {
      if (!last_payment) {
        last_payment = $('.item.payment-option.active');
      }
      if (typeof last_payment != 'undefined' && typeof last_payment.children()[2] != 'undefined') {
        last_payment.removeClass('active');
        last_payment.children()[2].innerHTML = " Select";
      }
      $(this).addClass("active");
      $(this).children()[2].innerHTML = '<i class="ui medium icon check" style="margin-left:10px;"></i>';
      $('#option-index').attr('value', $(this).attr('index'));
      last_payment = $(this);
    }
  };
  $payment_change.on('click', payment_handler.activate);

  simpleCart.bind( 'update' , function(){
    if(simpleCart.quantity() > 0) {
      $("#order-summary-contents").html('<p class="warning-border" style="font-size: 0.8em">You can use the <i class="minus sign icon"></i> and <i class="add sign icon"></i> buttons to change an items quantity, or the <i class="medium trash icon"></i> button to delete an item.</p><center><div class="simpleCart_items"></div></center><div class="ui divider"></div><center><b>Food And Beverage Total: </b>&nbsp;<span class="simpleCart_total"></span></center>');
    } else {
      $("#order-summary-contents").html("<center>It looks like you haven't added any items to your order yet!<br>Make sure you pressed the <b>\"Add\"</b> button next to each item <b>after</b> entering in the quantity.<br>After you add an item, you should see your <b>total</b> increase in the top left hand corner of the menu.</center>");
    }
  });

  simpleCart.bind( 'checkoutSuccess' , function( data ){
    $('.ui.fluid.form.segment').attr('class','ui fluid loading form segment');
  });

  $('#tax-exempt-button').on('click', function(){
    simpleCart.setTaxRate(0);
    simpleCart.update();
  });

});