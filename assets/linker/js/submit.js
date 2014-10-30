ready = function() {
  var taxExempt = $('#tax-exempt');
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

};

$(document).ready(ready);