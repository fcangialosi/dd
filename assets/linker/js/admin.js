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
};

// attach ready event
$(document).ready(ready);