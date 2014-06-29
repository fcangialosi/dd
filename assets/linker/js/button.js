$(document).ready(function() {
  var $change = $('.ui.change.button');
  var handler = {
    activate: function() {
      $change.removeClass('active').text("Select"); // wipe all selected
      $(this).addClass('active').text("Selected"); // select just the clicked option
      // set hidden field in form as the index of this option in the saved options array
      $('#delivery-option-index').attr('value', $(this).attr('index')); 
    }
  };
  $change.on('click', handler.activate);
});