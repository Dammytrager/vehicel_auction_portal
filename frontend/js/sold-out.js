(function ($) {

    getSoldOutVehicles();

    function getSoldOutVehicles() {
        $.ajax({
            url: "../../backend/api/sold-out-vehicles.php",
            success: base
        })
    }

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
