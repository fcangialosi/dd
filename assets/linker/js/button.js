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

  var $change = $('.ui.change.button');
  var change_handler = {
    activate: function() {
      $change.removeClass('active').text("Select"); // wipe all selected
      $(this).addClass('active').text("Selected"); // select just the clicked option
      // set hidden field in form as the index of this option in the saved options array
      $('#option-index').attr('value', $(this).attr('index'));
    }
  };
  $change.on('click', change_handler.activate);

  simpleCart.bind( 'update' , function(){
    if(simpleCart.quantity() > 0) {
      $("#order-summary-contents").html('<p class="warning-border" style="font-size: 0.8em">You can use the <i class="minus sign icon"></i> and <i class="add sign icon"></i> buttons to change an items quantity, or the <i class="medium trash icon"></i> button to delete an item.</p><center><div class="simpleCart_items"></div></center><div class="ui divider"></div><center><b>Food And Beverage Total: </b>&nbsp;<span class="simpleCart_total"></span></center>');
    } else {
      $("#order-summary-contents").html("<center>It looks like you haven't added any items to your order yet!<br>Make sure you pressed the <b>\"Add\"</b> button next to each item <b>after</b> entering in the quantity.<br>After you add an item, you should see your <b>total</b> increase in the top left hand corner of the menu.</center>");
    }
  });

  simpleCart.bind( 'checkoutSuccess' , function( data ){
    simpleCart.empty();
  });

  $('#tax-exempt-button').on('click', function(){
    simpleCart.setTaxRate(0);
    simpleCart.update();
  });

});