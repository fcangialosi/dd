$(document).ready(function() {

  $('#delivery-datepicker').focusout(function(){
    date = $('#delivery-datepicker').val()
    $('#delivery-date').attr('value', date);
  });
  $('#delivery-timepicker').focusout(function(){
    time = $('#delivery-timepicker').val()
    $('#delivery-time').attr('value', time);
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
});