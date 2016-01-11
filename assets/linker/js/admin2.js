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

  $('#preview-btn').click(function() {
    if (!$('#preview').attr('style')) { // Need to hide
      $('#preview').attr('style', 'display: none;');
      $('#editor').attr('style', '');
      $(this).text('Show Preview');
    } else { // Need to show
      $('#preview').attr('style', '');
      $('#editor').attr('style', 'display:none;');
      $(this).text('Hide Preview');
    }
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

  createNewBYOInput = function() {
    t = $('table')[0];
    nextId = $('tr').length-1;
    newRow = t.insertRow(-1);
    newRow.insertCell(-1).innerHTML = "<input name='item-"+nextId+"' value='' type='text' class='form-control'>";
    newRow.insertCell(-1).innerHTML = "<input name='price-"+nextId+"' value='' type='text' class='form-control'>";
    newRow.insertCell(-1).innerHTML = "<span onclick='deleteThisBYOInput(this)'class='btn btn-sm btn-danger'>Delete</span>";
  }

  deleteThisBYOInput = function(button) {
    x = button;
    $(button).parent().parent().remove();
  }
};

// attach ready event
$(document).ready(ready);