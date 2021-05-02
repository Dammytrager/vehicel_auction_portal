/**
 * This function is run when the admin users page loads
 */
(function ($) {

    const user = JSON.parse(localStorage.getItem('user'));

    // Redirect the user to the home page if they are not signed in or if they are not an admin or ceo_cto
    if (!user || (!user.is_admin && !user.is_ceo_cto)) {
        location.replace('index.html');
    }

    else {
        AdminUsers();
    }

    /**
     * Gets the admin users from the backend
     */
    function AdminUsers() {
        $.ajax({
            url: "../../backend/api/admin-users.php",
            success: base
        })
    }

    /**
     * This function runs when the admin users are successfully fetched from the backend
     * It renders the admin users in a table and also renders the navbar
     * @param data
     * @param textStatus
     * @param jqXHR
     */
    function base (data, textStatus, jqXHR) {
        users = JSON.parse(data);

        ReactDOM.render(<UsersTable data={users} />, document.querySelector('#users'));
        ReactDOM.render(<NavBar />, document.querySelector('#navbar'));
    }

})(jQuery)
