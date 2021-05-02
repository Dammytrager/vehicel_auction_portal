/**
 * This function is run when the featured vehicles page loads
 */
(function ($) {

    getSoldOutVehicles();

    /**
     * Gets the sold out vehicles from the backend
     */
    function getSoldOutVehicles() {
        $.ajax({
            url: "../../backend/api/sold-out-vehicles.php",
            success: base
        })
    }


    /**
     * This function runs when the sold out vehicles are successfully fetched from the backend
     * It renders the sold out vehicles in a table and also renders the navbar
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
        ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar actions={actions} />, document.querySelector('#navbar'));
    }

})(jQuery)
