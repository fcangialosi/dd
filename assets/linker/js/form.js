$('#signup-form')
  .form({
    firstName: {
      identifier  : 'firstName',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your first name'
        }
      ]
    },
    lastName: {
      identifier  : 'lastName',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your last name'
        }
      ]
    },
    email: {
      identifier : 'email',
      rules: [
        {
          type   : 'empty',
          prompt : "Please enter an email address"
        },
        {
          type : 'email',
          prompt : 'Please enter a valid email address'
        }
      ]
    },
    companyName : {
      identifier : 'companyName',
      rules : [
        {
          type : 'empty',
          prompt : 'Please enter the name of the company you are ordering for'
        }
      ]
    },
    phoneNumber : {
      identifier : 'phone',
      rules : [
        {
          type : 'empty',
          prompt : 'Please enter a phone number'
        },
        {
          type : 'phone',
          prompt : 'Please enter a valid phone number'
        }
      ]
    },
    password: {
      identifier : 'password',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a password'
        },
        {
          type   : 'length[6]',
          prompt : 'Your password must be at least 6 characters'
        }
      ]
    },
    confirm: {
      identifier : 'confirm',
      rules: [
      {
        type : 'empty',
        prompt : 'Please confirm your password'
      },
      {
        type : 'match[password]',
        prompt : "Woops, you must have made a small typo! The two passwords don't match"
      }
      ]
    }
  })
;
$('#signin-form')
  .form({
    email: {
      identifier : 'email',
      rules: [
        {
          type   : 'empty',
          prompt : "Please enter an email address"
        },
        {
          type : 'email',
          prompt : 'Please enter a valid email address'
        }
      ]
    },
    password: {
      identifier : 'password',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a password'
        },
        {
          type   : 'length[6]',
          prompt : 'Your password must be at least 6 characters'
        }
      ]
    }
  })
;
$('#new-delivery-form')
  .form({
    contactName: {
      identifier  : 'name',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter the name of who we can contact regarding your order'
        }
      ]
    },
    contactPhone : {
      identifier : 'phone',
      rules : [
        {
          type : 'empty',
          prompt : 'Please enter a the phone number of who we can contact regarding your order'
        },
        {
          type : 'phone',
          prompt : 'Please enter a valid phone number'
        }
      ]
    },
    deliveryAddress: {
      identifier : 'address',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a delivery address'
        }
      ]
    },
    deliveryCity: {
      identifier : 'city',
      rules: [
        {
          type : 'empty',
          prompt : 'Please enter the city name'
        }
      ]
    }
  })
;
$('#select-delivery-form')
  .form({
    time : {
      identifier : 'time',
      rules : [
        {
          type : 'empty',
          prompt : 'Please choose a time for your delivery!'
        }
      ]
    },
    date : {
      identifier : 'date',
      rules : [
        {
          type : 'empty',
          prompt : 'Please choose a date for your delivery!'
        }
      ]
    },
    deliveryIndex : {
      identifier : 'deliveryIndex',
      rules : [
        {
          type : 'not[-1]',
          prompt : 'Please choose a location or add a new one!'
        }
      ]
    }
  })
;
$('#card-form')
  .form({
    cardNumber: {
      identifier  : 'number',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your credit card number'
        },
        {
          type   : 'maxLength[19]',
          prompt : 'Please enter a valid credit card number'
        },
        {
          type   : 'length[12]',
          prompt : 'Please enter a valid credit card number'
        }
      ]
    },
    cardName: {
      identifier  : 'name',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your name as it appears on your card'
        }
      ]
    },
    cardExpiry: {
      identifier : 'expiry',
      rules: [
        {
          type   : 'empty',
          prompt : "Please enter the experation date of your credit card"
        },
        {
          type   : 'length[9]',
          prompt : 'Please make sure you entered a valid experation date!'
        },
        {
          type   : 'maxLength[9]',
          prompt : 'Please make sure you entered a valid experation date!'
        }
      ]
    },
    cardCvc : {
      identifier : 'cvc',
      rules : [
        {
          type : 'empty',
          prompt : 'Please enter the 3-digit CVC code on the back of your card'
        },
        {
          type   : 'length[3]',
          prompt : 'Your CVC code should be exactly 3 numbers'
        },
        {
          type   : 'maxLength[3]',
          prompt : 'Your CVC code should be exactly 3 numbers'  
        }
      ]
    }
  })
;