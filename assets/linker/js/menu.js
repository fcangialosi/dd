simpleCart({
    checkout: { 
        type: "SendForm" , 
        url: "/catering/order/submit" ,
        method: "POST",
        cartStyle: "table"
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
  $('.sticky-sidebar').waypoint('sticky',{
  	offset: 30
  });

  // delivery page
  $(function () {
    $('#delivery-datepicker').datetimepicker({
      pickTime: false,
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    });
    $('#delivery-timepicker').datetimepicker({
      pickDate: false,
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    });
  });

  // payment page
  $('#card-form').card({
    container: '.card-wrapper'
  });

  // $('#confirm-checkout').on('click', function(){
  //   var data = simpleCart.checkout.SendForm({'url' : '/catering/order/submit', 'method' : 'POST'}).data;
  //   var form = simpleCart.$create("form");
  //   form.attr('style', 'display:none;');
  //   form.attr('action', '/catering/order/submit');
  //   form.attr('method', 'POST');
  //   simpleCart.each(data, function (val, x, name) {
  //     form.append(
  //       simpleCart.$create("input").attr("type","hidden").attr("name",name).val(val)
  //     );
  //   });
  //   $.get("/csrfToken", function(data) {
  //     if(data) {
  //       form.append(simpleCart.$create("input").attr("type","hidden").attr("name","_csrf").val(data._csrf));
  //     }
  //     simpleCart.$("body").append(form);
  //     form.el.submit();
  //     form.remove();
  //   });
    
  // });

};

$(document).ready(ready);