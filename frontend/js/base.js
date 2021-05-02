/**
 * This function is run when the all vehicles page (home page) loads
 */
(function ($) {

    getVehicles();

    /**
     * Gets all vehicles from the backend
     */
    function getVehicles() {
        $.ajax({
            url: "../../backend/api/get-vehicles.php",
            success: base
        })
    }

    /**
     * This function runs when all the vehicles are successfully fetched from the backend
     * It renders all the vehicles in a table and also renders the navbar
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
        ReactDOM.render(<Table data={vehicles} actions={actions}/>, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar actions={actions}/>, document.querySelector('#navbar'));
    }
})(jQuery)
