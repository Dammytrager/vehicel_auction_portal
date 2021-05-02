/**
 * This function runs when the active vehicles page loads
 */
(function ($) {

    const user = JSON.parse(localStorage.getItem('user'));

    getActiveVehicles();

    /**
     * Gets the active vehicles from the backend
     */
    function getActiveVehicles() {
        $.ajax({
            url: "../../backend/api/active-vehicles.php",
            success: base
        })
    }

    /**
     * This function runs when the active vehicles are successfully fetched from the backend
     * It renders the active vehicles in a table and also renders the navbar
     * @param data
     * @param textStatus
     * @param jqXHR
     */
    function base (data, textStatus, jqXHR) {
        vehicles = JSON.parse(data);
        const actions = [
            {
                label: 'View',
                target: '#base-modal',
                classType: 'view-btn'
            },
            {
                label: 'Comment',
                target: '#base-modal',
                classType: 'comment-btn'
            }
        ];

        if (!(user && (user.is_admin || user.is_ceo_cto))) {
            actions.push({
                label: 'Vote',
                target: '#base-modal',
                classType: 'vote-btn'
            })
        }

        ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar actions={actions} />, document.querySelector('#navbar'));
    }

})(jQuery)
