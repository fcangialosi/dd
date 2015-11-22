monify = function(x) {
  y = x.replace(/[^0-9\.]+/g, '').split(".");
  dollars = y[0];
  if (y.length > 1) {
    cents = "."+y[1].substring(0,2);
    while (cents.length < 3) {
      cents += "0";
    }
    return dollars+cents;
  } else {
    return dollars+".00";
  }
}
ready = function() {
  var taxExempt = $('#tax-exempt');
  var gratuityBox = $('#gratuity-box');
  taxExempt.change(function() {
    var taxRate = $('#tax-rate');
    if (this.checked) {
      simpleCart.setTaxRate(0);
      simpleCart.update();
      taxRate.text("0");
    } else {
      simpleCart.setTaxRate(0.06);
      simpleCart.update();
      taxRate.text("6");
    }
  });
  gratuityBox.on('input', function() {
    var gratuity = gratuityBox.val();
    simpleCart.setGratuity(gratuity);
    simpleCart.update();
  });
  gratuityBox.on('focusout', function() {
    var gratuity = gratuityBox.val();
    fixed = monify(gratuity);
    gratuityBox.val(fixed);
    simpleCart.setGratuity(fixed);
    simpleCart.update();
  });

  if (window.location.pathname == "/catering/order/submit" && $('#success-signal').length) {
    simpleCart.empty();
  }
};

$(document).ready(ready);