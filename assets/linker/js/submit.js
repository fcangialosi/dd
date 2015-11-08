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

  if (window.location.pathname == "/catering/order/submit" && $('#success-signal').length) {
    simpleCart.empty();
  }
};

$(document).ready(ready);