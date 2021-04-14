(function ($) {

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || (!user.is_admin && !user.is_ceo_cto)) {
        location.replace('index.html');
    }

    else {
        AdminUsers();
    }

    function AdminUsers() {
        $.ajax({
            url: "../../backend/api/admin-users.php",
            success: base
        })
    }

    function base (data, textStatus, jqXHR) {
        users = JSON.parse(data);

        ReactDOM.render(<UsersTable data={users} />, document.querySelector('#users'));
        ReactDOM.render(<NavBar />, document.querySelector('#navbar'));
    }

})(jQuery)
