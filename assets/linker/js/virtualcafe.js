String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var base_salad_price = 4.50;

$(document).ready(function() {

  $('#virtual-js-id').text('3.2');
  
  if (simpleCart.total() && !simpleCart.isCatering) {
      $('#submit-button').html("Submit My Order (<span class='simpleCart_grandTotal'></span>)")
  }

  if($('#is-virtual').length) {
    simpleCart.isCatering = false;
    simpleCart.chargeCreditCard = true;
  } else {
      simpleCart.chargeCreditCard = false;
  }

  specials_section = $('a[target="menu-10"]')[0];
  
  showDailySpecials = function() {
      // Show today's specials
      if (specials_section) { 
          specials_section.setAttribute('style','');
      }
  }
  
  hideDailySpecials = function() {
      // Hide today's specials
      if (specials_section) {
          specials_section.setAttribute('style','display:none');
      }
  }
  
  //hideDailySpecials();

  datePicker = $('#virtual-datepicker').datetimepicker({
    pickTime: false,
    useCurrent: false,
    daysOfWeekDisabled: [0, 6],
    disabledDates : [
        new Date(2019, 11-1, 28),
        new Date(2019, 11-1, 29)
    ],
    up: "fa fa-arrow-up",
    down: "fa fa-arrow-down"
  });

  locationInput = $('#location-input');
  updateLocation = function(locationStr, deadline, fee) {
    locationInput.val(locationStr);

    toolate_box = $('#toolate-box');
    if (moment().diff(moment(deadline, 'hh:mmA'), 'minutes') > 0) {
        $('#today-button').removeClass('active');
        $('#today-button').addClass('disabled');
        if (toolate_box.text().trim().length == 0 || toolate_box.text().indexOf("another") > 0) {
            toolate_box.text("Sorry, we cannot accept orders past " + deadline + " for this location. Please select another location or a future date.");
        }
        datePicker.parent().parent()[0].setAttribute('class','field');
        datePicker.val('');
    } else {
        $('#today-button').removeClass('disabled');
        toolate_box.text('');
    }	

    simpleCart.shipping(function() {
      return fee;
    });
    simpleCart.update();
  }


  // called by onclick listener of table elements in the
  // location selection table, choice = the element clicked
  locationSelected = function(choice) {
    // highlight the one they clicked on 
    choice.setAttribute('class','location-selected');
    
    // disable all of the ones they didn't click on
    allChoices = choice.parentElement.children;
    for (var i=0; i < allChoices.length; i++){
      curr = allChoices[i];
      if (curr != choice) {
        curr.setAttribute('class','disabled');
      }
    }

    // update the rest of the form based on this choice, make sure today is disabled if necessary
    locationName = choice.children[0].children[0].innerHTML;
	locationDeadline = choice.children[1].innerText;
    locationFee = choice.children[4].innerHTML.replace(/(\$|\s)?/g, "");
    updateLocation(locationName, locationDeadline, locationFee);

  }

  deliverySelectDropdown = $('.delivery-select.ui.dropdown');
  deliverySelectDropdown.change(function() {
      locationInput.val(deliverySelectDropdown.val());
  });

  selectDeliveryButton = $('#select-delivery-button');
  deliveryDetails = $('#menu-delivery');
  selectPickupButton = $('#select-pickup-button');
  pickupDetails = $('#menu-pickup');
  selectVirtualButton = $('#select-virtual-button');
  virtualDetails = $('#menu-virtual');

  selectDeliveryButton.click(function() {
    selectDeliveryButton[0].classList.add('active');
    deliveryDetails[0].classList.add('active');
    selectPickupButton[0].classList.remove('active');
    pickupDetails[0].classList.remove('active');
    selectVirtualButton[0].classList.remove('active');
    virtualDetails[0].classList.remove('active');
    $('#menu-virtual .location-selected').removeClass("location-selected");
    $('#menu-virtual .disabled').removeClass("disabled");
    updateLocation(deliverySelectDropdown.val(), "2:00PM", "1.50")
  });
  selectPickupButton.click(function() {
    selectPickupButton[0].classList.add('active');
    pickupDetails[0].classList.add('active');
    selectDeliveryButton[0].classList.remove('active');
    deliveryDetails[0].classList.remove('active');
    selectVirtualButton[0].classList.remove('active');
    virtualDetails[0].classList.remove('active');
    $('#menu-virtual .location-selected').removeClass("location-selected");
    $('#menu-virtual .disabled').removeClass("disabled");
    updateLocation("takeout", "2:30PM", "0.00");
  });
  selectVirtualButton.click(function() {
    selectVirtualButton[0].classList.add('active');
    virtualDetails[0].classList.add('active');
    selectPickupButton[0].classList.remove('active');
    pickupDetails[0].classList.remove('active');
    selectDeliveryButton[0].classList.remove('active');
    deliveryDetails[0].classList.remove('active');
    locationInput.val("");
    simpleCart.shipping(clearShippingFn);
    simpleCart.update();
    $('#menu-virtual .location-selected').removeClass("location-selected");
    $('#menu-virtual .disabled').removeClass("disabled");
  });

  $('#today-button').click(function() {
    if ($('#toolate-box').text().trim().length) {
        hideDailySpecials();
        return;
    }
    if (this.classList.contains('disabled')) {
        return;
    }
    if (this.classList.contains('active')) {
      datePicker.parent().parent()[0].setAttribute('class','field');
      datePicker.val('');
    } else {
      today = new Date();
      datePicker.val((today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear());
      datePicker.parent().parent()[0].setAttribute('class','disabled field');
    }
    this.classList.toggle('active');
    showDailySpecials();
  });

  lastActive = document.getElementById("menu-0");
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

  displaySideMenu = function(item_side) {
    if (item_side == ""){
      item_side = "deli";
    }
    var type_selector = '.freeside_'+item_side+'-side';
		side_selector = $(type_selector)[0];
		if(side_selector != null) {
			side_selector.classList.add("active");
		}
    to_remove = $(".virtual-side").not(type_selector);
    for(var i=0; i<to_remove.length; i++) {
      to_remove[i].classList.remove("active");
    }
  };
  hideSections = function() { 
    //$('#virtualcafe-sections').attr('style','display:none;');
		$('#virtualcafe-sections').attr('disabled', 'disabled');
  }
  showSections = function() {
    //$('#virtualcafe-sections').attr('style','');
		$('#virtualcafe-sections').attr('disabled', null);
  }
  itemJustSelected = null;
  previousSection = null;
  $('.simpleCart_shelfItem .item_select').click(function(e) {
		var item;
    item = this.parentElement;
    item_name = item.parentElement.getElementsByClassName("item_name")[0].innerHTML;
    item_desc = item.parentElement.getElementsByClassName("item_description")[0].innerHTML;
    price_span = item.parentElement.getElementsByClassName("item_price");
    item_price = 0;
    if (price_span.length) {
      item_price = price_span[0].innerHTML;
			if (item_price[0] === "$") {
				item_price = item_price.substring(1);
			}
    }
    if (item_name.indexOf("Create-Your-Own") > -1) {
      $("#virtualcafe-sections > a[target='menu-custom']").click();
      var custom_type = "deli";
      lower = item_name.toLowerCase();
      if (lower.indexOf("wrapper") > -1) {
        custom_type = "wrapper";
      } else if (lower.indexOf("grill") > -1) {
        custom_type = "grill";
      } else if (lower.indexOf("burger") > -1) {
        custom_type = "burger";
      } else if (lower.indexOf("salad") > -1) {
        custom_type = "salad";
      } else if (lower.indexOf("wing") > -1) {
        custom_type = "wings";
      }
      $('.custom-type-select').val(custom_type).change();
      e.stopPropagation();
      return;
    } else {
			newCustomOrder(item_name);
			customOrder["total_price"] = parseFloat(item_price);
		}
    previousSection = item.parentElement.parentElement.parentElement;
    previousSection.classList.remove('active');
    extras = document.getElementById('menu-extras');
    extras.classList.add('active');
    lastActive = extras;
    itemJustSelected = simpleCart.add({
      name : item_name,
      price : item_price
    });

		// Fill in "Customize Your ... "
		$('#customize-item-name').html(item_name);
		$('#customize-item-desc').html(item_desc);
		item_customize = item.parentElement.getElementsByClassName("item_customizable")[0].innerHTML;
		fields = $(".customize");
		if (item_customize == "true") {
			for (var i=0; i<fields.length; i++) {
				fields[i].classList.add("active");
			}
		} else {
			for (var i=0; i<fields.length; i++) {
				fields[i].classList.remove("active");
			}
		}

		// Display only the correct topping / bread sections for this type of item
    item_side = item.parentElement.getElementsByClassName("item_side")[0].innerHTML;
    type_selector = "."+item_side+"-field";
    if(type_selector) { //  && item_customize == "true") {
      fields = $(type_selector);
      for(var i=0; i<fields.length; i++) {
        fields[i].classList.add("active");
      }
    }
		if (item_customize == "true") {
			to_remove = $(".custom-field").not(type_selector).not('.customize');
		} else {
			to_remove = $(".custom-field").not(type_selector);
		}
    for(var i=0; i<to_remove.length; i++) {
      to_remove[i].classList.remove("active");
      $('.custom-field :checked').not(type_selector).removeAttr('checked');
      $('.custom-field>.ui.dropdown').not(type_selector).val('');
    }
		clearSelected();

    
		// Display the customize menu
    displaySideMenu(item_side);

		// Hide everything else
    hideSections();

    e.stopPropagation();
  });

	clearSelected = function() {
    $('.ui.checkbox :checked').removeAttr('checked');
    $('select').val('');

		// Clear any checkboxes from previous items
		$('.simpleCart_customItem.ui.checkbox :checked').removeAttr('checked');

		$('#special_request').val('');
	}

  goback = function() {
    showSections();
    previousSection.classList.add('active');
    lastActive.classList.remove('active');
    tmp = previousSection;
    previousSection = lastActive;
    lastActive = tmp;
		clearSelected();
  }

  $('.go-back').click(function(e) {
			goback();
  });

  $('.order-more').click(function(e) {
      goback();
  });

  $('.simpleCart_shelfItem.ui.checkbox').checkbox('setting','onChange',function() {
		var item;
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

	lastSelectedPrice = {
	};

  newCustomOrder = function(type){
    customOrder = {
      'total_price' : 0,
      'meat' : [],
      'bread' : '',
      'type' : type.capitalize(),
      'cheese' : [],
      'addons' : [],
			'name' : '',
			'side' : ''
    };
		lastSelectedPrice = {

		};
  }

	orderIsEmpty = function(order) {
		return (Object.keys(order).length === 0 && order.constructor === Object);
	}

  $('.simpleCart_customItem.ui.checkbox').checkbox('setting','onChange',function (){
		var item;
    item = this[0];
    name_span = item.parentElement.getElementsByClassName("item_name")[0];
    item_name = name_span.innerHTML;
    price_span = item.parentElement.getElementsByClassName("item_price");
    item_price = 0;
    if (price_span.length) {
      item_price = price_span[0].innerHTML;
			if (item_price[0] === "$") {
				item_price = item_price.substring(1);
			}
    }
    item_type = name_span.getAttribute('type');

		if (orderIsEmpty(customOrder)) {
			newCustomOrder(itemJustSelected.get("name"));
			customOrder['total_price'] = parseFloat(itemJustSelected.price());
		}

    if(!item.checked) { // was just unchecked, remove
      index = customOrder[item_type].indexOf(item_name);
      customOrder[item_type].splice(index, 1);
      customOrder["total_price"] -= parseFloat(item_price);
    } else { // was just checked, add
      if (item_type in customOrder) {
        customOrder[item_type].push(item_name);
      } else {
        customOrder[item_type] = [item_name];
      }
      customOrder["total_price"] += parseFloat(item_price);
    }

    itemJustSelected.set("name",orderToString(customOrder));
		itemJustSelected.price(customOrder["total_price"]);

    simpleCart.update();
  });

	customizeDropdown = $('.custom-select.ui.dropdown');
	customizeDropdown.change(function(e) {
    e.stopPropagation();
		val = $(this).val().split("-");
		type = val[0];
		chose = val.slice(1,val.length).join('-');
		if (orderIsEmpty(customOrder)) {
			newCustomOrder(itemJustSelected.get("name"));
			customOrder['total_price'] = parseFloat(itemJustSelected.price());
		}
		customOrder[type] = chose;
		chosePrice = customizeDropdown.children(':selected').text().split("(")[1];
		if (type in lastSelectedPrice) {
			customOrder['total_price'] -= lastSelectedPrice[type];
		}
		if (chosePrice) {
			chosePrice = chosePrice.substring(1, chosePrice.length - 1);
			customOrder['total_price'] += parseFloat(chosePrice);
			lastSelectedPrice[type] = parseFloat(chosePrice);
		}

		itemJustSelected.set("name",orderToString(customOrder));
		itemJustSelected.price(customOrder["total_price"]);
		simpleCart.update();

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
      s += listToString(order.meat,true);
      if (order.type != "Grill") {
        s += " " + order.type;
      }
    } else if (order.type == "Salad") {
      s += listToString(order.green,true) + " Salad";
      if ('dressing' in order) {
        s += " with " + listToString(order.dressing,true) + " dressing";
      }
      if ('free_topping' in order) {
        s += "<br>* Free: " + listToString(order.free_topping);
      }
      if ('premium_topping' in order) {
        s += "<br>* Premium: " + listToString(order.premium_topping);
      }
      customOrder.total_price += base_salad_price;
    } else {
			s = JSON.parse(JSON.stringify(order.type));
		}
    //if (order.type == "Sandwich") {
		if (order.bread && order.bread.length) {
      s += " on " + order.bread;
    }
    if (order.cheese && order.cheese.length) {
      s += " with " + listToString(order.cheese,true);
    }
		if (order.side && order.side.length) {
			s += " with " + order.side;
		}
    if (order.addons && order.addons.length) {
      s += "<br>* Add: " + listToString(order.addons,false);
    }
		if (order.special_request && order.special_request.length) {
			s += "<br>* Special Request: " + order.special_request;

		}
    return s;
  }

  customTypeDropdown = $('.custom-type-select.ui.dropdown');
  customTypeDropdown.change(function() {
    type = customTypeDropdown.val();
    displaySideMenu(type);
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
    newCustomOrder(type);
  });

	/*
  $('.custom-select').change(function (){
    select = $(this);
    selection = select.val().split(".")[1];
    if (customOrder.type == "Burger") {
      customOrder['meat'] = [selection];
    } else {
      customOrder['bread'] = selection;
    }
  });
	*/

  $('.side-select').change(function (){
    var select = $(this);
    var selection = select.val();
    var found = false;
    var new_section = "* Side: " + selection;
    var item_sections = itemJustSelected.get("name").split("<br>");
    for (var i=0; i<item_sections.length; i++) {
      if (item_sections[i].indexOf("* Side:") > -1) {
        item_sections[i] = new_section;
        found = true;
      }
    }
    if (!found) {
      item_sections.push(new_section);
    }
    var new_item_name = item_sections.join("<br>");
    itemJustSelected.set("name",new_item_name);
    simpleCart.update();
  });

  $('.sauce-select').change(function () {
    var select = $(this);
    var selection = select.val();
    var found = false;
    var new_section = "* Sauce: " + selection;
    var item_sections = itemJustSelected.get("name").split("<br>");
    for (var i=0; i<item_sections.length; i++) {
      if (item_sections[i].indexOf("* Sauce:") > -1) {
        item_sections[i] = new_section;
        found = true;
      }
    }
    if (!found) {
      item_sections.push(new_section);
    }
    var new_item_name = item_sections.join("<br>");
    itemJustSelected.set("name",new_item_name);
    simpleCart.update();
  });

  findAndReplaceSpecialRequest = function(oldName, specialRequest) {
    addition = "";
    if (specialRequest != "") {
      addition = "<br>* Special Request: " + specialRequest;
    }
    return oldName.replace(/<br>\* Special Request:[^<]*/g, "") + addition;
  }

  $('#special_request').focusout(function (e){
    specialRequest = $(this).val();
    //oldName = itemJustSelected.get('name');
    //newName = findAndReplaceSpecialRequest(oldName, specialRequest);
    //itemJustSelected.set('name',newName);
		customOrder['special_request'] = JSON.parse(JSON.stringify(specialRequest));
    itemJustSelected.set("name",orderToString(customOrder));
    simpleCart.update();
  });

// TODO add a onfocusout handler for special request box, add a new line and
// remove any other special requrset line 
//
  $('#custom-addtocart').click(function (e){
    this.parentElement.parentElement.classList.remove('active');
    extras = document.getElementById('menu-extras');
    extras.classList.add('active');
    lastActive = extras;

    orderName = orderToString(customOrder);
    specialRequest = $('#custom-special_request').val()
    if (specialRequest != "") {
      orderName += "<br>* Special Request: " + specialRequest;
    }
    itemJustSelected = simpleCart.add({
      name : orderName,
      price : customOrder.total_price
    });
    e.stopPropagation();
    newCustomOrder('');
    document.getElementById("menu-extras").scrollIntoView();
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
        // They want to enter a new card
        if (cardSelectDropdown.val() === "") {
            $('#card-form input').val('');
            $('#card-form .column:first').removeClass("hidden");
            $('#card-form').removeClass("one").addClass("two");
        } else {
            sp = cardSelectDropdown.val().split(",");
            lastFour = sp[0], name = sp[1], expiry = sp[2], brand = sp[3], zip = sp[4], cardIndex = sp[5];
            $('#card-number').val("••••-••••-••••-"+lastFour);
            $('#card-name').val(name).trigger("keyup").trigger("click");
            $('#card-expiry').val(expiry).trigger("keyup").trigger("click");
            $('#card-cvc').val("000").trigger("keyup").trigger("click");
            $('#card-zip').val(zip).trigger("keyup").trigger("click");
            $('#card-index').val(cardIndex);
            $('#card-number').trigger("keyup").trigger("click"); // updates display
            $('#card-form .form.segment').addClass("disabled");
            $('.card-wrapper').children().children().attr("class" ,"card identified " + brand.toLowerCase()); // pretty formatting
            $('#card-form .column:first').addClass("hidden");
            $('#card-form').removeClass("two").addClass("one");
        }
        
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

	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		 fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		 fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
						(verOffset=nAgt.lastIndexOf('/')) ) 
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
		browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
		 fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
		 fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}
	
	bug_browser = document.getElementById('bug-browser-field');
	if (bug_browser) {
		bug_browser.value = browserName + ' ' + fullVersion;
	}
	bug_os = document.getElementById('bug-os-field');
	if (bug_os) {
		bug_os.value = navigator.userAgent.split("(")[1].split(")")[0];
	}

});
