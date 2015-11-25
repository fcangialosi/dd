String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function() {

  if($('#is-virtual').length) {
    simpleCart.isCatering = false;
  }

  locationInput = $('#location-input');

  // called by onclick listener of table elements in the
  // location selection table, choice = the element clicked
  locationSelected = function(choice) {
    choice.setAttribute('class','location-selected');
    locationInput.val(choice.children[0].innerHTML);

    //update location-based shipping fee
    fee = choice.children[3].innerHTML.replace(/(\$|\s)?/g, "");

    simpleCart.shipping(function() {
      return fee;
    });
    simpleCart.update();

    allChoices = choice.parentElement.children;
    for (var i=0; i < allChoices.length; i++){
      curr = allChoices[i];
      if (curr != choice) {
        curr.setAttribute('class','disabled');
      }
    }
  }

  datePicker = $('#virtual-datepicker').datetimepicker({
    pickTime: false,
    daysOfWeekDisabled: [0, 6],
    up: "fa fa-arrow-up",
    down: "fa fa-arrow-down"
  });

  dateInput = $('#date-input');
  $('#today-button').click(function() {
    if ($('#toolate').length) {
      return;
    }
    if (this.classList.contains('active')) {
      datePicker.parent().parent()[0].setAttribute('class','field');
    } else {
      dateInput.val('today');
      datePicker.parent().parent()[0].setAttribute('class','disabled field');
    }
    this.classList.toggle('active');
  });

  lastActive = null;
  $('#virtualcafe-sections a').click(function(e) {
    e.preventDefault();
    target = this.getAttribute('target');
    if (lastActive) {
      lastActive.classList.remove('active');
      $('.ui.checkbox :checked').removeAttr('checked');
      $('.drink-select').val('');
    }
    newActive = document.getElementById(target);
    newActive.classList.add('active');
    lastActive = newActive;
  });

  $('.simpleCart_shelfItem.ui.segment').click(function() {
    this.getElementsByClassName("item_description")[0].classList.toggle('active');
  });

  $('.simpleCart_shelfItem .item_description .item_select').click(function(e) {
    item = this.parentElement.parentElement;
    item_name = item.parentElement.getElementsByClassName("item_name")[0].innerHTML;
    if (item_name == "Build-Your-Own Burger") {
      $("#virtualcafe-sections > a[target='menu-custom']").click();
      $('.custom-type-select').val("burger").change();
      e.stopPropagation();
      return;
    }
    item_price = item.parentElement.getElementsByClassName("item_price")[0].innerHTML;
    item.parentElement.parentElement.parentElement.classList.remove('active');
    extras = document.getElementById('menu-extras');
    extras.classList.add('active');
    lastActive = extras;
    simpleCart.add({
      name : item_name,
      price : item_price
    });
    e.stopPropagation();
  });

  $('.simpleCart_shelfItem.ui.checkbox').checkbox('setting','onChange',function() {
    item = this[0];
    item_name = item.parentElement.getElementsByClassName("item_name")[0].innerHTML;
    found = simpleCart.find({name : item_name});
    simpleCartItem = found.length ? found[0] : null;

    if (!item.checked) {
      // remove from cart
      if (simpleCartItem) {
        beforeQuantity = simpleCartItem.quantity();
        if (beforeQuantity > 1) {
          simpleCartItem.quantity(beforeQuantity-1);
        } else {
          simpleCartItem.remove();
        }
      }

    } else {
      // add to cart
      if (simpleCartItem) {
        beforeQuantity = simpleCartItem.quantity();
        simpleCartItem.quantity(beforeQuantity+1);
      } else {
        item_price = item.parentElement.getElementsByClassName("item_price")[0].innerHTML.substring(1);
        simpleCart.add({
          name : item_name,
          price : item_price
        });
      }
    }

    simpleCart.update();
  });

  customOrder = {
  };


  $('.simpleCart_customItem.ui.checkbox').checkbox('setting','onChange',function (){
    item = this[0];
    name_span = item.parentElement.getElementsByClassName("item_name")[0];
    item_name = name_span.innerHTML;
    price_span = item.parentElement.getElementsByClassName("item_price");
    item_price = 0;
    if (price_span.length) {
      item_price = price_span[0].innerHTML;
    }
    item_type = name_span.getAttribute('type');

    if(!item.checked) { // was just unchecked, remove
      index = customOrder[item_type].indexOf(item_name);
      customOrder[item_type].splice(index, 1);
      customOrder["total_price"] -= parseFloat(item_price);
    } else { // was just checked, add
      customOrder[item_type].push(item_name);
      customOrder["total_price"] += parseFloat(item_price);
    }
  });

  listToString = function(l, and) {
    if (l.length < 1) {
      return ""
    } else if (l.length == 1) {
      return String(l[0]);
    } else if (l.length == 2) {
      if (and) {
        return l[0] + " and " + l[1];
      } else {
        return l[0] + ", " + l[1];
      }
    } else {
      s = "";
      i = 0;
      for (; i < l.length-1; i++) {
        if (l[i]) {
          s += (l[i] + ", ")
        }
      }
      if (and) {
        s += "and "
      }
      s += l[i];
      return s;
    }
  }
  orderToString = function(order) {
    s = "";
    if (order.meat && order.meat.length) {
      s += listToString(order.meat,true) + " " + order.type;
    }
    if (order.type == "Sandwich") {
      s += " on " + order.bread;
    }
    if (order.cheese && order.cheese.length) {
      s += " with " + listToString(order.cheese,true);
    }
    if (order.addons && order.addons.length) {
      s += " (add: " + listToString(order.addons,false) + ")";
    }
    return s;
  }

  customTypeDropdown = $('.custom-type-select.ui.dropdown');
  customTypeDropdown.change(function() {
    type = customTypeDropdown.val();
    type_selector = "."+type+"-field";
    if(type) {
      fields = $(type_selector);
      for(var i=0; i<fields.length; i++) {
        fields[i].classList.add("active");
      }
    }
    to_remove = $(".custom-field").not(type_selector);
    for(var i=0; i<to_remove.length; i++) {
      to_remove[i].classList.remove("active");
      $('.custom-field :checked').not(type_selector).removeAttr('checked');
      $('.custom-field>.ui.dropdown').not(type_selector).val('');
    }
    customOrder = {
      'total_price' : 0,
      'meat' : [],
      'bread' : '',
      'type' : type.capitalize(),
      'cheese' : [],
      'addons' : []
    };
  });

  $('.custom-select').change(function (){
    select = $(this);
    selection = select.val().split("-")[1];
    if (customOrder.type == "Burger") {
      customOrder['meat'] = [selection]
    } else {
      customOrder['bread'] = selection;
    }
  });

  $('#custom-addtocart').click(function (e){
    this.parentElement.parentElement.classList.remove('active');
    extras = document.getElementById('menu-extras');
    extras.classList.add('active');
    lastActive = extras;
    simpleCart.add({
      name : orderToString(customOrder),
      price : customOrder.total_price
    });
    e.stopPropagation();
  });

  lastDrinkSelected = null;
  drinkSelectDropdown = $('.drink-select.ui.dropdown');
  drinkSelectDropdown.change(function() {
    if (lastDrinkSelected) {
      lastDrinkSelected.remove();
    }
    if(drinkSelectDropdown.val() !== "") {
      sp = drinkSelectDropdown.val().split(",");
      drink = sp[0], item_price = sp[1];
      lastDrinkSelected = simpleCart.add({
        name : drink,
        price : item_price
      });
    }
  });

  cardSelectDropdown = $('.card-select.ui.dropdown');
  cardSelectDropdown.change(function() {
    sp = cardSelectDropdown.val().split(",");
    lastFour = sp[0], name = sp[1], expiry = sp[2], cvc = sp[3], cardIndex = sp[4];
      $('#card-number').val("XXXX-XXXX-XXXX-"+lastFour);
      $('#card-name').val(name).trigger("keyup");
      $('#card-expiry').val(expiry).trigger("keyup");
      $('#card-cvc').val(cvc).trigger("keyup");
      $('#card-index').val(cardIndex);
      $('#card-number').trigger("keyup"); // updates display
      $('#card-form .form.segment').addClass("disabled");
      $('.card-wrapper').children().children()[0].classList.add("xxxx","identified"); // pretty formatting
  });

  $('#method-one').click(function () {
    $('#method-one-expand').toggleClass('invisible');
    $('#method-one-plus').toggleClass('plus');
    $('#method-one-plus').toggleClass('minus');
  });

  $('#method-two').click(function () {
    $('#method-two-expand').toggleClass('invisible');
    $('#method-two-plus').toggleClass('plus');
    $('#method-two-plus').toggleClass('minus');
  });

});