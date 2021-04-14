(function ($) {
    let loginBtn = $('#login-btn'),
        loginInput = $('.login-input'),
        loginAlertTemplate = $('#login-alert-template'),
        loginAlertTarget = $('#login-alert-target');

    loginInput.on('change keyup', function () {
        btnValid();
    })


    loginBtn.on('click', function () {
        $(this).html('Submitting...').attr('disabled', true);
        signup();
    })

    function btnValid() {
        let isValid = true;
        loginInput.each((index, item) => {
            isValid = isValid && !!$(item).val();
        })
        const passwordMatch = $('#password').val() === $('#confirm_password').val();

        isValid = isValid && passwordMatch;

        loginBtn.attr('disabled', !isValid)
    }

    function render(template, target, object) {
        const rendered = Mustache.render(template, object);
        target.html(rendered);
    }

    function signup() {
        const data = {
            username: $('#username').val(),
            password: $('#password').val(),
            isAdmin: 0
        };

        $.ajax({
            url: "../../backend/api/create-user.php",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            method: 'POST',
            success: function (data, textStatus, jqXHR) {
                loginBtn.html('Submit').attr('disabled', false);
                if (textStatus === 'success') {
                    // Save to Local Storage
                    sessionStorage.setItem('message', 'Account created successfully');
                    location.href = 'login.html'
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loginBtn.html('Submit').attr('disabled', false);
                if (errorThrown === 'Bad Request') {
                  toastr.error('User Exists');
                } else {
                  toastr.error('Unknown error occured');
                }
            }
        })
    }
})(jQuery)
