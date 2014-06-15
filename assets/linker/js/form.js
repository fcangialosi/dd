$('.ui.form')
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