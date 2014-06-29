$(document).ready(function() {
  var $change = $('.ui.change.button');
  var handler = {
    activate: function() {
      $change.removeClass('active');
      $change.text("Select");
      $(this).addClass('active');
      $(this).text("Selected");
      $('#delivery-option-index').attr('value', $(this).attr('index'));
    }
  };
  $change.on('click', handler.activate);
});