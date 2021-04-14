(function ($) {
    let loginBtn = $('#login-btn'),
        loginInput = $('.login-input'),
        loginAlertTemplate = $('#login-alert-template'),
        loginAlertTarget = $('#login-alert-target');

    const message = sessionStorage.getItem('message');
    const redirect = sessionStorage.getItem('redirect');

    if (message) {
      toastr.success(message);
      sessionStorage.removeItem('message')
    }

    if (redirect) {
      toastr.info('You need to Login to make a bid');
      sessionStorage.removeItem('redirect');
    }

    loginInput.on('change keyup', function () {
        btnValid();
    })


    loginBtn.on('click', function () {
        $(this).html('Submitting...').attr('disabled', true);
        login();
    })

    function btnValid() {
        let isValid = true;
        loginInput.each((index, item) => {
            isValid = isValid && !!$(item).val();
        })

        loginBtn.attr('disabled', !isValid)
    }

    function render(template, target, object) {
        const rendered = Mustache.render(template, object);
        target.html(rendered);
    }

    function login() {
        const data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: "../../backend/api/login.php",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            method: 'POST',
            success: function (data, textStatus, jqXHR) {
                loginBtn.html('Submit').attr('disabled', false);
                if (textStatus === 'success') {
                    // Save to Local Storage
                    localStorage.setItem('user', data);
                    location.href = redirect || 'index.html'
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loginBtn.html('Submit').attr('disabled', false);
                if (errorThrown === 'Unauthorized') {
                  toastr.error('Invalid Credentials');
                } else {
                  toastr.error('Unknown error occured');
                }
            }
        })
    }
})(jQuery)
