ready = function() {
  $('#reorder-button').click(function() {
    var new_order = {}
    $('*#item-index').each(function(index, item) {
      new_order[item.name] = item.value;
    });
    console.log(new_order);
    var csrf = $('input[name="_csrf"]')[0].value;
    var menu_id = document.URL.split("/")[document.URL.split("/").length-1];
    $.post("/menu/reorder/", {_csrf : csrf, id: menu_id, order : new_order}).done(function(data) {
      window.location.reload();
    });
  });

  $("*#bg-update-btn").each(function() {
    var submit = $(this);
    submit.click(function() {
      submit.html("...");
      $.ajax({
        type:submit.attr('method'),
        url:submit.attr('action'),
        data:submit.parent().parent().find(".bg-update-in").serialize(),
        success : function(data) {
          submit.html("&#10003;");
        }
      });
    });
  });
};

// attach ready event
$(document).ready(ready);