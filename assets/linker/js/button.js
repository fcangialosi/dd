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

  var $delivery_change = $('.ui.delivery-change.button');
  var delivery_handler = {
    activate: function() {
      $delivery_change.removeClass('active').text("Select Location"); // wipe all selected
      $(this).addClass('active').text("Selected Location"); // select just the clicked option
      // set hidden field in form as the index of this option in the saved options array
      $('#option-index').attr('value', $(this).attr('index'));
    }
  };
  $delivery_change.on('click', delivery_handler.activate);

  var $payment_change = $('.ui.payment-change.button');
  var payment_handler = {
    activate: function() {
      $payment_change.removeClass('active').text("Select This Card"); // wipe all selected
      $(this).addClass('active').text("Selected"); // select just the clicked option
      // set hidden field in form as the index of this option in the saved options array
      $('#option-index').attr('value', $(this).attr('index'));
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